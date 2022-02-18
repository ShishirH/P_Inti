class CreationEvent {
    constructor(targetObject) {
        console.log("Creation event created");
        this.targetObject = targetObject;

        UNDO_CANVAS_ENTRIES.push(this);
        // Clear all redo events history as a new event was created.
        REDO_CANVAS_ENTRIES = [];
    };

    undoEvent() {
        // Undo creation - delete object and all its children from the canvas.
        let targetObject = this.targetObject;

        targetObject.children && targetObject.children.forEach(function (child) {
            canvas.remove(child);
        });

        targetObject.childrenOnTop && targetObject.childrenOnTop.forEach(function (child) {
            canvas.remove(child);
        });

        canvas.remove(targetObject);
    }

    redoEvent() {
        // Redo creation - add object and all its children to the canvas.
        let targetObject = this.targetObject;

        targetObject.children && targetObject.children.forEach(function (child) {
            canvas.add(child);
        });

        targetObject.childrenOnTop && targetObject.childrenOnTop.forEach(function (child) {
            canvas.add(child);
        });

        canvas.add(targetObject);
        targetObject.positionObjects();
    }
}