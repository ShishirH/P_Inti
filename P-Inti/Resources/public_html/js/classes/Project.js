var connectableElements = null;
var pendingConnections = null;







//function executePendingConnections(objectXmlID) {
//    
//    
//    console.log("%c" + "Executing pending connections for element with ID: " + objectXmlID, "background: rgb(81,195,183); color: white;");
//
//    if (!pendingConnections || pendingConnections.length === 0) {
//        console.log("%c" + "There are not pending connections at the moment!!!: " + objectXmlID, "background: rgb(81,195,183); color: white;");
//        return;
//    }
//
//    
//    var cont = 0;
//
//    for (var i = pendingConnections.length - 1; i >= 0; i--) { // We iterate in reverse, as the removal of elements from the array will change its size
//        var connectorNode = pendingConnections[i];
//
//        var fromID = Number(connectorNode.attr('from'));
//        var toID = Number(connectorNode.attr('to'));
//
//        if (objectXmlID === fromID || objectXmlID === toID) {
//            if (createConnectorFromXMLNode(connectorNode)) { // We check if the connection was succesful. Only in that case the connection is removed from the array
//                fabric.util.removeFromArray(pendingConnections, connectorNode);
//                cont++;
//            }
//        }
//    }
//
//    console.log("%c" + cont + " connections executed sucessfully for element with ID: " + objectXmlID, "background: rgb(81,195,183); color: white;");
//
//    var totalPendingConnections = pendingConnections.length;
//    console.log("%c" + "There are STILL " + totalPendingConnections + " connections!", "background: #0afff9; color: black;");
//}






//function makeConnections($rootElement) {
//
//    var connectorNodes = $rootElement.find('connector');
//
//    console.log(connectorNodes.length + " CONNECTORS found!");
//
//    connectorNodes.each(function () {
//
//        var $connectorNode = $(this);
//
//        var sourceID = Number($connectorNode.find('source').text());
//        var destinationID = Number($connectorNode.find('destination').text());
//
//        var value = $connectorNode.find('destination').text(); // TODO: the value could be a composite data, so, this should be another structured XML element
//        var color = $connectorNode.find('arrowColor').text();
//
////        var sourceElement = getElementBySerialID(sourceID);
////        var destinationElement = getElementBySerialID(destinationID);
//        var sourceElement = getFabricElementByXmlID(sourceID);
//        var destinationElement = getFabricElementByXmlID(destinationID);
//
//        console.log("sourceElement:");
//        console.log(sourceElement);
//
//        console.log("destinationElement:");
//        console.log(destinationElement);
//
//        var sourceAttribute = $connectorNode.find('sourceAttribute').text();
//        if (sourceAttribute) {
//            sourceElement = sourceElement.getVisualPropertyByAttributeName(sourceAttribute);
//        }
//
//        var destinationAttribute = $connectorNode.find('destinationAttribute').text();
//        if (destinationAttribute) {
//            destinationElement = destinationElement.getVisualPropertyByAttributeName(destinationAttribute);
//        }
//
//
//        console.log("sourceElement:");
//        console.log(sourceElement);
//
//        console.log("destinationElement:");
//        console.log(destinationElement);
//
//        if (sourceElement && destinationElement) {
//            connectElements(sourceElement, destinationElement, value, color);
//        }
//    });
//
//}

/*function getFabricElementByXmlID(xmlID) {
    var canvasObjects = canvas.getObjects();
    for (var i = 0; i < canvasObjects.length; i++) {
        var object = canvas.item(i);
        if (object.xmlID === xmlID) {
            return object;
        } else {

            if (object.isMark) { // If this object is a mark, we also have to look in its position visual properties and, if it is compressed in its all other one

                if (object.xVisualProperty.xmlID === xmlID) {
                    return object.xVisualProperty;
                } else if (object.yVisualProperty.xmlID === xmlID) {
                    return object.yVisualProperty;
                } else if (object.isCompressed) {

                    var visualProperties = object.visualProperties;

                    for (var j = 0; j < visualProperties.length; j++) {
                        var visualProperty = visualProperties[j];
                        if (visualProperty && visualProperty.xmlID === xmlID) {
                            return visualProperty;
                        }

                    }



                }


            } else if (object.isExtractor) { // If this object is a mark, we also have to look in its position visual properties and, if it is compressed in its all other one

                if (object.isCompressed) {

                    var visualProperties = object.visualProperties;

                    for (var j = 0; j < visualProperties.length; j++) {
                        var visualProperty = visualProperties[j];
                        if (visualProperty && visualProperty.xmlID === xmlID) {
                            return visualProperty;
                        }

                    }

                }


            } else if (object.isVerticalCollection && object.isCompressed) {

                var visualValues = object.visualValues;
                for (var j = 0; j < visualValues.length; j++) {
                    var visualValue = visualValues[j];
                    if (visualValue && visualValue.xmlID === xmlID) {
                        return visualValue;
                    }
                }

            } else if (object.isNumericCollectionGenerator && object.isCompressed) {

                var visualProperties = object.visualProperties;

                for (var j = 0; j < visualProperties.length; j++) {
                    var visualProperty = visualProperties[j];

                    if (visualProperty && visualProperty.xmlID === xmlID) {
                        return visualProperty;
                    }

                }
            }
        }
    }

    console.log("%c" + "!!!!!!!!!!!! xmlID " + xmlID + " not FOUND!!!", "background: red; color: yellow;");

    return null;
}*/