using EnvDTE;
using Microsoft.VisualStudio.Shell;
using Microsoft.VisualStudio.Shell.Interop;
using Microsoft.VisualStudio.Text;
using Microsoft.VisualStudio.Text.Editor;
using Microsoft.VisualStudio.Text.Formatting;
using System;
using System.Collections.Generic;
using System.Windows.Controls;
using System.Windows.Media;

namespace P_Inti
{
    /// <summary>
    /// CodeControlEditorAdornment places red boxes behind all the "a"s in the editor window
    /// </summary>
    public class CodeControlEditorAdornment
    {
        /// <summary>
        /// The layer of the adornment.
        /// </summary>
        private static IAdornmentLayer layer;

        /// <summary>
        /// Text view where the adornment is created.
        /// </summary>
        private static IWpfTextView view;

        /// <summary>
        /// Initializes a new instance of the <see cref="CodeControlEditorAdornment"/> class.
        /// </summary>
        /// <param name="view">Text view to create the adornment for</param>
        public CodeControlEditorAdornment(IWpfTextView view)
        {
            if (view == null)
            {
                throw new ArgumentNullException("view");
            }

            CodeControlEditorAdornment.layer = view.GetAdornmentLayer("CodeControlEditorAdornment");

            CodeControlEditorAdornment.view = view;
            CodeControlEditorAdornment.view.LayoutChanged += this.OnLayoutChanged;
        }

        /// <summary>
        /// Handles whenever the text displayed in the view changes by adding the adornment to any reformatted lines
        /// </summary>
        /// <remarks><para>This event is raised whenever the rendered text displayed in the <see cref="ITextView"/> changes.</para>
        /// <para>It is raised whenever the view does a layout (which happens when DisplayTextLineContainingBufferPosition is called or in response to text or classification changes).</para>
        /// <para>It is also raised whenever the view scrolls horizontally or when its size changes.</para>
        /// </remarks>
        /// <param name="sender">The event sender.</param>
        /// <param name="e">The event arguments.</param>
        public void OnLayoutChanged(object sender, TextViewLayoutChangedEventArgs e)
        {
            foreach (ITextViewLine line in e.NewOrReformattedLines)
            {
                CodeControlEditorAdornment.CreateVisuals(line);
            }
        }

        /// <summary>
        /// Adds the scarlet box behind the 'a' characters within the given line
        /// </summary>
        /// <param name="line">Line to add the adornments</param>
        public static void CreateVisuals(ITextViewLine line)
        {
            IWpfTextViewLineCollection textViewLines = CodeControlEditorAdornment.view.TextViewLines;

            foreach (KeyValuePair<string, CodeControlInfo> codeControlInfoPair in MyWindowControl.codeControlInfos)
            {
                string id = codeControlInfoPair.Key;
                CodeControlInfo codeControlInfo = codeControlInfoPair.Value;

                SolidColorBrush brush = new SolidColorBrush(codeControlInfo.SaturatedColor);
                brush.Freeze();

                SolidColorBrush penBrush = new SolidColorBrush(codeControlInfo.SaturatedColor);
                penBrush.Freeze();
                Pen pen = new Pen(penBrush, 0.5);
                pen.Freeze();

                for (int charIndex = textViewLines.FirstVisibleLine.Start; charIndex < textViewLines.LastVisibleLine.End; charIndex++)
                {
                    int currentLine = textViewLines.FormattedSpan.Snapshot.GetLineNumberFromPosition(charIndex);

                    if (currentLine < codeControlInfo.StartLine || currentLine > codeControlInfo.EndLine)
                    {
                        continue;
                    }

                    SnapshotSpan span = new SnapshotSpan(CodeControlEditorAdornment.view.TextSnapshot, Span.FromBounds(charIndex, charIndex + 1));
                    Geometry geometry = textViewLines.GetMarkerGeometry(span);
                    if (geometry != null)
                    {
                        var drawing = new GeometryDrawing(brush, pen, geometry);
                        drawing.Freeze();

                        var drawingImage = new DrawingImage(drawing);
                        drawingImage.Freeze();

                        var image = new Image
                        {
                            Source = drawingImage,
                        };

                        // Align the image with the top of the bounds of the text geometry
                        Canvas.SetLeft(image, geometry.Bounds.Left);
                        Canvas.SetTop(image, geometry.Bounds.Top);

                        CodeControlEditorAdornment.layer.AddAdornment(AdornmentPositioningBehavior.TextRelative, span, null, image, null);
                    }

                }
            }
        }
    }
}
