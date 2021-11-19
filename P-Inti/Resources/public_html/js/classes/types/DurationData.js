var DurationData = fabric.util.createClass(fabric.Path, {
    serializableProperties: ['left', 'top', 'theType', 'value'],
    deserializer: addVisualValueToCanvas,
    initialize: function (options) {
        options || (options = {});
        var path = paths["duration"].rw;
        this.callSuper('initialize', path, options);

        this.set('dataTypeProposition', 'isDurationValue');
        this.set(this.dataTypeProposition, true);

        var duration = options.duration || moment.duration({
            milliseconds: 1,
            seconds: 1,
            minutes: 1,
            hours: 1,
            days: 0,
            weeks: 0,
            months: 0,
            years: 0
        });

        var value = createDurationValue(duration, options.outputUnits || 'minutes');
        this.set('value', value);

        this.set('strokeWidth', options.strokeWidth || 2);
        this.set('originalStrokeWidth', this.strokeWidth);

        this.set('fill', options.fill || rgb(66, 183, 91));
        this.set('stroke', options.stroke || darkenrgb(66, 183, 91));
        this.set('colorForStroke', options.stroke || darkenrgb(66, 183, 91));

//        this.set('fill', options.fill || rgb(66, 183, 91));
//        this.set('stroke', options.stroke || darkenrgb(66, 183, 91));
//        this.set('colorForStroke', options.stroke || darkenrgb(66, 183, 91));


        this.set('inConnections', new Array());
        this.set('outConnections', new Array());
        this.set('readable', true);
        this.set('writable', true);
        this.associateEvents();

        this.set('originX', 'center');
        this.set('originY', 'center');

        this.set({left: options.left, top: options.top});
        this.setCoords();

    },
    setValue: function (durationValue, refreshCanvas) {


        if (durationValue.isDurationValue) {

            var theVisualValue = this;

            var previousOutputUnits = null;
            if (theVisualValue.value) {
                previousOutputUnits = theVisualValue.value.outputUnits;
            }

            if (LOG)
                console.log("**************************************************************");
            if (LOG)
                console.log("Trying to set the following value to a DurationData object");
            if (LOG)
                console.log(durationValue);

            theVisualValue.value = durationValue.clone();

            if (previousOutputUnits) {
                theVisualValue.value.outputUnits = previousOutputUnits;
            }

            if (LOG)
                console.log("The value after the setting process is to this duration data:");
            if (LOG)
                console.log(theVisualValue.value);

            /*// Every time a value is set here, we also have to update the values of the outgoing connections
             theVisualValue.outConnections.forEach(function (outConnector) {
             
             if (LOG) console.log("The value that will be communicated to the connectors' destinations:");
             if (LOG) console.log(theVisualValue.value);
             
             outConnector.setValue(theVisualValue.value, false, true);
             });
             
             if (LOG) console.log("-----------------------------------------------------------------------");
             
             if (theVisualValue.collection) {
             var options = {
             visualValue: theVisualValue
             };
             theVisualValue.collection.trigger('valueChanged', options);
             }
             
             */

            if (refreshCanvas) {
                ////canvas.renderAll();
            }


            return true;
        } else {
            return false;
        }
    },
    expand: function () {

        var theVisualValue = this;

        showDurationValue(theVisualValue, true);

    }


});
VisualValue.call(DurationData.prototype);



function updateDurationOutputText(valueHolder) {
    var currentOutput = generateDurationDataOutput(valueHolder);
    var durationOutput = $('#durationOutput');
    durationOutput.text(currentOutput);
}

function generateDurationDataOutput(valueHolder) {
    var selectedOutputUnits = $("#outputTypeSelector option:selected").text();
    return '( ' + valueHolder.workingDuration.as(selectedOutputUnits).toFixed(4) + " " + selectedOutputUnits + ' )';
}


function showDurationValue(valueHolder, editable) {

    valueHolder.workingDuration = valueHolder.value.duration;

    var mainDiv = $('<div/>', {class: 'icon-large'});

    if (LOG) {
        console.log("%cconfigurator:", "background:red; color:white;");
        console.log(mainDiv);
    }
    
    var padding = (valueHolder.width / 4) * canvas.getZoom();

    mainDiv.css('padding-right', padding + 'px');
    mainDiv.css('padding-left', padding + 'px');
    document.body.appendChild(mainDiv[0]);

//    var labelsDiv = getLabelsDiv(["Years", "Months", "Days", "Hours", "Minutes", "Seconds", "Milliseconds"]);
//    var inputFields = getInputFieldsDiv(["years", "months", "days", "hours", "minutes", "seconds", "milliseconds"], valueHolder, editable);

    var labelsDiv = getLabelsDiv(["Hours", "Minutes", "Seconds", "Milliseconds"]);
    var inputFields = getInputFieldsDiv(["hours", "minutes", "seconds", "milliseconds"], valueHolder, editable);

    var outputTypeSelector = buildDurationUnitsSelector(valueHolder);

    var okButton = $('<button/>', {text: "OK", id: 'theOkButton', class: "square", style: "width: 20%; margin-left: 28%; float: left; border-color: #000; border-style: solid; border-width: 2px; color: black; "});

    var cancelButton = $('<button/>', {text: "Cancel", class: "square", style: "width: 20%; float: right; margin-right: 28%; border-color: #000; border-style: solid; border-width: 2px; color: black; "});

    okButton.click(function () {

        // if the duration was actually changed
        var durationChanged = valueHolder.value.duration.asDays() !== valueHolder.workingDuration.asDays();

        if (LOG)
            console.log("valueHolder.value.duration.asDays():");
        if (LOG)
            console.log(valueHolder.value.duration.asDays());

        if (LOG)
            console.log("valueHolder.workingDuration.asDays():");
        if (LOG)
            console.log(valueHolder.workingDuration.asDays());

        var selectedOutputUnits = $("#outputTypeSelector option:selected").text();
        var unitsChanged = valueHolder.value.outputUnits !== selectedOutputUnits;

        if (LOG)
            console.log("valueHolder.value:");
        if (LOG)
            console.log(valueHolder.value);

        if (LOG)
            console.log("valueHolder.value.outputUnits:");
        if (LOG)
            console.log(valueHolder.value.outputUnits);

        if (LOG)
            console.log("selectedOutputUnits:");
        if (LOG)
            console.log(selectedOutputUnits);

        var durationValue = createDurationValue(valueHolder.workingDuration, selectedOutputUnits);

        if (LOG)
            console.log("durationChanged:");
        if (LOG)
            console.log(durationChanged);

        if (LOG)
            console.log("unitsChanged:");
        if (LOG)
            console.log(unitsChanged);

        if (durationChanged) {
            valueHolder.inConnections.forEach(function (inConnector) {
                inConnector.contract();
            });
        }

        // as the previous line will preserve the curren output units of the duration data, we have to change them manually in case other units were selected by the user
        if (unitsChanged) {

            valueHolder.value = durationValue;
            valueHolder.value.outputUnits = selectedOutputUnits; // Changing the units to the new one
            valueHolder.outConnections.forEach(function (outConnector) {
                outConnector.setValue(valueHolder.value, false, true);
            });

        } else {
            valueHolder.setValue(durationValue, false);
        }

        setTimeout(function () {
            ////canvas.renderAll();
        }, 10);

        mainDiv.tooltipster('hide');
    });

    cancelButton.click(function () {
        mainDiv.tooltipster('hide');
    });

    var configurationPanel = $('<div/>', {id: 'theConfigurationPanel'});

    configurationPanel.append(labelsDiv);

    configurationPanel.append($('<br />'));

    configurationPanel.append(inputFields);

    configurationPanel.append($('<label/>', {text: 'Output as:', style: "margin-right: 5px; font-size: 18px; margin-top: 15px;"}));
    configurationPanel.append(outputTypeSelector);

    configurationPanel.append($('<label/>', {id: 'durationOutput', style: "margin-right: 5px; font-size: 18px; margin-top: 10px;"}));

    configurationPanel.append($('<hr />', {style: "margin-top: 10px;"}));

    configurationPanel.append($('<br />'));

    configurationPanel.append(okButton);

    configurationPanel.append(cancelButton);

    mainDiv.tooltipster({
        content: configurationPanel,
        animation: 'grow',
        trigger: 'click',
        interactive: true,
        position: 'right',
        multiple: true
    });

    valueHolder.configurator = mainDiv;

    // positioning and showing the configurator        
    var centerPoint = valueHolder.getPointByOrigin('center', 'center');
    var screenCoords = getScreenCoordinates(centerPoint);
    mainDiv.css('position', 'absolute');
    mainDiv.css('top', screenCoords.y + 'px');
    mainDiv.css('left', screenCoords.x + 'px');
    mainDiv.tooltipster('reposition');
    mainDiv.tooltipster('show');

    updateDurationOutputText(valueHolder);

}





function createDurationValue(duration, outputUnits) {

    // checking if the provided duration is already a moment.js object. If not, we have to create it
    var theDuration = duration;
    var type = typeof duration;
    if (type === "string" || type === "number") {
        theDuration = moment.duration(duration);
    }

    return new Value({isDurationValue: true, duration: theDuration, outputUnits: outputUnits});
}