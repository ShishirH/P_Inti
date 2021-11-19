using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.Composition;
using System.Windows;
using System.Windows.Shapes;
using System.Windows.Media;
using System.Windows.Controls;
using Microsoft.VisualStudio.Text;
using Microsoft.VisualStudio.Text.Editor;
using Microsoft.VisualStudio.Text.Formatting;
using Microsoft.VisualStudio.Text.Tagging;
using Microsoft.VisualStudio.Utilities;
using Microsoft.VisualStudio.Text.Classification;

namespace P_Inti
{
    [Export(typeof(ITaggerProvider))]
    [ContentType("code")]
    [TagType(typeof(SignalGlyphTag))]
    class SignalGlyphTaggerProvider : ITaggerProvider
    {
        [Import]
        internal IClassifierAggregatorService AggregatorService;

        public static List<SignalGlyphTagger> Taggers = new List<SignalGlyphTagger>();

        public ITagger<T> CreateTagger<T>(ITextBuffer buffer) where T : ITag
        {
            if (buffer == null)
            {
                throw new ArgumentNullException("buffer");
            }

            SignalGlyphTagger tagger = new SignalGlyphTagger(buffer);
            Taggers.Add(tagger);

            return tagger as ITagger<T>;
        }

        void CaretPositionChanged(object sender, CaretPositionChangedEventArgs e)
        {
            P_Inti.SignalGlyphTagger.updateTags();
        }

        private void TextView_LayoutChanged(object sender, TextViewLayoutChangedEventArgs e)
        {
            //make sure that there has really been a change
            if (e.NewSnapshot != e.OldSnapshot)
            {
                P_Inti.SignalGlyphTagger.updateTags();
            }

        }

    }
}
