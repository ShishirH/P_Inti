using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.VisualStudio.Editor;
using Microsoft.VisualStudio.Text;
using Microsoft.VisualStudio.Text.Editor;
using Microsoft.VisualStudio.Text.Formatting;
using Microsoft.VisualStudio.TextManager.Interop;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace P_Inti
{
    public class LineText
    {

        private int line;
        public string buffer;
        public string type;
        private CodeAdornment adornment;
        private IWpfTextViewHost viewHost;
        private string allText;
        public SyntaxNode node;
        //public CodeNode codeAnalysis;

        #region set & get
        public int LineNumber
        {
            get { return line; }
            set { line = value; }
        }

        public CodeAdornment Adornment
        {
            get { return adornment; }
            set { adornment = value; }
        }
        public IWpfTextViewHost ViewHost
        {
            get { return viewHost; }
            set { viewHost = value; }
        }
        public string AllText
        {
            get { return allText; }
            set { allText = value; }
        }

        #endregion

        public LineText()
        {
            this.line = -1;
            this.buffer = " ";
            this.allText = " ";
        }

        public IWpfTextViewHost GetCurrentViewHost()
        {
            // code to get access to the editor's currently selected text 
            IVsTextManager txtMgr = (IVsTextManager)Microsoft.VisualStudio.Shell.ServiceProvider.GlobalProvider.GetService(typeof(SVsTextManager));

            IVsTextView vTextView = null;
            int mustHaveFocus = 1;


            txtMgr.GetActiveView(mustHaveFocus, null, out vTextView);
            IVsUserData userData = vTextView as IVsUserData;

            if (userData == null)
            {
                return null;
            }
            else
            {
                IWpfTextViewHost viewHost;
                object holder;
                Guid guidViewHost = DefGuidList.guidIWpfTextViewHost;
                userData.GetData(ref guidViewHost, out holder);
                viewHost = (IWpfTextViewHost)holder;
                this.viewHost = viewHost;




                return viewHost;

            }


        }



        public void setLine(IWpfTextView view)
        {
            if (view != null)
            {
                SnapshotPoint position = view.Selection.ActivePoint.Position;
                this.line = view.TextBuffer.CurrentSnapshot.GetLineNumberFromPosition(position) + 1;
            }

        }

        public void setBuffer(String text)
        {
            buffer = text;
        }




        //public bool AssignSelectionString(IWpfTextViewHost view, String text) {
        //    if (!view.TextView.Selection.IsEmpty) {
        //        setLine(view.TextView);
        //        addAdornment(view.TextView);
        //        setBuffer(text);
        //        allText = view.TextView.TextBuffer.CurrentSnapshot.GetLineFromLineNumber(line - 1).GetText();
        //        var fulltext = GetTextFromTextView(view.TextView);
        //        var rendexText = CodeNode.GetRendexText(fulltext);
        //        var indexRendexText = CodeNode.GetLineNumberOfRendexText(fulltext, this.line);
        //        codeAnalysis = new CodeNode(rendexText);
        //        node = CodeNode.getNodeByLineNumber(rendexText, codeAnalysis.root, indexRendexText - 1);

        //        type = codeAnalysis.GetType(node).ToLower();

        //        return true;
        //    }
        //    return false;
        //}




        public SnapshotPoint GetSnapshotPointFromLineNumber(int lineNumber)
        {
            return viewHost.TextView.TextBuffer.CurrentSnapshot.GetLineFromLineNumber(lineNumber).Start;
        }

        /*
        public IWpfTextViewLine GetLine()
        {
          
            if (viewHost == null || line == -1)
            {
                return null;
            }
                var text = GetTextFromTextView(viewHost.TextView);
                codeAnalysis.ChangeSyntaxRootNode(text);

                codeAnalysis.SearchNode(buffer, this, type);
                var newPosition = GetSnapshotPointFromLineNumber(line - 1);
                
                return viewHost.TextView.GetTextViewLineContainingBufferPosition(newPosition);
            
        }

        */

        public void addAdornment(IWpfTextView view)
        {
            adornment = new CodeAdornment(view);
        }

        public string GetTextFromTextView(IWpfTextView view)
        {
            return view.TextBuffer.CurrentSnapshot.GetText();
        }

        public bool IsChangedPosition()
        {
            var countLines = viewHost.TextView.TextBuffer.CurrentSnapshot.LineCount;

            if ((line - 1) > countLines)
            {
                return true;
            }
            var text = viewHost.TextView.TextBuffer.CurrentSnapshot.GetLineFromLineNumber(line - 1).GetText();

            return !text.Contains(buffer);
        }

        //public int GetLastLineNumber(SyntaxNode node) {
        //    if (node == null) {
        //        return -1;
        //    }
        //    var newNode = (CSharpSyntaxNode)node;
        //    return codeAnalysis.tree.GetLineSpan(newNode.Span).EndLinePosition.Line;
        //}

        //public WidgetType GetType() {
        //    if (type.Equals("property")) {
        //        var newNode = node as BasePropertyDeclarationSyntax;
        //        var name = newNode.Type.ToString();
        //        return codeAnalysis.GetType(name);
        //    } else {
        //        var newNode = node as FieldDeclarationSyntax;
        //        var name = newNode.Declaration.Type.ToString();
        //        return codeAnalysis.GetType(name);
        //    }
        //}

        //public void AddLines(List<IWpfTextViewLine> lines, SyntaxNode node) {
        //    var lastLine = GetLastLineNumber(node) + 1;
        //    if (lastLine <= line) {
        //        var lineToAdd = viewHost.TextView.GetTextViewLineContainingBufferPosition(GetSnapshotPointFromLineNumber(line - 1)); ;
        //        lines.Add(lineToAdd);
        //    } else {
        //        for (int i = line; i <= lastLine; i++) {
        //            var newLine = viewHost.TextView.GetTextViewLineContainingBufferPosition(GetSnapshotPointFromLineNumber(i - 1));
        //            lines.Add(newLine);
        //        }
        //    }
        //}

        //public List<IWpfTextViewLine> GetLines() {

        //    if (viewHost == null || line == -1) {
        //        return null;
        //    }

        //    var lines = new List<IWpfTextViewLine>();
        //    var text = GetTextFromTextView(viewHost.TextView);
        //    codeAnalysis.ChangeSyntaxRootNode(text);

        //    codeAnalysis.SearchNode(buffer, this, type);
        //    AddLines(lines, node);

        //    return lines;

        //}



    }
}
