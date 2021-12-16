using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;

namespace P_Inti
{
    public class CodeControlInfo
    {
        private int startLine;
        private int endLine;
        private Color saturatedColor;
        private Color unsaturatedColor;

        public CodeControlInfo(int startLine, int endLine, Color saturatedColor, Color unsaturatedColor)
        {
            StartLine = startLine;
            EndLine = endLine;
            SaturatedColor = saturatedColor;
            UnsaturatedColor = unsaturatedColor;
        }

        public int StartLine { get => startLine; set => startLine = value; }
        public int EndLine { get => endLine; set => endLine = value; }
        public Color SaturatedColor { get => saturatedColor; set => saturatedColor = value; }
        public Color UnsaturatedColor { get => unsaturatedColor; set => unsaturatedColor = value; }
    }
}
