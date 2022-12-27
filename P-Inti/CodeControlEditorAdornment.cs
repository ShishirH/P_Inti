using EnvDTE;
using Microsoft.VisualStudio.Shell;
using Microsoft.VisualStudio.Shell.Interop;
using Microsoft.VisualStudio.Text;
using Microsoft.VisualStudio.Text.Editor;
using Microsoft.VisualStudio.Text.Formatting;
using System;
using System.Collections.Generic;
using System.Linq;
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
        public static IWpfTextView view;

        private static bool isInsideCodeControl = false;
        private static string currentCodeControlId = "";
        private static string currentCodeControlBranch = "";
        private static CodeControlInfo currentCodeControlInfo = null;
        public static bool wereLinesUpdated = false;

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
            if (MyWindowControl.CodeControlInfos.Count == 0 || CodeControlEditorAdornment.wereLinesUpdated == false)
            {
                return;
            }

            MyWindowControl.printInBrowserConsole("!!Number of lines: " + e.NewOrReformattedLines.Count);
            //ITextViewLine linesInFile = 
            CodeControlEditorAdornment.CreateEditorVisuals(null);
            //foreach (ITextViewLine line in e.NewOrReformattedLines)
            //{
            //}
        }

        /// <summary>
        /// Adds the scarlet box behind the 'a' characters within the given line
        /// </summary>
        /// <param name="line">Line to add the adornments</param>
        public static void CreateEditorVisuals(ITextViewLine line)
        {
            MyWindowControl.printInBrowserConsole("9898 Creating adornments: ");
            if (MyWindowControl.CodeControlInfos.Count == 0)
            {
                return;
            }

            IWpfTextViewLineCollection textViewLines = CodeControlEditorAdornment.view.TextViewLines;
            ITextViewLine activeDocumentContents = textViewLines[0];
            string documentContentsStr = activeDocumentContents.Snapshot.GetText();
            List<int> beginIndexArray = new List<int>();
            List<int> endIndexArray = new List<int>();
            List<string> codeShiftArray = new List<string>();

            for(int index = documentContentsStr.IndexOf("//BEGIN"); index > -1; index = documentContentsStr.IndexOf("//BEGIN", index + 1))
            {
                int newLineIndex = documentContentsStr.IndexOf("\n", index + 1);
                string beginSubstring = documentContentsStr.Substring(index, newLineIndex - index);
                string[] codeControlVariantPair = beginSubstring.Split(' ')[1].Trim().Split(':');
                string codeShiftName = codeControlVariantPair[0];

                codeShiftArray.Add(codeShiftName);
                beginIndexArray.Add(index);
            }

            for (int index = documentContentsStr.IndexOf("//END"); index > -1; index = documentContentsStr.IndexOf("//END", index + 1))
            {
                int newLineIndex = documentContentsStr.IndexOf("\n", index + 1);
                endIndexArray.Add(newLineIndex);
            }

            Color color;
            for (int i = 0; i < beginIndexArray.Count; i++)
            {
                int start = beginIndexArray[i];
                int end = endIndexArray[i];
                string codeShiftName = codeShiftArray[i];

                CodeControlInfo codeControl = null;
                foreach (KeyValuePair<string, CodeControlInfo> codeControlInfoPair in MyWindowControl.CodeControlInfos)
                {
                    codeControl = codeControlInfoPair.Value;
                    if (codeShiftName == codeControl.Name)
                    {
                        currentCodeControlId = codeControl.Id;
                        currentCodeControlInfo = codeControl;
                        break;
                    }
                    codeControl = null;
                }

                if ((currentCodeControlInfo == null || codeControl == null) || currentCodeControlInfo != codeControl)
                {
                    continue;
                }

                if (currentCodeControlInfo == MyWindowControl.CurrentCodeControl)
                {
                    color = currentCodeControlInfo.SaturatedColor;
                }
                else
                {
                    color = currentCodeControlInfo.UnsaturatedColor;
                }

                for (int index = start; index < end; index++)
                {
                    SnapshotSpan span = new SnapshotSpan(view.TextSnapshot, Span.FromBounds(index, index + 1));

                    if (view.TextSnapshot[index].ToString().Trim().Length == 0 &&
                        view.TextSnapshot[index + 1].ToString().Trim().Length == 0)
                    {
                        continue;
                    }
                    SolidColorBrush brush = new SolidColorBrush(color);
                    brush.Freeze();

                    SolidColorBrush penBrush = new SolidColorBrush(color);
                    penBrush.Freeze();
                    Pen pen = new Pen(penBrush, 0.5);
                    pen.Freeze();
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

                        layer.AddAdornment(AdornmentPositioningBehavior.TextRelative, span, null, image, null);

                    }
                }
            }

            //foreach (ITextViewLine lineOfCode in textViewLines)
            //{
            //    MyWindowControl.printInBrowserConsole("9898 Line is: ");
            //    MyWindowControl.printInBrowserConsole(lineOfCode.Snapshot.GetText());
            //    if (lineOfCode.Snapshot.GetText().StartsWith("//BEGIN"))
            //    {
            //        isInsideCodeControl = true;

            //        MyWindowControl.printInBrowserConsole("##Line might be: ");
            //        MyWindowControl.printInBrowserConsole(lineOfCode.Snapshot.GetText());

            //        string[] codeControlVariantPair = lineOfCode.Snapshot.GetText().Split(' ')[1].Trim().Split(':');
            //        string codeControlName = codeControlVariantPair[0];
            //        string variantName = codeControlVariantPair[1];

            //        MyWindowControl.printInBrowserConsole("##codeControlName " + codeControlName);
            //        MyWindowControl.printInBrowserConsole("##variantName " + variantName);

            //        foreach (KeyValuePair<string, CodeControlInfo> codeControlInfoPair in MyWindowControl.CodeControlInfos)
            //        {
            //            CodeControlInfo codeControl = codeControlInfoPair.Value;
            //            if (codeControlName == codeControl.Name)
            //            {
            //                currentCodeControlId = codeControl.Id;
            //                currentCodeControlInfo = codeControl;
            //            }
            //        }
            //    }
            //    else if (lineOfCode.Snapshot.GetText().StartsWith("//END"))
            //    {
            //        isInsideCodeControl = false;
            //        currentCodeControlId = "";
            //    }
            //    else
            //    {
            //        if (isInsideCodeControl == true)
            //        {
            //            if (currentCodeControlInfo == MyWindowControl.CurrentCodeControl)
            //            {
            //                color = currentCodeControlInfo.SaturatedColor;
            //            }
            //            else
            //            {
            //                color = currentCodeControlInfo.UnsaturatedColor;

            //                SolidColorBrush brush = new SolidColorBrush(color);
            //                brush.Freeze();

            //                SolidColorBrush penBrush = new SolidColorBrush(color);
            //                penBrush.Freeze();
            //                Pen pen = new Pen(penBrush, 0.5);
            //                pen.Freeze();

            //                Geometry geometry = textViewLines.GetMarkerGeometry(lineOfCode.Extent);
            //                if (geometry != null)
            //                {
            //                    var drawing = new GeometryDrawing(brush, pen, geometry);
            //                    drawing.Freeze();

            //                    var drawingImage = new DrawingImage(drawing);
            //                    drawingImage.Freeze();

            //                    var image = new Image
            //                    {
            //                        Source = drawingImage,
            //                    };

            //                    Align the image with the top of the bounds of the text geometry
            //                    Canvas.SetLeft(image, geometry.Bounds.Left);
            //                    Canvas.SetTop(image, geometry.Bounds.Top);

            //                    CodeControlEditorAdornment.layer.AddAdornment(AdornmentPositioningBehavior.TextRelative, lineOfCode.Extent, null, image, null);
            //                }

            //            }

            //        }
            //    }
            //}
        }

            //foreach (KeyValuePair<string, CodeControlInfo> codeControlInfoPair in MyWindowControl.CodeControlInfos)
            //{
            //    string id = codeControlInfoPair.Key;
            //    CodeControlInfo codeControlInfo = codeControlInfoPair.Value;

            //    Color color;

            //    if (codeControlInfo == MyWindowControl.CurrentCodeControl)
            //    {
            //        color = codeControlInfo.SaturatedColor;
            //    }
            //    else
            //    {
            //        color = codeControlInfo.UnsaturatedColor;
            //    }

            //    SolidColorBrush brush = new SolidColorBrush(color);
            //    brush.Freeze();

            //    SolidColorBrush penBrush = new SolidColorBrush(color);
            //    penBrush.Freeze();
            //    Pen pen = new Pen(penBrush, 0.5);
            //    pen.Freeze();

                //foreach (KeyValuePair<string, CodeControlBranchInfo> codeControlBranchInfoPair in codeControlInfo.CodeControlBranches)
                //{
                //    string branchId = codeControlBranchInfoPair.Key;
                //    CodeControlBranchInfo codeControlBranchInfo = codeControlBranchInfoPair.Value;

                //    for (int charIndex = textViewLines.FirstVisibleLine.Start; charIndex < textViewLines.LastVisibleLine.End; charIndex++)
                //    {
                //        int currentLine = textViewLines.FormattedSpan.Snapshot.GetLineNumberFromPosition(charIndex);

                //        if (currentLine < codeControlBranchInfo.StartLine || currentLine > codeControlBranchInfo.EndLine)
                //        {
                //            continue;
                //        }

                //        SnapshotSpan span = new SnapshotSpan(CodeControlEditorAdornment.view.TextSnapshot, Span.FromBounds(charIndex, charIndex + 1));
                //        Geometry geometry = textViewLines.GetMarkerGeometry(span);
                //        if (geometry != null)
                //        {
                //            var drawing = new GeometryDrawing(brush, pen, geometry);
                //            drawing.Freeze();

                //            var drawingImage = new DrawingImage(drawing);
                //            drawingImage.Freeze();

                //            var image = new Image
                //            {
                //                Source = drawingImage,
                //            };

                //            // Align the image with the top of the bounds of the text geometry
                //            Canvas.SetLeft(image, geometry.Bounds.Left);
                //            Canvas.SetTop(image, geometry.Bounds.Top);

                //            CodeControlEditorAdornment.layer.AddAdornment(AdornmentPositioningBehavior.TextRelative, span, null, image, null);
                //        }

                    //}

                //}
            //}
    }
}
