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
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;
using System.Windows.Media.Imaging;

namespace P_Inti
{
    internal class SignalGlyphFactory : IGlyphFactory
    {
        const double m_glyphSize = 16.0;

        public UIElement GenerateGlyph(IWpfTextViewLine line, IGlyphTag tag)
        {
            // Ensure we can draw a glyph for this marker.
            if (tag == null || !(tag is SignalGlyphTag))
            {
                return null;
            }

            ImageDrawing signalDrawing = new ImageDrawing();
            signalDrawing.Rect = new Rect(75, 75, 100, 100);
            signalDrawing.ImageSource = new BitmapImage(
                new Uri(@"C:\Users\Hamid Mansoor\Desktop\pinti_final_version\P_Inti\signalwave.png", UriKind.Absolute));

            DrawingBrush drawingBrush = new DrawingBrush(signalDrawing);
            Ellipse ellipse = new Ellipse();
            ellipse.Fill = drawingBrush;
            //ellipse.StrokeThickness = 2;
            //ellipse.Stroke = Brushes.DarkBlue;
            ellipse.Height = m_glyphSize;
            ellipse.Width = m_glyphSize;

            return ellipse;
        }
    }
}
