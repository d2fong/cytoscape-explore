import EventEmitter from 'eventemitter3';
import { styleFactory } from '../../../model/style';
import { CytoscapeSyncher } from '../../../model/cytoscape-syncher';
import Cytoscape from 'cytoscape';

export class NetworkEditorController {
  constructor(cy, cySyncher, bus){
    /** @type Cytoscape */
    this.cy = cy;

    /** @type CytoscapeSyncher */
    this.cySyncher = cySyncher;

    /** @type EventEmitter */
    this.bus = bus || new EventEmitter();

    this.drawModeEnabled = false;
  }

  addNode() {
    function randomArg(... args) {
      return args[Math.floor(Math.random() * args.length)];
    }
    const node = this.cy.add({
      renderedPosition: { x: 100, y: 50 },
      data: {
        attr1: Math.random(), // betwen 0 and 1
        attr2: Math.random() * 2.0 - 1.0, // between -1 and 1
        attr3: randomArg("A", "B", "C")
      }
    });

    this.bus.emit('addNode', node);
  }

  toggleDrawMode(bool = !this.drawModeEnabled){
    if( bool ){
      this.eh.enableDrawMode();
      this.bus.emit('enableDrawMode');
    } else {
      this.eh.disableDrawMode();
      this.bus.emit('disableDrawMode');
    }

    this.drawModeEnabled = bool;

    this.bus.emit('toggleDrawMode', bool);
  }

  enableDrawMode(){
    return this.toggleDrawMode(true);
  }

  disableDrawMode(){
    this.toggleDrawMode(false);
  }

  deletedSelectedElements(){
    const deletedEls = this.cy.$(':selected').remove();

    this.bus.emit('deletedSelectedElements', deletedEls);
  }

  getPublicAttributes() {
    const attrNames = new Set();
    const nodes = this.cy.nodes();
    nodes.forEach(n => {
      const attrs = Object.keys(n.json().data);
      attrs.forEach(a => {
        attrNames.add(a)
      });
    });
    return Array.from(attrNames);
  }

  setNodeColor(color){
    console.log("setNodeColor");
    this.cySyncher.setStyle('node', 'background-color', styleFactory.color(color));
  }

  setNodeColorMapping(attribute, value) {
    console.log("setNodeColorMapping");
    const {hasVal, min, max} = this._minMax(attribute);
    if(!hasVal)
      return;

    const style = styleFactory.linearColor(attribute,  min,  max, value.styleValue1, value.styleValue2);
    this.cySyncher.setStyle('node', 'background-color', style);
  }

  setNodeSize(size) {
    console.log("setNodeSize");
    this.cySyncher.setStyle('node', 'width',  styleFactory.number(size));
    this.cySyncher.setStyle('node', 'height', styleFactory.number(size));
  }

  setNodeSizeMapping(attribute, value) {
    console.log("setNodeSizeGradient");
    const {hasVal, min, max} = this._minMax(attribute);
    if(!hasVal)
      return;

    const style = styleFactory.linearNumber(attribute,  min,  max, value.styleValue1, value.styleValue2);
    this.cySyncher.setStyle('node', 'width',  style);
    this.cySyncher.setStyle('node', 'height', style);
  }
   
  /**
   * Returns the min and max values of a numeric attribute.
   */
  _minMax(attribute, eles) {
    eles = eles || this.cy.elements();
    let hasVal = false;
    let min = Number.POSITIVE_INFINITY; 
    let max = Number.NEGATIVE_INFINITY;

    // compute min and max values
    eles.forEach(ele => {
      const val = ele.data(attribute);
      if(val) {
        console.log(val);
        hasVal = true;
        min = Math.min(min, val);
        max = Math.max(max, val);
      }
    }); 

    return {hasVal, min, max};
  }
  
}