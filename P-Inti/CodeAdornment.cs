using System;
using System.Collections.Generic;
using System.Windows.Controls;
using System.Windows.Forms;
using System.Windows.Media;
using System.Windows.Shapes;
using Microsoft.VisualStudio.Text;
using Microsoft.VisualStudio.Text.Editor;
using Microsoft.VisualStudio.Text.Formatting;
using GalaSoft.MvvmLight.Threading;

namespace P_Inti
{
    public class CodeAdornment
    {
        /// <summary>º
        /// The layer of the adornment.
        /// </summary>
        public readonly IAdornmentLayer layer;

        /// <summary>
        /// Text view where the adornment is created.
        /// </summary>
        private readonly IWpfTextView view;

        /// <summary>
        /// Adornment brush.
        /// </summary>
        private readonly Brush brush;

        /// <summary>
        /// Adornment pen.
        /// </summary>
        private readonly Pen pen;

        /// <summary>
        /// Initializes a new instance of the <see cref="CodeAdornment"/> class.
        /// </summary>
        /// <param name="view">Text view to create the adornment for</param>
        public CodeAdornment(IWpfTextView view)
        {
            if (view == null)
            {
                throw new ArgumentNullException("view");
            }

            IAdornmentLayer layer = null;

            DispatcherHelper.Initialize();
            DispatcherHelper.CheckBeginInvokeOnUI((Action)delegate
           {
               layer = view.GetAdornmentLayer("CodeAdornment");
           });

            this.layer = layer;
            this.view = view;
            //this.view.LayoutChanged += this.OnLayoutChanged;

            // Create the pen and brush to color the box behind the a's
            this.brush = null;
               //this.brush.Freeze();

               var penBrush = new SolidColorBrush(Colors.Transparent);
               penBrush.Freeze();
               this.pen = new Pen(penBrush, 0.5);
               this.pen.Freeze();

        }

        public CodeAdornment(IWpfTextView view, Brush brush) : this(view)
        {
            this.brush = brush;
        }

        //private void OnLayoutChanged(object sender, TextViewLayoutChangedEventArgs e) {
        //    foreach (ITextViewLine line in e.NewOrReformattedLines) {                
        //        this.CreateVisuals(line);
        //    }
        //}

        /// <summary>
        /// Handles whenever the text displayed in the view changes by adding the adornment to any reformatted lines
        /// </summary>
        /// <remarks><para>This event is raised whenever the rendered text displayed in the <see cref="ITextView"/> changes.</para>
        /// <para>It is raised whenever the view does a layout (which happens when DisplayTextLineContainingBufferPosition is called or in response to text or classification changes).</para>
        /// <para>It is also raised whenever the view scrolls horizontally or when its size changes.</para>
        /// </remarks>
        /// <param name="sender">The event sender.</param>
        /// <param name="e">The event arguments.</param>


        /// <summary>
        /// Adds the scarlet box behind the 'a' characters within the given line
        /// </summary>
        /// <param name="line">Line to add the adornments</param>
        /*public void CreateVisuals(ITextViewLine line, IItem item, Brush brush) {

            LineText lineText = item.LineText;
            if (line == null)
                return;

            IWpfTextViewLineCollection textViewLines = this.view.TextViewLines;

            // Loop through each character, and place a box around any 'a'
            for (int charIndex = line.Start; charIndex < line.End; charIndex++) {

                SnapshotSpan span = new SnapshotSpan(this.view.TextSnapshot, Span.FromBounds(charIndex, charIndex + 1));
                Geometry geometry = textViewLines.GetMarkerGeometry(span);
                if (geometry != null) {
                    var drawing = new GeometryDrawing(brush, this.pen, geometry);
                    drawing.Freeze();

                    var drawingImage = new DrawingImage(drawing);
                    drawingImage.Freeze();

                    var image = new Image {
                        Source = drawingImage,
                    };

                    // Align the image with the top of the bounds of the text geometry
                    Canvas.SetLeft(image, geometry.Bounds.Left);
                    Canvas.SetTop(image, geometry.Bounds.Top);

                    this.layer.AddAdornment(AdornmentPositioningBehavior.TextRelative, span, null, image, null);
                }

            }
        }*/



        public void CreateVisuals(ITextViewLine line)
        {

            if (line == null || brush == null)
                return;

            //IWpfTextViewLineCollection textViewLines = this.view.TextViewLines;
            /*int startPosition = line.Start.Position;
            int endPosition = line.End.Position;
            int lineNumber = view.TextSnapshot.GetLineNumberFromPosition(line.Extent.Start);*/

            var rect = new Rectangle()
            {
                Height = line.Height,
                Width = view.ViewportWidth,
                Fill = brush
            };
            Canvas.SetLeft(rect, view.ViewportLeft);
            Canvas.SetTop(rect, line.Top);
            this.layer.AddAdornment(line.Extent, null, rect);

        }



        /// <summary>
        /// Adds the scarlet box behind the 'a' characters within the given line
        /// </summary>
        /// <param name="line">Line to add the adornments</param>
        //public void CreateVisuals(ITextViewLine line, Brush brush) {

        //    if (line == null)
        //        return;

        //    IWpfTextViewLineCollection textViewLines = this.view.TextViewLines;

        //    // Loop through each character, and place a box around any 'a'
        //    for (int charIndex = line.Start; charIndex < line.End; charIndex++) {

        //        SnapshotSpan span = new SnapshotSpan(this.view.TextSnapshot, Span.FromBounds(charIndex, charIndex + 1));
        //        Geometry geometry = textViewLines.GetMarkerGeometry(span);
        //        if (geometry != null) {
        //            var drawing = new GeometryDrawing(brush, this.pen, geometry);
        //            drawing.Freeze();

        //            var drawingImage = new DrawingImage(drawing);
        //            drawingImage.Freeze();

        //            var image = new Image {
        //                Source = drawingImage,
        //            };

        //            // Align the image with the top of the bounds of the text geometry
        //            Canvas.SetLeft(image, geometry.Bounds.Left);
        //            Canvas.SetTop(image, geometry.Bounds.Top);

        //            this.layer.AddAdornment(AdornmentPositioningBehavior.TextRelative, span, null, image, null);
        //        }

        //    }
        //}





        public void CreateVisuals(List<IWpfTextViewLine> lines)
        {
            foreach (var line in lines)
            {
                CreateVisuals(line);
            }
        }



        public void RemoveVisuals()
        {
            this.layer.RemoveAllAdornments();
        }

        /*public static Color LighterColor(Color color, float correctionfactory = 75f) {
            correctionfactory = correctionfactory / 100f;
            const float rgb255 = 255f;
            return Color.FromRgb((byte)((float)color.R + ((rgb255 - (float)color.R) * correctionfactory)), (byte)((float)color.G + ((rgb255 - (float)color.G) * correctionfactory)), (byte)((float)color.B + ((rgb255 - (float)color.B) * correctionfactory)));
        }*/
    }
}
