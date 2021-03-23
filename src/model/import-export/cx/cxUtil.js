export const getCxVersion = (versionString) => {
    const versionArray = versionString.split('.').map((numberString) => { return parseInt(numberString, 10); });
    if (versionArray.length !== 2 && versionArray.length != 3) {
        throw 'Incompatible version format: ' + versionString;
    }
    versionArray.forEach(element => {
        if (isNaN(element)) {
            throw 'Non-integer value in version string: ' + versionString;
        }
    });
    return versionArray;
};

export const getCxMajorVersion = (versionString) => {
    return versionString ? getCxVersion(versionString)[0] : 1;
};

export const CX_TO_JS = 'CX_TO_JS';
export const JS_TO_CX = 'JS_TO_CX';

export const processAttributeDeclarations = (cxAttributeDeclarations, 
    nodeAttributeNameMap, 
    nodeAttributeTypeMap, 
    nodeAttributeDefaultValueMap, 
    edgeAttributeNameMap, edgeAttributeTypeMap, 
    edgeAttributeDefaultValueMap, conversionDirection = CX_TO_JS) => {
    //console.log(" cxAttributeDeclarations: " + JSON.stringify(cxAttributeDeclarations, null, 2));
    cxAttributeDeclarations.forEach((cxAttributeDeclaration) => {
        if (cxAttributeDeclaration['nodes']) {
            updateAttributeNameMap(nodeAttributeNameMap, cxAttributeDeclaration.nodes, conversionDirection);
            updateAttributeTypeMap(nodeAttributeTypeMap, cxAttributeDeclaration.nodes);
            updateAttributeDefaultValueMap(nodeAttributeDefaultValueMap, cxAttributeDeclaration.nodes);
        }
        if (cxAttributeDeclaration['edges']) {
            updateAttributeNameMap(edgeAttributeNameMap, cxAttributeDeclaration.edges, conversionDirection);
            updateAttributeTypeMap(edgeAttributeTypeMap, cxAttributeDeclaration.edges);
            updateAttributeDefaultValueMap(edgeAttributeDefaultValueMap, cxAttributeDeclaration.edges);
        }
    });
};

export const updateAttributeTypeMap = (attributeTypeMap, attributeDeclarations) => {
    Object.keys(attributeDeclarations).forEach((attributeName) => {
        const attributeDeclaration = attributeDeclarations[attributeName];
        if (attributeDeclaration['d']) {
            attributeTypeMap.set(attributeName, attributeDeclaration.d);
        }
    });
};

export const updateAttributeNameMap = (attributeNameMap, attributeDeclarations, conversionDirection) => {
    Object.keys(attributeDeclarations).forEach((attributeName) => {
        const attributeDeclaration = attributeDeclarations[attributeName];
        if (attributeDeclaration['a']) {
            //console.log('attribute ' + attributeDeclaration.a + ' should be renamed to ' + attributeName);
            if (conversionDirection === CX_TO_JS) {
                attributeNameMap.set(attributeDeclaration.a, attributeName); 
            } else if (conversionDirection === JS_TO_CX) {
                attributeNameMap.set(attributeName, attributeDeclaration.a); 
            }
        }
    });
};

export const updateAttributeDefaultValueMap = (attributeDefaultValueMap, attributeDeclarations) => {
    Object.keys(attributeDeclarations).forEach((attributeName) => {
        const attributeDeclaration = attributeDeclarations[attributeName];
        if (attributeDeclaration['v']) {
            //console.log('attribute ' + attributeName + ' has default value ' + attributeDeclaration.v);
            attributeDefaultValueMap.set(attributeName, attributeDeclaration.v);
        }
    });
};

export const updateInferredTypes = (attributeTypeMap, attributeNameMap, v) => {
    v && Object.keys(v).forEach((key) => {
        if (!attributeTypeMap.has(key)) {
            const value = v[key];
            const inferredType = typeof value;
            const newKey = attributeNameMap.has(key) ? attributeNameMap.get(key) : key;
            attributeTypeMap.set(newKey, inferredType);
        }
    });
};

export const getExpandedAttributes = (v, attributeNameMap, attributeDefaultValueMap) => {
    let data = {};
    v && Object.keys(v).forEach((key) => {
        const newKey = attributeNameMap.has(key) ? attributeNameMap.get(key) : key;
        data[newKey] = v[key];
    });
    attributeDefaultValueMap.forEach((value, key) => {
        if (!data[key]) {
            data[key] = value;
        }
    });
    return data;
};

