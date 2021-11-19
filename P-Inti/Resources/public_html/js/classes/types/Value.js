function Value(options) {

    for (var prop in options) {
        this[prop] = options[prop];
    }

    this.interpolateTo = function (anotherValue, steps) {

        var thisValue = this;

        if (thisValue.dataTypeProposition !== anotherValue.dataTypeProposition) {
            return null;
        }

        if (thisValue.isNumberValue) {

            return interpolateNumbers(thisValue.number, anotherValue.number, steps);

        } else if (thisValue.isStringValue) {

        } else if (thisValue.isDurationValue) {

        } else if (thisValue.isDateAndTimeValue) {

        } else if (thisValue.isColorValue) {

            return interpolateColors(thisValue.color.toHex(), anotherValue.color.toHex(), steps);

        } else if (thisValue.isShapeValue) {

        }

        return null;

    };

    this.associateOperationsFunctions = function () {
        var theValue = this;
        Object.keys(iVoLVER._dataTypes).forEach(function (registeredType) {
            var operations = iVoLVER.getOperationsForType(registeredType);
            Object.keys(operations).forEach(function (operation) {

                theValue[operation] = function (aValue) {
                    
                    /*console.log("registeredType:");
                    console.log(registeredType);*/
                                        
                    var tmpMethodName = operation + '' + aValue.getDataType();

                    // console.log("operation:" + operation);

                    var functionCode = iVoLVER.getOperationsForType(theValue.getDataType())[operation][aValue.getDataType()];
                    
                    /*console.log("operations[operation][aValue.getDataType()]");
                    console.log("operations["+operation+"]["+aValue.getDataType()+"]"); 
                    console.log("functionCode:");
                    console.log(functionCode);*/

                    theValue[tmpMethodName] = functionCode;

//                    console.log("tmpMethodName:" + tmpMethodName);
                    
                    if (theValue[tmpMethodName]) {
                        return theValue[tmpMethodName](aValue);
                    } else {
                        throw "The <b>" + theValue.getDataType() + "</b> data type does not define the <b>" + operation + "</b> operation on <b>" + aValue.getDataType() + "</b> values. A <b>" + theValue.getDataType() + "</b> cannot be <b>" + operation + "ed</b> to a <b>" + aValue.getDataType() + "</b>.";
                    }
                    
                };

            });
        });
    };


    this.equals = function (anotherValue) {

        var thisValue = this;

        if (LOG)
            console.log("Comparing:");

        if (LOG)
            console.log("thisValue:");
        if (LOG)
            console.log(thisValue);

        if (LOG)
            console.log("with this other value:");
        if (LOG)
            console.log(anotherValue);

        if (thisValue.dataTypeProposition !== anotherValue.dataTypeProposition) {
            if (LOG)
                console.log("uno");
            return false;
        }

        if (thisValue.isNumberValue) {

            /*if (anotherValue.units !== thisValue.units) {
             if (LOG) console.log("dos");
             return false;
             }*/

            if (anotherValue.inPrefix === thisValue.inPrefix) {
                if (LOG)
                    console.log("tres");
                return (anotherValue.unscaledValue == thisValue.unscaledValue);
            }

            var convertedNumber = createNumericValue(anotherValue.unscaledValue, anotherValue.inPrefix, thisValue.inPrefix, thisValue.units);

            if (LOG)
                console.log("convertedNumber:");
            if (LOG)
                console.log(convertedNumber);

            if (LOG)
                console.log("thisValue:");
            if (LOG)
                console.log(thisValue);

            if (LOG)
                console.log("cuatro");

            return (convertedNumber.number === thisValue.unscaledValue);

        }

        return false;

    };

    this.getValueType = function () {
        if (this.isNumberValue) {
            return NUMERIC;
        } else if (this.isStringValue) {
            return STRING;
        } else if (this.isDurationValue) {
            return DURATION;
        } else if (this.isDateAndTimeValue) {
            return DATEANDTIME;
        } else if (this.isColorValue) {
            return COLOR;
        } else if (this.isShapeValue) {
            return SHAPE;
        } else {
            return null;
        }
    };


    this.toXML = function () {

        var valueNode = createXMLElement("value");
        addAttributeWithValue(valueNode, "type", this.getValueType());

        if (this.isNumberValue) {

            appendElementWithValue(valueNode, "unscaledValue", this.unscaledValue);
            appendElementWithValue(valueNode, "inPrefix", this.inPrefix);
            appendElementWithValue(valueNode, "outPrefix", this.outPrefix);
            appendElementWithValue(valueNode, "units", this.units);

        } else if (this.isStringValue) {

            appendElementWithValue(valueNode, "string", this.string);

        } else if (this.isDurationValue) {

            appendElementWithValue(valueNode, "duration", this.duration.asMilliseconds());
            appendElementWithValue(valueNode, "outputUnits", this.outputUnits);

        } else if (this.isDateAndTimeValue) {

            appendElementWithValue(valueNode, "moment", this.moment.format());

        } else if (this.isColorValue) {

            appendElementWithValue(valueNode, "color", this.color.toRgba());

        } else if (this.isShapeValue) {

            appendElementWithValue(valueNode, "shape", this.shape);

            if (LOG) {
                console.log("this: ++++++++++++++++++++++++++++");
                console.log(this);
            }



            if (this.shape === PATH_MARK || this.shape === FILLEDPATH_MARK) {
                appendCDATAWithValue(valueNode, "path", this.path);
            } else if (this.shape === SVGPATHGROUP_MARK) {
                appendCDATAWithValue(valueNode, "svgPathGroupMark", this.svgPathGroupMark.SVGString);
            }

//            if (this.svgPathGroupMark) {
//                if (this.shape === PATH_MARK || this.shape === FILLEDPATH_MARK) {
//                    appendCDATAWithValue(valueNode, "path", this.svgPathGroupMark.path);
//                } else {
//                    appendCDATAWithValue(valueNode, "svgPathGroupMark", this.svgPathGroupMark.SVGString);
//                }
//            }

        }

        return valueNode;

    };

    this.getDisplayableString = function (options) {

        if (this.isNumberValue) {
            var valueToShow = this.number % 1 === 0 ? this.number : this.number.toFixed(2);
//         return valueToShow + ' ' + this.outPrefix + this.units;
//         return this.number + ' ' + (this.outPrefix || '') + this.units;

            var decimalPositions = 2;
            if (options && options.showAsInteger) {
                decimalPositions = 0;
            }

//            var theString = this.number.toFixed(decimalPositions) + " " + (this.outPrefix || "") + (this.units || "");

            var tmp = "";
            if (this.outPrefix) {
                tmp = this.outPrefix.substring(0, this.outPrefix.indexOf(' '));
                tmp = tmp.trim();
            }

            var theString = this.number.toFixed(decimalPositions) + " " + tmp + (this.units || "");

            return theString.trim();



        } else if (this.isStringValue) {
            return this.string;
        } else if (this.isDurationValue) {
            return this.duration.as(this.outputUnits).toFixed(2) + ' ' + this.outputUnits;
        } else if (this.isDateAndTimeValue) {
//            return this.moment.format('DD/MMM/YYYY, HH:mm:ss');
            return this.moment.format('HH:mm:ss') + "\n" + this.moment.format('DD/MMM/YYYY');
        } else if (this.isColorValue) {
            return this.color.toRgb();
        } else if (this.isShapeValue) {
            return this.shape;
        }

    };




    this.convertTo = function (newValueType) {

        var convertedValue = null;

        if (this.isDurationValue) {

            if (newValueType === NUMERIC) {

                var units = this.outputUnits;
                var unscaledValue = this.duration.as(units);
                var inPrefix = null;
                var outPrefix = null;
                return createNumericValue(unscaledValue, inPrefix, outPrefix, units);

            } else if (newValueType === STRING) {

                return  new Value({isStringValue: true, string: '' + this.duration.as(this.outputUnits).toFixed(2) + ' ' + this.outputUnits});

            }

        } else if (this.isShapeValue) {

            if (newValueType === STRING) {

                return  new Value({isStringValue: true, string: '' + this.shape});

            }

        } else if (this.isStringValue) {

            if (newValueType === NUMERIC) {
                var number = Number(this.string);
                if (!isNaN(number)) {
                    return createNumericValue();
                }
                return null;
            }

        } else if (this.isNumberValue) {

            if (newValueType === STRING) {

                return  new Value({isStringValue: true, string: this.getDisplayableString()});

            }

        } else if (this.isColorValue) {

            if (newValueType === STRING) {

                return  new Value({isStringValue: true, string: '' + this.color.toRgb()});

            }

        } else if (this.isDateAndTimeValue) {

            if (newValueType === STRING) {

                return  new Value({isStringValue: true, string: '' + this.getDisplayableString()});

            }

        }

        return convertedValue;

    };

    this.convert = function (newVisualValueProposition) {

        var convertedValue = null;

        if (this.isDurationValue) {

            if (newVisualValueProposition === 'isNumberValue') {


                if (LOG)
                    console.log("Going to convert: ");
                if (LOG)
                    console.log(this);

                var units = this.outputUnits;
                var unscaledValue = this.duration.as(units);
                var inPrefix = null;
                var outPrefix = null;
                return createNumericValue(unscaledValue, inPrefix, outPrefix, units);

            } else if (newVisualValueProposition === 'isStringValue') {

                return  new Value({isStringValue: true, string: '' + this.duration.as(this.outputUnits).toFixed(2) + ' ' + this.outputUnits});

            }

        } else if (this.isShapeValue) {

            if (newVisualValueProposition === 'isStringValue') {

                return  new Value({isStringValue: true, string: '' + this.shape});

            }

        } else if (this.isStringValue) {

            if (newVisualValueProposition === 'isNumberValue') {
                var number = Number(this.string);
                if (!isNaN(number)) {
                    return createNumericValue();
                }
                return null;
            }

        } else if (this.isNumberValue) {

            if (newVisualValueProposition === 'isStringValue') {

                return  new Value({isStringValue: true, string: this.getDisplayableString()});

            }

        } else if (this.isColorValue) {

            if (newVisualValueProposition === 'isStringValue') {

                return  new Value({isStringValue: true, string: '' + this.color.toRgb()});

            }

        } else if (this.isDateAndTimeValue) {

            if (newVisualValueProposition === 'isStringValue') {

                return  new Value({isStringValue: true, string: '' + this.getDisplayableString()});

            }

        }

        return convertedValue;

    };

    /*this.subtract = function (theOtherValue, outputPrefix) {
     
     var thisValue = this;
     
     if (thisValue.isNumberValue) {
     
     if (theOtherValue.isNumberValue) { /////////////// Subtracting NUMBERS ///////////////
     
     return subtractNumbers(thisValue, theOtherValue, outputPrefix);
     
     } else {
     return null;
     }
     
     } else if (thisValue.isDateAndTimeValue) {
     
     if (theOtherValue.isDateAndTimeValue) { /////////////// Subtracting DATES ///////////////
     
     var outputUnits = outputPrefix || 'milliseconds';
     
     return computeDateDifference(thisValue.moment, theOtherValue.moment, outputUnits);
     
     } else {
     return null;
     }
     
     } else if (thisValue.isColorValue) {
     
     } else if (thisValue.isDurationValue) {
     
     } else if (thisValue.isShapeValue) {
     
     } else if (thisValue.isStringValue) {
     
     } else {
     return null;
     }
     
     };*/

    this.clone = function () {
        var clonedValue = null;
        if (this.isColorValue) {
            clonedValue = createColorValue(new fabric.Color(this.color.toRgb()));
        } else if (this.isDateAndTimeValue) {
            clonedValue = createDateAndTimeValue(this.moment);
        } else if (this.isNumberValue) {
            var unscaledValue = this.unscaledValue;
            var inPrefix = this.inPrefix;
            var outPrefix = this.outPrefix;
            var units = this.units;
            clonedValue = createNumericValue(unscaledValue, inPrefix, outPrefix, units);
        } else if (this.isDurationValue) {
            clonedValue = createDurationValue(this.duration, this.outputUnits);
        } else if (this.isShapeValue) {
            clonedValue = createShapeValue(this.shape, this.svgPathGroupMark);
        } else if (this.isStringValue) {
            clonedValue = createStringValue(this.string);
        }
        if (clonedValue) {
            clonedValue.onChange = this.onChange;
            clonedValue.operations = this.operations;
        }
        return clonedValue;
    };

    this.getTypeProposition = function () {
        if (this.isColorValue) {
            return "isColorValue";
        } else if (this.isDateAndTimeValue) {
            return "isDateAndTimeValue";
        } else if (this.isNumberValue) {
            return "isNumberValue";
        } else if (this.isDurationValue) {
            return "isDurationValue";
        } else if (this.isShapeValue) {
            return "isShapeValue";
        } else if (this.isStringValue) {
            return "isStringValue";
        } else {
            return null;
        }
    };

    this.getIconPathName = function () {
        if (this.isColorValue) {
            return "color";
        } else if (this.isDateAndTimeValue) {
            return "dateAndTime";
        } else if (this.isNumberValue) {
            return "number";
        } else if (this.isDurationValue) {
            return "duration";
        } else if (this.isShapeValue) {
            return "shape";
        } else if (this.isStringValue) {
            return "string";
        } else {
            return null;
        }
    };

    this.getDistanceTo = function (anotherValue) {

        if (this.getTypeProposition() !== anotherValue.getTypeProposition()) {
            return null;
        } else {
            if (this.isColorValue) {
                return computeColorDistance(this, anotherValue);
            } else if (this.isDateAndTimeValue) {
                return computeDateAndTimeDistance(this, anotherValue);
            } else if (this.isNumberValue) {
                return computeNumericDistance(this, anotherValue);
            } else if (this.isDurationValue) {
                return computeDurationDistance(this, anotherValue);
            } else if (this.isShapeValue) {
                return computeShapeDistance(this, anotherValue);
            } else if (this.isStringValue) {
                return computeStringDistance(this, anotherValue);
            } else {
                return null;
            }
        }
    };

    this.getDistancesTo = function (arrayOfValues) {
        var theValue = this;
        var arrayOfDistances = new Array();
        arrayOfValues.forEach(function (value) {
            var distance = theValue.getDistanceTo(value);
            arrayOfDistances.push(distance);
        });
        return arrayOfDistances;
    }
}

function subtractNumbers(value1, value2, outputPrefix) {
    var clonedValue2 = value2.clone();
    clonedValue2.number = -clonedValue2.number;
    return addTwoNumbers(value1, clonedValue2, outputPrefix);
}

function addNumericValues(numericValues, outputPrefix) {
    var result = numericValues[0];
    for (var i = 1; i < numericValues.length; i++) {
        result = addTwoNumbers(result, numericValues[i], outputPrefix);
    }
    return result;
}

function mixColors(colorValues) {

    var percent = 100 / colorValues.length;
    var percents = new Array();
    var colors = new Array();

    for (var i = 0; i < colorValues.length; i++) {
        var currentColor = colorValues[i].color;
        colors.push(new ColorMix.Color(getR(currentColor), getG(currentColor), getB(currentColor)));
        percents.push(percent);
    }

    var mixResult = ColorMix.mix(colors, percents);
    var fabricColor = new fabric.Color(rgb(mixResult.red, mixResult.green, mixResult.blue));

    return createColorValue(fabricColor);

}

function concatStrings(stringValues) {
    var concatenation = "";
    for (var i = 0; i < stringValues.length; i++) {
//        concatenation += stringValues[i].string;
        concatenation += stringValues[i].getDisplayableString();
    }
    return createStringValue(concatenation);
}

function addTwoNumbers(value1, value2, outputPrefix) {


    if (LOG)
        console.log("%c**********************************Trying to ADD: with the outputPrefix: " + outputPrefix, "background: red; color: white;");
    if (LOG)
        console.log(value1);
    if (LOG)
        console.log(value2);

    // Here, both values are numbers

    var units1 = value1.units.trim();
    var units2 = value2.units.trim();

    var number1 = value1.number;
    var number2 = value2.number;

    if (units1 === units2) {

        // The two numbers have are expressed in the same units

        var prefix1 = value1.outPrefix;
        var prefix2 = value2.outPrefix;

        if (prefix1 === prefix2) {

            // The two numbers have the same prefixes

            var unscaledValue = number1 + number2;

            return createNumericValue(unscaledValue, prefix1, prefix1, units1);

        } else {

            // We need to choose a common prefix (the first one, for instance); then, both magnitudes should be transformed to have the same scaling


//               var secondValue = null;

//               if (outputPrefix) {

            var firstValue = createNumericValue(number1, prefix1, outputPrefix, units1);
            var secondValue = createNumericValue(number2, prefix2, outputPrefix, units1);

            if (LOG)
                console.log("jhshshsh");

            return addValues(firstValue, secondValue);
//               }

//               if (units1 !== '') {
//                  secondValue = createNumericValue(number2, prefix2, prefix1, units1);
//                  return addValues(value1, secondValue);
//               } else {
//                  secondValue = createNumericValue(number1, prefix1, prefix2, units2);
//                  return addValues(value2, secondValue);
//               }





        }

    } else {

        // Units mismatching

    }


}

function subtractMoments(moment1, moment2) {
    return moment2.diff(moment1);
}

function addValues(value1, value2, outputPrefix) {

//   if (!value1 || !value2) {
//      return null;
//   }

    if (value1.isNumberValue) {

        if (value2.isNumberValue) {

            return addTwoNumbers(value1, value2, outputPrefix);

        }

    } else if (value1.isDateAndTimeValue) {

        if (value2.isDurationValue) {

            if (LOG) {
                console.log("value1:");
                console.log(value1);

                console.log("value2:");
                console.log(value2);
            }

            var theDate = value1.moment;
            var theDuration = value2.duration;

            var newDate = theDate.clone().add(theDuration);

            return createDateAndTimeValue(newDate);

        }

    }

    return null;
}



function subtractValues(value1, value2, outputPrefix) {

//   if (!value1 || !value2) {
//      return null;
//   }

    if (value1.isNumberValue) {

        if (value2.isNumberValue) {

            /////////////// Subtracting NUMBERS ///////////////
            return subtractNumbers(value1, value2, outputPrefix);

        }

    } else {

        if (value1.isDateAndTimeValue) {

            if (value2.isDateAndTimeValue) {

                /////////////// Subtracting DATES ///////////////
                var outputUnits = outputPrefix || 'milliseconds'; // when a previous value already exists, the new computed one should be expressed in the units of the existing one

                return computeDateDifference(value2.moment, value1.moment, outputUnits);

            }

        } else {

        }

    }
}

function createDefaultValueByTypeProposition(dataTypeProposition) {

    var value = null;

    if (dataTypeProposition === "isColorValue") {

        value = createColorValue(new fabric.Color(rgb(112, 112, 112)));

    } else if (dataTypeProposition === "isStringValue") {

        value = createStringValue('String');

    } else if (dataTypeProposition === "isNumberValue") {

//        value = createNumericValue(100);
        value = createNumericValue(0);

    } else if (dataTypeProposition === "isDurationValue") {

        var duration = moment.duration({
            milliseconds: 1,
            seconds: 1,
            minutes: 1,
            hours: 1,
            days: 0,
            weeks: 0,
            months: 0,
            years: 0
        });
        value = createDurationValue(duration, 'minutes');

    } else if (dataTypeProposition === "isDateAndTimeValue") {

        var theMoment = moment();
        value = createDateAndTimeValue(theMoment);

    } else if (dataTypeProposition === "isShapeValue") {

        var shape = CIRCULAR_MARK;
        value = createShapeValue(shape, null);

    }

    if (LOG)
        console.log("value:");
    if (LOG)
        console.log(value);

    return value;

}

function computeColorDistance(colorValue1, colorValue2) {
//    return computeDeltaE2000(colorValue1.color, colorValue2.color);
    return computeDeltaE2000(colorValue1.color, colorValue2.color);
}

function computeDateAndTimeDistance(dateAndTimeValue1, dateAndTimeValue2) {
    return null;
}

function computeNumericDistance(numericValue1, numericValue2) {
    return numericValue2.number - numericValue1.number;
}

function computeDurationDistance(durationValue1, durationValue2) {
    return null;
}

function computeShapeDistance(shapeValue1, shapeValue2) {
    return null;
}

function computeStringDistance(stringValue1, stringValue2) {
    return null;
}

function createValue(options) {
    if (options.type === NUMERIC) {
        return createNumericValue(options.unscaledValue, options.inPrefix, options.outPrefix, options.units);
    } else if (options.type === STRING) {
        return createStringValue(options.string);
    } else if (options.type === DURATION) {
        return createDurationValue(options.duration, options.outputUnits);
    } else if (options.type === DATEANDTIME) {
        return createDateAndTimeValue(options.moment);
    } else if (options.type === COLOR) {
        return createColorValue(options.color);
    } else if (options.type === SHAPE) {
        return createShapeValue(options.shape, options.svgPathGroupMark || options.path);
    }
}

function createValueFromXMLNode(valueXmlNode) {

    var valueType = valueXmlNode.attr('type')

    var options = {
        type: valueType
    };

    if (valueType === "array") {

        return createArrayFromXMLNode(valueXmlNode);

    } else {

        var children = valueXmlNode.children();
        children.each(function () {
            var child = $(this);
            var property = this.tagName;
            var value = child.text();
            var type = child.attr('type');

            if (type === "number") {
                value = Number(value);
            } else if (type === "boolean") {
                value = value === "true";
            }

            value = replaceAll(value, CDATA_END_REPLACE, CDATA_END);

            options[property] = value;
        });

//        console.log("%c Options to create a new VALUE from an XML Node: ", "background: rgb(143,98,153); color: white;");
//        console.log(options);


        return createValue(options);

    }


}