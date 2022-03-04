class ArrayRotateEvent {
    constructor(targetObject) {
        console.log("ArrayRotate event created");
        this.targetObject = targetObject;

        UNDO_CANVAS_ENTRIES.push(this);
        // Clear all redo events history as a new event was created.
        REDO_CANVAS_ENTRIES = [];
    };

    undoEvent() {
        // Undo creation - delete object and all its children from the canvas.
        let targetObject = this.targetObject;

        targetObject.rotate && targetObject.rotate();
        targetObject.positionObjects();
    }

    redoEvent() {
        // Redo creation - add object and all its children to the canvas.
        let targetObject = this.targetObject;

        targetObject.rotate && targetObject.rotate();
        targetObject.positionObjects();
    }
}