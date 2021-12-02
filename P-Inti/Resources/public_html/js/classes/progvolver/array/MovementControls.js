function moveScrollX(background) {
    // Divide the X axis into ticks for the array. -20 is for the left and the right arrows.
    if (!background.isCompressed) {
        let ticks;

        const scrollX = background.scrollX;
        const arrayElementsArray = background.arrayElementsArray;

        if (background.columns > 1) {
            ticks = (background.width - scrollX.width) / background.columns;
        } else {
            ticks = arrayElementsArray.length;
        }

        var updatedFirstVisible = false;
        LOG && console.log("Number of ticks are: " + ticks);

        let currentX = background.expandedOptions[scrollX.id].x;
        LOG && console.log("CurrentX is: " + currentX);
        background.compressedOptions[scrollX.id].x = currentX;

        let hiddenNumber = (currentX / ticks);
        hiddenNumber = Math.floor(hiddenNumber);

        if (hiddenNumber === background.hiddenX)
            return;
        else
            background.hiddenX = hiddenNumber;

        LOG && console.log("Hidden number is: " + hiddenNumber);

        let indentation;
        for (let i = 1; i <= background.rows; i++) {
            for (let j = 0; j < background.columns; j++) {
                var leftHidden = false;
                var rightHidden = false;

                LOG && console.log("First visible is now: " + background.firstVisibleRow);
                if (background.columns === 1)
                    indentation = (i - hiddenNumber - 1);
                else
                    indentation = (j - hiddenNumber);

                let newXPosition = parseFloat(45 + (indentation * arrayElementsArray[i - 1][j].width));
                let elementWidth = arrayElementsArray[i - 1][j].width;
                LOG && console.log("XPosition: " + newXPosition + " and index: " + (i - 1) + ", " + (j));

                if (background.columns === 1) {
                    if (hiddenNumber >= i || newXPosition < 45) {
                        newXPosition = 45;
                        leftHidden = true;
                        background.areElementsOnLeft = true;
                    }
                } else {
                    if (hiddenNumber > j || newXPosition < 45) {
                        newXPosition = 45;
                        leftHidden = true;
                        background.areElementsOnLeft = true;
                    }
                }

                if (newXPosition + elementWidth > (background.width - 45)) {
                    newXPosition = background.width - 45;
                    rightHidden = true;
                    background.areElementsOnRight = true;
                }
                background.expandedOptions[arrayElementsArray[i - 1][j].id].x = newXPosition;
                background.compressedOptions[arrayElementsArray[i - 1][j].id].x = newXPosition;
                if (leftHidden) {
                    background.expandedOptions[arrayElementsArray[i - 1][j].id].opacity = 0;
                    background.compressedOptions[arrayElementsArray[i - 1][j].id].opacity = 0;
                    background.topHidden = hiddenNumber;
                    LOG && console.log("Hidden left is now: " + background.topHidden);
                    // Move it to the left
                    LOG && console.log("Array index: " + (i - 1) + ", " + (j) + " going to hide left");
                    arrayElementsArray[i - 1][j].setVisible(false);
                } else if (rightHidden) {
                    LOG && console.log("Hiding to the right");
                    background.expandedOptions[arrayElementsArray[i - 1][j].id].opacity = 0;
                    background.compressedOptions[arrayElementsArray[i - 1][j].id].opacity = 0;
                    arrayElementsArray[i - 1][j].setVisible(false);

                    LOG && console.log("Array index: " + (i - 1) + ", " + (j) + " going to hide right");
                } else { // Visible
                    if (!updatedFirstVisible) {
                        updatedFirstVisible = true;
                        if (background.columns === 1)
                            background.firstVisibleRow = i;
                        else
                            background.firstVisibleRow = j;
                    }

                    let maxHeight = 130;
                    if (background.expandedOptions[arrayElementsArray[i - 1][j].id].y > maxHeight)
                        continue;
                    arrayElementsArray[i - 1][j].setVisible(true);

                    arrayElementsArray[i - 1][j].opacity = 1;
                    background.expandedOptions[arrayElementsArray[i - 1][j].id].opacity = 1;
                    background.compressedOptions[arrayElementsArray[i - 1][j].id].opacity = 1;
                    if (background.columns === 1)
                        background.lastVisible = i;
                    else
                        background.lastVisible = j;
                }
            }
        }

        // 1D array
        if (background.columns === 1) {
            if (background.lastVisible === (background.rows)) {
                background.areElementsOnRight = false;
            }

            if (background.firstVisibleRow === 1) {
                background.areElementsOnLeft = false;
            }
        } else {
            if (background.lastVisible === (background.columns - 1)) {
                background.areElementsOnRight = false;
            }

            if (background.firstVisibleRow === 1) {
                background.areElementsOnLeft = false;
            }
        }

        background.positionObjects();
//                if (background.areElementsOnLeft) {
//                    background.expandedOptions[background.leftBuffer.id].opacity = 1;
//                    background.compressedOptions[background.leftBuffer.id].opacity = 1;
//                } else {
//                    background.expandedOptions[background.leftBuffer.id].opacity = 0;
//                    background.compressedOptions[background.leftBuffer.id].opacity = 0;
//
//                }

//                if (background.areElementsOnRight) {
//                    background.expandedOptions[background.rightBuffer.id].opacity = 1;
//                    background.compressedOptions[background.rightBuffer.id].opacity = 1;
//                } else {
//                    background.expandedOptions[background.rightBuffer.id].opacity = 0;
//                    background.compressedOptions[background.rightBuffer.id].opacity = 0;
//                }
    }
}

function leftArrowScroll(background) {
    if (background.hiddenX <= 0)
        return;

    var hiddenNumber = background.hiddenX - 1;
    background.hiddenX = hiddenNumber;
    var arrayElementsArray = background.arrayElementsArray;

    var updatedFirstVisible = false;
    var updatedLastVisible = false;

    let indentation;
    for (let i = 1; i <= background.rows; i++) {
        for (let j = 0; j < background.columns; j++) {
            var leftHidden = false;
            var rightHidden = false;

            console.log("First visible is now: " + background.firstVisibleRow);
            if (background.columns === 1)
                indentation = (i - hiddenNumber - 1);
            else
                indentation = (j - hiddenNumber);

            let newXPosition = parseFloat(45 + (indentation * arrayElementsArray[i - 1][j].width));
            let elementWidth = arrayElementsArray[i - 1][j].width;
            console.log("XPosition: " + newXPosition + " and index: " + (i - 1) + ", " + (j));

            if (background.columns === 1) {
                if (hiddenNumber >= i || newXPosition < 45) {
                    newXPosition = 45;
                    leftHidden = true;
                    background.areElementsOnLeft = true;
                }
            } else {
                if (hiddenNumber > j || newXPosition < 45) {
                    newXPosition = 45;
                    leftHidden = true;
                    background.areElementsOnLeft = true;
                }
            }

            if (newXPosition + elementWidth > (background.width - 45)) {
                newXPosition = background.width - 45;
                rightHidden = true;
                background.areElementsOnRight = true;
            }
            background.expandedOptions[arrayElementsArray[i - 1][j].id].x = newXPosition;
            background.compressedOptions[arrayElementsArray[i - 1][j].id].x = newXPosition;
            if (leftHidden) {
                //arrayElementsArray[i - 1].opacity = 0;
                background.expandedOptions[arrayElementsArray[i - 1][j].id].opacity = 0;
                background.compressedOptions[arrayElementsArray[i - 1][j].id].opacity = 0;
                background.topHidden = hiddenNumber;
                console.log("Hidden left is now: " + background.topHidden);
                // Move it to the left
                console.log("Array index: " + (i - 1) + ", " + (j) + " going to hide left");
                arrayElementsArray[i - 1][j].setVisible(false);
            } else if (rightHidden) {
                console.log("Hiding to the right");
                background.expandedOptions[arrayElementsArray[i - 1][j].id].opacity = 0;
                background.compressedOptions[arrayElementsArray[i - 1][j].id].opacity = 0;
                arrayElementsArray[i - 1][j].setVisible(false);

                console.log("Array index: " + (i - 1) + ", " + (j) + " going to hide right");
            } else { // Visible
                if (!updatedFirstVisible) {
                    updatedFirstVisible = true;
                    if (background.columns == 1)
                        background.firstVisibleRow = i;
                    else
                        background.firstVisibleRow = j;
                }

                let maxHeight = 130;
                if (background.expandedOptions[arrayElementsArray[i - 1][j].id].y > maxHeight)
                    continue;
                arrayElementsArray[i - 1][j].setVisible(true);

                arrayElementsArray[i - 1][j].opacity = 1;
                console.log("Array index: " + (i - 1) + ", " + (j) + " is visible");
                background.expandedOptions[arrayElementsArray[i - 1][j].id].opacity = 1;
                background.compressedOptions[arrayElementsArray[i - 1][j].id].opacity = 1;
                if (background.columns == 1)
                    background.lastVisible = i;
                else
                    background.lastVisible = j;
            }
        }
    }
    background.positionObjects();
//                if (background.areElementsOnLeft) {
//                    background.expandedOptions[background.leftBuffer.id].opacity = 1;
//                    background.compressedOptions[background.leftBuffer.id].opacity = 1;
//                } else {
//                    background.expandedOptions[background.leftBuffer.id].opacity = 0;
//                    background.compressedOptions[background.leftBuffer.id].opacity = 0;
//
//                }

//                if (background.areElementsOnRight) {
//                    background.expandedOptions[background.rightBuffer.id].opacity = 1;
//                    background.compressedOptions[background.rightBuffer.id].opacity = 1;
//                } else {
//                    background.expandedOptions[background.rightBuffer.id].opacity = 0;
//                    background.compressedOptions[background.rightBuffer.id].opacity = 0;
//                }
    //console.log("X is now: " + background.expandedOptions[scrollX.id].x);
}

function rightArrowScroll(background) {
    if (background.columns === 1) {
        if (background.hiddenX >= background.rows)
            return;
    } else {
        if (background.hiddenX >= background.columns)
            return;
    }

    var hiddenNumber = background.hiddenX + 1;
    background.hiddenX = hiddenNumber;
    var arrayElementsArray = background.arrayElementsArray;

    var updatedFirstVisible = false;
    var updatedLastVisible = false;

    let indentation;
    for (let i = 1; i <= background.rows; i++) {
        for (let j = 0; j < background.columns; j++) {
            var leftHidden = false;
            var rightHidden = false;

            console.log("First visible is now: " + background.firstVisibleRow);
            if (background.columns === 1)
                indentation = (i - hiddenNumber - 1);
            else
                indentation = (j - hiddenNumber);

            let newXPosition = parseFloat(45 + (indentation * arrayElementsArray[i - 1][j].width));
            let elementWidth = arrayElementsArray[i - 1][j].width;
            console.log("XPosition: " + newXPosition + " and index: " + (i - 1) + ", " + (j));

            if (background.columns === 1) {
                if (hiddenNumber >= i || newXPosition < 45) {
                    newXPosition = 45;
                    leftHidden = true;
                    background.areElementsOnLeft = true;
                }
            } else {
                if (hiddenNumber > j || newXPosition < 45) {
                    newXPosition = 45;
                    leftHidden = true;
                    background.areElementsOnLeft = true;
                }
            }

            if (newXPosition + elementWidth > (background.width - 45)) {
                newXPosition = background.width - 45;
                rightHidden = true;
                background.areElementsOnRight = true;
            }
            background.expandedOptions[arrayElementsArray[i - 1][j].id].x = newXPosition;
            background.compressedOptions[arrayElementsArray[i - 1][j].id].x = newXPosition;
            if (leftHidden) {
                //arrayElementsArray[i - 1].opacity = 0;
                background.expandedOptions[arrayElementsArray[i - 1][j].id].opacity = 0;
                background.compressedOptions[arrayElementsArray[i - 1][j].id].opacity = 0;
                background.topHidden = hiddenNumber;
                console.log("Hidden left is now: " + background.topHidden);
                // Move it to the left
                console.log("Array index: " + (i - 1) + ", " + (j) + " going to hide left");
                arrayElementsArray[i - 1][j].setVisible(false);
            } else if (rightHidden) {
                console.log("Hiding to the right");
                background.expandedOptions[arrayElementsArray[i - 1][j].id].opacity = 0;
                background.compressedOptions[arrayElementsArray[i - 1][j].id].opacity = 0;
                arrayElementsArray[i - 1][j].setVisible(false);

                console.log("Array index: " + (i - 1) + ", " + (j) + " going to hide right");
            } else { // Visible
                if (!updatedFirstVisible) {
                    updatedFirstVisible = true;
                    if (background.columns === 1)
                        background.firstVisibleRow = i;
                    else
                        background.firstVisibleRow = j;
                }

                let maxHeight = 130;
                if (background.expandedOptions[arrayElementsArray[i - 1][j].id].y > maxHeight)
                    continue;
                arrayElementsArray[i - 1][j].setVisible(true);

                arrayElementsArray[i - 1][j].opacity = 1;
                console.log("Array index: " + (i - 1) + ", " + (j) + " is visible");
                background.expandedOptions[arrayElementsArray[i - 1][j].id].opacity = 1;
                background.compressedOptions[arrayElementsArray[i - 1][j].id].opacity = 1;
                if (background.columns === 1)
                    background.lastVisible = i;
                else
                    background.lastVisible = j;
            }
        }
    }
    background.positionObjects();
//                if (background.areElementsOnLeft) {
//                    background.expandedOptions[background.leftBuffer.id].opacity = 1;
//                    background.compressedOptions[background.leftBuffer.id].opacity = 1;
//                } else {
//                    background.expandedOptions[background.leftBuffer.id].opacity = 0;
//                    background.compressedOptions[background.leftBuffer.id].opacity = 0;
//
//                }

//                if (background.areElementsOnRight) {
//                    background.expandedOptions[background.rightBuffer.id].opacity = 1;
//                    background.compressedOptions[background.rightBuffer.id].opacity = 1;
//                } else {
//                    background.expandedOptions[background.rightBuffer.id].opacity = 0;
//                    background.compressedOptions[background.rightBuffer.id].opacity = 0;
//                }

//
//                                // Update bar position
//                                console.log("Updating bar position");
//                                let leftArrowX = parseFloat(background.expandedOptions[leftArrow.id].x)
//                                        + parseFloat(leftArrow.width);
//
//                                console.log("LeftArrowX: " + leftArrowX);
//                                let rightArrowX = parseFloat(background.expandedOptions[rightArrow.id].x);
//                                console.log("RightArrowX: " + rightArrowX);
//
//                                let distance = rightArrowX - leftArrowX;
//                                let tickDistance;
//
//                                if (background.columns == 1)
//                                    tickDistance = distance / background.rows;
//                                else
//                                    tickDistance = distance / background.columns;
//
//                                console.log("Distance: " + distance + " and tick distance: " + tickDistance);
//
//                                let moveBarDistance;
//
//                                if (background.columns == 1)
//                                    moveBarDistance = tickDistance * (i - 1) - (scrollX.width) / 2;
//                                else
//                                    moveBarDistance = tickDistance * (j - 1) - (scrollX.width) / 2;
//
//                                background.expandedOptions[scrollX.id].x = moveBarDistance;
//                                background.compressedOptions[scrollX.id].x = moveBarDistance;
//                            }
//                        }
//                    }
//
}
