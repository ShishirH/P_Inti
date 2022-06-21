using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P_Inti
{
    class LineNumberProcessAssignmentNode
    {
        int lineNumber;
        string processAssignmentNodeString;

        public LineNumberProcessAssignmentNode(int line, string lineValue)
        {
            lineNumber = line;
            processAssignmentNodeString = lineValue;
        }

        public int LineNumber { get => lineNumber; set => lineNumber = value; }
        public string ProcessAssignmentNodeString { get => processAssignmentNodeString; set => processAssignmentNodeString = value; }
    }
}
