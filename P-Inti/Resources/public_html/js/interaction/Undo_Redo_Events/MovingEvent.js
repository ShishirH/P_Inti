class MovingEvent {
    constructor(targetObject, oldPositionX, oldPositionY, newPositionX, newPositionY) {
        console.log("Moving event created");
        this.targetObject = targetObject;
        this.oldPositionX = oldPositionX;
        this.oldPositionY = oldPositionY;
        this.newPositionX = newPositionX;
        this.newPositionY = newPositionY;

        UNDO_CANVAS_ENTRIES.push(this);

        // Clear all redo events history as a new event was created.
        REDO_CANVAS_ENTRIES = [];
    };

    undoEvent() {
        let targetObject = this.targetObject;

        targetObject.x = this.oldPositionX;
        targetObject.y = this.oldPositionY;

        targetObject.left = this.oldPositionX;
        targetObject.top = this.oldPositionY;

        if (targetObject.parent) {
            if (!targetObject.isArray) {
                targetObject.parent.expandedOptions[targetObject.id].x = this.oldPositionX;
                targetObject.parent.expandedOptions[targetObject.id].y = this.oldPositionY;

                targetObject.parent.compressedOptions[targetObject.id].x = this.oldPositionX;
                targetObject.parent.compressedOptions[targetObject.id].y = this.oldPositionY;
                targetObject.parent.positionObjects();
            } else {
                adjustReferenceObjectPosition(targetObject.parent);
            }
        }

        targetObject.positionObjects();
    }

    redoEvent() {
        let targetObject = this.targetObject;

        targetObject.x = this.newPositionX;
        targetObject.y = this.newPositionY;

        targetObject.left = this.newPositionX;
        targetObject.top = this.newPositionY;

        if (targetObject.parent) {
            if (!targetObject.isArray) {
                targetObject.parent.expandedOptions[targetObject.id].x = this.newPositionX;
                targetObject.parent.expandedOptions[targetObject.id].y = this.newPositionY;

                targetObject.parent.compressedOptions[targetObject.id].x = this.newPositionX;
                targetObject.parent.compressedOptions[targetObject.id].y = this.newPositionY;
                targetObject.parent.positionObjects();
            } else {
                adjustReferenceObjectPosition(targetObject.parent);
            }
        }

        targetObject.positionObjects();
    }
}