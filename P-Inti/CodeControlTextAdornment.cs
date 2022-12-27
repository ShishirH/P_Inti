using EnvDTE;
using Microsoft.VisualStudio.Shell;
using Microsoft.VisualStudio.Shell.Interop;
using Microsoft.VisualStudio.Text;
using Microsoft.VisualStudio.Text.Editor;
using Microsoft.VisualStudio.Text.Formatting;
using System;
using System.IO;
using System.Windows.Controls;
using System.Windows.Media;

namespace P_Inti
{
    /// <summary>
    /// CodeControlTextAdornment places red boxes behind all the "a"s in the editor window
    /// </summary>
    internal sealed class CodeControlTextAdornment
    {
        /// <summary>
        /// The layer of the adornment.
        /// </summary>
        private readonly IAdornmentLayer layer;

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
        /// Initializes a new instance of the <see cref="CodeControlTextAdornment"/> class.
        /// </summary>
        /// <param name="view">Text view to create the adornment for</param>
        public CodeControlTextAdornment(IWpfTextView view)
        {
            if (view == null)
            {
                throw new ArgumentNullException("view");
            }

            this.layer = view.GetAdornmentLayer("CodeControlTextAdornment");

            this.view = view;
            this.view.LayoutChanged += this.OnLayoutChanged;

            // Create the pen and brush to color the box behind the a's
            this.brush = new SolidColorBrush(Color.FromArgb(0x20, 0x00, 0x00, 0xff));
            this.brush.Freeze();

            var penBrush = new SolidColorBrush(Colors.Red);
            penBrush.Freeze();
            this.pen = new Pen(penBrush, 0.5);
            this.pen.Freeze();
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
        internal void OnLayoutChanged(object sender, TextViewLayoutChangedEventArgs e)
        {
            foreach (ITextViewLine line in e.NewOrReformattedLines)
            {
                if (MyWindowControl.CurrentCodeControl != null)
                    this.AddNewTextToCodeControl(line);
            }
        }

        public void AddNewTextToCodeControl(ITextViewLine line)
        {
            bool currentInsideCodeControl = false;

            string currentLineContent = line.Extent.GetText();

            int lineNumber = line.Start.GetContainingLine().LineNumber;

            EnvDTE.DTE dte = Package.GetGlobalService(typeof(SDTE)) as DTE;

            // Get current document contents
            EnvDTE.TextDocument textDocument = (EnvDTE.TextDocument)dte.ActiveDocument.Object("TextDocument");
            EnvDTE.EditPoint editPoint = textDocument.StartPoint.CreateEditPoint();
            string result = editPoint.GetText(textDocument.EndPoint);

            var activePoint = ((EnvDTE.TextSelection)dte.ActiveDocument.Selection).ActivePoint;
            
            // Iterate over the multi line string, line by line
            using (StringReader reader = new StringReader(result))
            {
                string lineOfCode = string.Empty;
                do
                {
                    lineOfCode = reader.ReadLine();
                    if (lineOfCode != null)
                    {
                        if (lineOfCode == currentLineContent)
                        {
                            break;
                        }

                        if (lineOfCode.StartsWith("// BEGIN"))
                        {
                            currentInsideCodeControl = true;
                        }
                        
                        if (lineOfCode.StartsWith("// END"))
                        {
                            currentInsideCodeControl = false;
                        }
                    }

                } while (lineOfCode != null);
            }

            // Already inside a block of // BEGIN and // END
            if (currentInsideCodeControl)
            {
                // just color the new now line
            }
            else
            {
                // Add BEGIN AND END
            }
        }
        /// <summary>
        /// Adds the scarlet box behind the 'a' characters within the given line
        /// </summary>
        /// <param name="line">Line to add the adornments</param>
        private void CreateVisuals(ITextViewLine line)
        {
            IWpfTextViewLineCollection textViewLines = this.view.TextViewLines;

            // Loop through each character, and place a box around any 'a'
            for (int charIndex = line.Start; charIndex < line.End; charIndex++)
            {
                if (this.view.TextSnapshot[charIndex] == 'a')
                {
                    SnapshotSpan span = new SnapshotSpan(this.view.TextSnapshot, Span.FromBounds(charIndex, charIndex + 1));
                    Geometry geometry = textViewLines.GetMarkerGeometry(span);
                    if (geometry != null)
                    {
                        var drawing = new GeometryDrawing(this.brush, this.pen, geometry);
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

                        this.layer.AddAdornment(AdornmentPositioningBehavior.TextRelative, span, null, image, null);
                    }
                }
            }
        }
    }
}
