var ArrayElementSymbol = iVoLVER.util.createClass(fabric.Rect, {
    initialize: function (options) {
        options || (options = {});
        options.hasControls = false;
        options.originX = 'center';
        options.originY = 'center';
        options.objectCaching = true;
        options.noScaleCache = false;
        options.dirty = true;
        options.width = options.width || 20;
        options.height = options.height || 35;
        options.fill = lighten('#DFE3B3', 15);
        this.callSuper('initialize', options);
        this.array = options.array;
        this.changeView = options.changeView;
        this.column = options.column;
        this.row = options.row;
        this.indexed = false;
        this.indexedColor = null;
        this.numberOfColumns = options.numberOfColumns;
        this.timeOfChange = null;
        this.fontColor = 'rgba(65, 65, 65, 1)';
        this.initConnectable();

        this.oldRender = this.render;
        this.render = function (ctx) {
            this.oldRender(ctx);
            ctx.font = '20px Helvetica';
            ctx.fillStyle = this.fontColor;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            var center = this.getPointByOrigin('center', 'center');

            if (!this.array.isCompressed) {
                var renderableValue = this.element;
                if (!iVoLVER.util.isUndefined(this.element) && iVoLVER.util.isNumber(this.element)) {
                    if (this.dataType == "double" || this.dataType == "float")
                        renderableValue = this.element.toFixed(2);
                    else
                        renderableValue = this.element;
                }

                if (this.visible) {

                    ctx.fillText(renderableValue, center.x, center.y + 3);

                    if (this.changeView && this.numberOfColumns > 1) {
                        ctx.font = '10px Helvetica';
                        ctx.fillStyle = darken(this.fontColor);
                        if (this.row == 0) {
                            ctx.fillText(this.column, center.x, center.y - 22);
                        }

                        if (this.column == 0) {
                            var leftCenter = this.getPointByOrigin('left', 'center');
                            ctx.fillText(this.row, leftCenter.x - 20, center.y);
                        }
                    } else {
                        ctx.font = '10px Helvetica';
                        ctx.fillStyle = darken(this.fontColor);

                        if (this.array.orientation == 1) {
                            let leftCenter = this.getPointByOrigin('left', 'center');
                            ctx.fillText(this.index, center.x - 29, center.y);
                        } else {
                            ctx.fillText(this.index, center.x, center.y - 22);
                        }
                    }

                    if (this.indexed) {
                        let leftCenter = this.getPointByOrigin('left', 'top');
                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(leftCenter.x + (this.strokeWidth * 1.5), leftCenter.y + (this.strokeWidth * 1.5), this.width - (this.strokeWidth * 2), this.height - (this.strokeWidth * 2));
                        ctx.strokeStyle = this.indexedColor;
                        ctx.stroke();
                        
                        ctx.closePath();
                        ctx.restore();
                    }
                }
            }
        };

        this.setVisible = function (visibility) {
            this.visible = visibility;
        };
    },
    processConnectionRequest: function (connection) {
        var source = connection.source;
        var connectionAccepted = (source.isCircle && (source.getInConnections().length + source.getOutConnections().length) === 1) || (source.isTriangle && (source.getInConnections().length >= 2));
        var message = '';
        if (!connectionAccepted) {
            if (source.isCircle) {
                message = 'Sorry, I only accept unconnected Circles.';
            } else if (source.isTriangle) {
                message = 'Sorry, I only accept Triangles with at least two incoming connections.';
            } else {
                message = 'Sorry, I don\'t accept connections from Squares.';
            }
        }
        return {
            connectionAccepted: connectionAccepted,
            message: message
        };
    }
});
iVoLVER.util.extends(ArrayElementSymbol.prototype, iVoLVER.model.Connectable);