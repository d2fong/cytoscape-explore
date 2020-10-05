import React, { Component } from 'react';
// import Tippy from '@tippy.js/react';
import StylePicker from '../style/style-picker';
import Popover from '@material-ui/core/Popover';


export class StylePickerButton extends Component  {

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null
    };
  }

  handleClick(event) {
    this.setState({
      anchorEl: event.currentTarget
    });
  }

  handleClose() {
    this.setState({
      anchorEl: null
    });
  }

  render() {
    const ref = React.createRef();
    // const tooltip = this.props.title;
    const { anchorEl } = this.state;

    return (
      <div>
        <button 
          onClick={e => this.handleClick(e)}
          className="style-panel-button plain-button">
          <i className="material-icons">{this.props.buttonIcon}</i>
        </button>
        <Popover 
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => this.handleClose()}
          onEnter={() => ref.current.onShow && ref.current.onShow()}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <StylePicker ref={ref} {...this.props} />
        </Popover>
      </div>
    );
  }

  // return (
  //   <Tippy
  //     interactive={true}
  //     trigger='click'
  //     theme='light'
  //     // hideOnClick={false}
  //     onShow={() => ref.current.onShow && ref.current.onShow()}
  //     content={
  //       <StylePicker ref={ref} {...props} />
  //     }>
  //     <Tippy content={tooltip}>
  //       <button className="style-panel-button plain-button">
  //         <i className="material-icons">{props.buttonIcon}</i>
  //       </button>
  //     </Tippy>
  //   </Tippy>
  // );
}

export default StylePickerButton;