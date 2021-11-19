using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using Microsoft.VisualStudio.Text;
using Microsoft.VisualStudio.Text.Tagging;
using Microsoft.VisualStudio.Text.Editor;
using Microsoft.VisualStudio.Text.Classification;
using Microsoft.VisualStudio.Utilities;

namespace P_Inti
{
    public class SignalGlyphTag : IGlyphTag { }

    public static class arrayLine
    {
        public static List<int> lineNumbersArray = new List<int>();//{ 17, 2, 1, 0, 0, 0, 0, 0, 0 };
    }

    public class SignalGlyphTagger : ITagger<SignalGlyphTag>
    {
        private IClassifier m_classifier;
        private const string m_searchText = "todo";
        private ITextBuffer buffer;


        internal SignalGlyphTagger(IClassifier classifier)
        {
            m_classifier = classifier;
        }

        public SignalGlyphTagger(ITextBuffer buffer)
        {
            this.buffer = buffer;
        }

        IEnumerable<ITagSpan<SignalGlyphTag>> ITagger<SignalGlyphTag>.GetTags(NormalizedSnapshotSpanCollection spans)
        {
            IEnumerable<SnapshotSpan> lineSpans = spans.Where(span => arrayLine.lineNumbersArray.Contains(span.Start.GetContainingLine().LineNumber));

            foreach (SnapshotSpan span in lineSpans)
            {
                yield return new TagSpan<SignalGlyphTag>(span, new SignalGlyphTag());
            }
        }

        public static IEnumerable<ITagSpan<SignalGlyphTag>> getTagsByLineNumber(List<int> lineNumbers)
        {
            foreach (int lineNumber in lineNumbers)
            {
                yield return new TagSpan<SignalGlyphTag>(new SnapshotSpan(), new SignalGlyphTag());
            }
        }

        public static void updateTags()
        {
            foreach (var tag in SignalGlyphTaggerProvider.Taggers)
            {
                tag.update(tag.buffer);
            }
        }

        public void update(ITextBuffer SourceBuffer)
        {
            TagsChanged?.Invoke(this, new SnapshotSpanEventArgs(
                              new SnapshotSpan(SourceBuffer.CurrentSnapshot, 0, SourceBuffer.CurrentSnapshot.Length))
                );
        }

        public event EventHandler<SnapshotSpanEventArgs> TagsChanged;
    }

}
