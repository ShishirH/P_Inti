using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using Microsoft.VisualStudio.Text;
using Microsoft.VisualStudio.Text.Tagging;
using Microsoft.VisualStudio.Text.Editor;
using Microsoft.VisualStudio.Text.Classification;
using Microsoft.VisualStudio.Utilities;
using System.Windows.Forms;
using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Threading;
using Microsoft.VisualStudio.Text;
using Microsoft.VisualStudio.Text.Classification;
using Microsoft.VisualStudio.Text.Editor;
using Microsoft.VisualStudio.Text.Operations;
using Microsoft.VisualStudio.Text.Tagging;
using Microsoft.VisualStudio.Utilities;
using System.Windows.Media;
using Microsoft.VisualStudio.TextManager.Interop;
using Microsoft.VisualStudio.Text.Formatting;
using System.Windows;
using System.Windows.Shapes;

namespace P_Inti
{
    public class TodoTag : IGlyphTag
    {
    }

    public class Taggers : ITagger<TodoTag>
    {

        [Import]
        internal IClassifierAggregatorService AggregatorService;


        private ITextBuffer buffer;


        public event EventHandler<SnapshotSpanEventArgs> TagsChanged;

        public static List<int> linePositions = new List<int> { 10, 3, 4, 15 };
        public static int currentEvaluatedLine = -1;

        public Taggers(ITextBuffer buffer)
        {
            this.buffer = buffer;
        }

        IEnumerable<ITagSpan<TodoTag>> ITagger<TodoTag>.GetTags(NormalizedSnapshotSpanCollection spans)
        {

            IEnumerable<SnapshotSpan> lineSpans = spans.Where(span => span.Start.GetContainingLine().LineNumber == currentEvaluatedLine);

            foreach (SnapshotSpan span in lineSpans)
            {
                yield return new TagSpan<TodoTag>(span, new TodoTag());
            }

        }

        public void update(ITextBuffer SourceBuffer)
        {
            TagsChanged?.Invoke(this, new SnapshotSpanEventArgs(
                              new SnapshotSpan(SourceBuffer.CurrentSnapshot, 0, SourceBuffer.CurrentSnapshot.Length))
                );
        }

        public static void updateTags()
        {
            foreach (var tag in TodoTaggerProvider.Taggers)
            {
                tag.update(tag.buffer);
            }
        }

    }

    [Export(typeof(IViewTaggerProvider))]
    [ContentType("code")]
    [TagType(typeof(TodoTag))]

    internal class TodoTaggerProvider : IViewTaggerProvider
    {

        ITextView View { get; set; }

        public static List<Taggers> Taggers = new List<Taggers>();

        public ITagger<T> CreateTagger<T>(ITextView textView, ITextBuffer buffer) where T : ITag
        {

            if (textView == null)
                return null;

            //provide highlighting only on the top-level buffer
            if (textView.TextBuffer != buffer)
                return null;

            View = textView;

            Taggers tagger = new Taggers(buffer);
            Taggers.Add(tagger);

            View.LayoutChanged += TextView_LayoutChanged;
            View.Caret.PositionChanged += CaretPositionChanged;

            return tagger as ITagger<T>;
        }

        void CaretPositionChanged(object sender, CaretPositionChangedEventArgs e)
        {
            P_Inti.Taggers.updateTags();
        }

        private void TextView_LayoutChanged(object sender, TextViewLayoutChangedEventArgs e)
        {
            //make sure that there has really been a change
            if (e.NewSnapshot != e.OldSnapshot)
            {
                P_Inti.Taggers.updateTags();
            }

        }

    }



    internal class TodoGlyphFactory : IGlyphFactory
    {

        const double glyphWidth = 15.5;
        const double glyphHeight = 10;

        public UIElement GenerateGlyph(IWpfTextViewLine line, IGlyphTag tag)
        {
            // Ensure we can draw a glyph for this marker.
            if (tag == null || !(tag is TodoTag))
            {
                return null;
            }

            //Add the Path Element
            Path myPath = new Path();
            myPath.Stroke = new SolidColorBrush(Colors.DarkGray);
            myPath.Fill = new SolidColorBrush(Colors.LightGray);
            myPath.StrokeThickness = 1;
            myPath.HorizontalAlignment = System.Windows.HorizontalAlignment.Center;
            myPath.VerticalAlignment = VerticalAlignment.Center;

            RectangleGeometry myRectangleGeometry = new RectangleGeometry();
            myRectangleGeometry.Rect = new Rect(0.25, (glyphWidth - glyphHeight) / 2, glyphWidth, glyphHeight);

            myRectangleGeometry.RadiusX = 2;
            myRectangleGeometry.RadiusY = 2;
            myPath.Data = myRectangleGeometry;

            return myPath;
        }


    }

    [Export(typeof(IGlyphFactoryProvider))]
    [Name("TodoGlyph")]
    [Order(After = "VsTextMarker")]
    [ContentType("code")]
    [TagType(typeof(TodoTag))]
    internal sealed class TodoGlyphFactoryProvider : IGlyphFactoryProvider
    {
        public IGlyphFactory GetGlyphFactory(IWpfTextView view, IWpfTextViewMargin margin)
        {
            return new TodoGlyphFactory();
        }
    }








    ///////////////////////////////////////////////////////////////////////
    ////////////////////////// Text highlighting //////////////////////////
    ///////////////////////////////////////////////////////////////////////

    internal class FalseHighlight : TextMarkerTag
    {
        public FalseHighlight() : base("MarkerFormatDefinition/HighlightFalseFormatDefinition") { }
    }
    [Export(typeof(EditorFormatDefinition))]
    [Name("MarkerFormatDefinition/HighlightFalseFormatDefinition")]
    [UserVisible(true)]
    internal class HighlightFalseFormatDefinition : MarkerFormatDefinition
    {
        public HighlightFalseFormatDefinition() : base()
        {

            this.BackgroundColor = Colors.Pink;
            this.ForegroundColor = Colors.DarkRed;
            this.DisplayName = "Highlight Word";
            this.ZOrder = 5;
        }
    }

    internal class TrueHighlight : TextMarkerTag
    {
        public TrueHighlight() : base("MarkerFormatDefinition/HighlightTrueFormatDefinition") { }
    }
    [Export(typeof(EditorFormatDefinition))]
    [Name("MarkerFormatDefinition/HighlightTrueFormatDefinition")]
    [UserVisible(true)]
    internal class HighlightTrueFormatDefinition : MarkerFormatDefinition
    {
        public HighlightTrueFormatDefinition() : base()
        {

            this.BackgroundColor = Colors.LightGreen;
            this.ForegroundColor = Colors.DarkGreen;
            this.DisplayName = "Highlight Word";
            this.ZOrder = 5;
        }
    }

    internal class AssignmentHighlight : TextMarkerTag
    {
        public AssignmentHighlight() : base("MarkerFormatDefinition/HighlightWordFormatDefinition") { }
    }
    [Export(typeof(EditorFormatDefinition))]
    [Name("MarkerFormatDefinition/HighlightWordFormatDefinition")]
    [UserVisible(true)]
    internal class HighlightWordFormatDefinition : MarkerFormatDefinition
    {
        public HighlightWordFormatDefinition() : base()
        {

            //this.BackgroundColor = Utils.glyphFillColor;
            //this.ForegroundColor = Utils.glyphStrokeColor;
            this.BackgroundColor = Colors.Yellow;
            this.ForegroundColor = Colors.Orange;
            this.DisplayName = "Highlight Word";
            this.ZOrder = 5;
        }
    }

    internal class GeneralHighlight : TextMarkerTag
    {
        public GeneralHighlight() : base("MarkerFormatDefinition/HighlightGeneralFormatDefinition") { }
    }
    [Export(typeof(EditorFormatDefinition))]
    [Name("MarkerFormatDefinition/HighlightGeneralFormatDefinition")]
    [UserVisible(true)]
    internal class HighlightGeneralFormatDefinition : MarkerFormatDefinition
    {
        public HighlightGeneralFormatDefinition() : base()
        {
            this.BackgroundColor = Colors.LightBlue;
            this.ForegroundColor = Colors.Blue;
            this.DisplayName = "Highlight Word";
            this.ZOrder = 5;
        }
    }


    internal class HighlightWordTagger : ITagger<TextMarkerTag>
    {

        ITextView View { get; set; }
        ITextBuffer SourceBuffer { get; set; }

        object updateLock = new object();
        public event EventHandler<SnapshotSpanEventArgs> TagsChanged;

        public static int currentEvaluatedLine = -1;
        public static string[] expressionsToHighlight = null;
        public static TextMarkerTag[] markers = null;

        public HighlightWordTagger(ITextView view, ITextBuffer sourceBuffer)
        {
            this.View = view;
            this.SourceBuffer = sourceBuffer;
            this.View.Caret.PositionChanged += CaretPositionChanged;
            this.View.LayoutChanged += ViewLayoutChanged;
        }

        void ViewLayoutChanged(object sender, TextViewLayoutChangedEventArgs e)
        {
            // If a new snapshot wasn't generated, then skip this layout 
            if (e.NewSnapshot != e.OldSnapshot)
            {
                UpdateAtCaretPosition(View.Caret.Position);
            }
        }

        void CaretPositionChanged(object sender, CaretPositionChangedEventArgs e)
        {
            UpdateAtCaretPosition(e.NewPosition);
        }

        void UpdateAtCaretPosition(CaretPosition caretPosition)
        {
            SnapshotPoint? point = caretPosition.Point.GetPoint(SourceBuffer, caretPosition.Affinity);
            if (!point.HasValue)
                return;
            updateTags();
        }

        public void update(ITextBuffer SourceBuffer)
        {
            TagsChanged?.Invoke(this, new SnapshotSpanEventArgs(
                              new SnapshotSpan(SourceBuffer.CurrentSnapshot, 0, SourceBuffer.CurrentSnapshot.Length))
                );
        }

        internal static void updateTags()
        {
            foreach (var tag in HighlightWordTaggerProvider.Taggers)
            {
                tag.update(tag.SourceBuffer);
            }
        }

        IEnumerable<ITagSpan<TextMarkerTag>> ITagger<TextMarkerTag>.GetTags(NormalizedSnapshotSpanCollection spans)
        {

            if (spans.Count == 0)
                yield break;

            if (currentEvaluatedLine != -1 && expressionsToHighlight != null && expressionsToHighlight.Count() != 0)
            {
                IWpfTextView textView = Utils.GetWpfView();
                ITextSnapshotLine textSnapshotLine = textView.TextSnapshot.GetLineFromLineNumber(currentEvaluatedLine);
                string text = textSnapshotLine.GetText();
                MyWindowControl.printInBrowserConsole("text: " + text);
                List<string> expressions = expressionsToHighlight.ToList();
                int i = 0;
                foreach (string searchedText in expressions)
                {

                    List<int> indices = Utils.AllIndexesOf(text, searchedText);
                    MyWindowControl.printInBrowserConsole(searchedText + " " + string.Join(",", indices));
                    foreach (int index in indices)
                    {
                        SnapshotSpan snapshotSpan = new SnapshotSpan(textSnapshotLine.Start + index, textSnapshotLine.Start + index + searchedText.Length);

                        if (i < markers.Length)
                        {
                            TextMarkerTag highlight = markers[i];
                            TagSpan<TextMarkerTag> tag = new TagSpan<TextMarkerTag>(snapshotSpan, highlight);
                            yield return tag;

                        }
                    }
                    i++;

                }
            }
        }
    }


    [Export(typeof(IViewTaggerProvider))]
    [ContentType("code")]
    [TagType(typeof(TextMarkerTag))]
    internal class HighlightWordTaggerProvider : IViewTaggerProvider
    {

        [Import]
        internal ITextSearchService TextSearchService { get; set; }

        [Import]
        internal ITextStructureNavigatorSelectorService TextStructureNavigatorSelector { get; set; }

        public static List<HighlightWordTagger> Taggers = new List<HighlightWordTagger>();

        public ITagger<T> CreateTagger<T>(ITextView textView, ITextBuffer buffer) where T : ITag
        {
            //provide highlighting only on the top buffer 
            if (textView.TextBuffer != buffer)
                return null;

            HighlightWordTagger tagger = new HighlightWordTagger(textView, buffer);

            Taggers.Add(tagger);

            return tagger as ITagger<T>;
        }

    }

}
