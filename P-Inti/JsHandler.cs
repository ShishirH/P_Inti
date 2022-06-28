using Microsoft.VisualStudio.Text.Editor;
using Microsoft.VisualStudio.Text.Formatting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Threading;
using System.Windows.Media;
//using System.Windows.Forms;
using System.Diagnostics;
using Microsoft.VisualStudio.Shell;
using System.Windows.Shapes;
using EnvDTE;
using Microsoft.VisualStudio.TextManager.Interop;
using Microsoft.VisualStudio.Editor;
using TestingCodeAnalysis;
using System.IO;
using Microsoft.CodeAnalysis;
using System.Reflection;
using Microsoft.CodeAnalysis.CSharp;
using Document = Microsoft.CodeAnalysis.Document;
using TypeInfo = Microsoft.CodeAnalysis.TypeInfo;
using System.Security.Policy;
using CefSharp;
using Microsoft.VisualStudio.PlatformUI;
using System.Web.UI.Design.WebControls;
using System.Windows.Media.Animation;
using System.Windows;
using System.Windows.Controls;
using Microsoft.CodeAnalysis.Editing;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Formatting;
using Microsoft.VisualStudio.Text.Tagging;
using Microsoft.CodeAnalysis.Emit;
using Microsoft.CodeAnalysis.Text;
using Microsoft.CodeAnalysis.FindSymbols;
using Microsoft.VisualStudio.Text;
using Newtonsoft.Json;
using System.Windows.Forms;

namespace P_Inti
{
    public class JsHandler
    {

        public MyWindowControl windowControl = null;
        private Dispatcher theDispatcher = null;
        public static string[] accessModifiers = { "public", "private", "protected", "internal" };
        public static string[] builtInTypes = { "bool", "byte", "sbyte", "char", "decimal", "double", "float", "int", "uint", "nint", "nuint", "long", "ulong", "short", "ushort", "string" };


        public static string codeControlFilePath;
        public JsHandler(MyWindowControl windowControl, Dispatcher dispatcher)
        {
            this.theDispatcher = dispatcher;
            this.windowControl = windowControl;
        }

        public void showDevTools(object arg)
        {
            windowControl.theBrowser.ShowDevTools();
        }

        public static Dictionary<string, SyntaxNode> getDescendantsByType(SyntaxNode root, string type)
        {

            Dictionary<string, SyntaxNode> dictionary = new Dictionary<string, SyntaxNode>();

            var members = root.DescendantNodes().OfType<MemberDeclarationSyntax>();

            foreach (var member in members)
            {

                if (member is MethodDeclarationSyntax method && type.Equals("method"))
                {

                    dictionary.Add(method.Identifier.ToString(), method);

                }
                else if (member is PropertyDeclarationSyntax property && type.Equals("property"))
                {

                    dictionary.Add(property.Identifier.ToString(), property);

                }
                else if (member is ClassDeclarationSyntax classDeclaration && type.Equals("class"))
                {
                    dictionary.Add(classDeclaration.Identifier.ToString(), classDeclaration);
                }
                else if (member is NamespaceDeclarationSyntax nameDeclaration && type.Equals("namespace"))
                {

                    dictionary.Add(nameDeclaration.NamespaceKeyword.ToString(), nameDeclaration);
                }
                else if (member is ConstructorDeclarationSyntax constructor && type.Equals("constructor"))
                {

                    dictionary.Add(constructor.Identifier.ToString(), constructor);
                }
                else if (member is InterfaceDeclarationSyntax interfaceDeclaration && type.Equals("interface"))
                {

                    dictionary.Add(interfaceDeclaration.Identifier.ToString(), interfaceDeclaration);
                }
                else if (member is DelegateDeclarationSyntax delegateDeclaration && type.Equals("delegate"))
                {

                    dictionary.Add(delegateDeclaration.Identifier.ToString(), delegateDeclaration);
                }
                else if (member is FieldDeclarationSyntax field && (type.Equals("field")))
                {
                    var name = field.Declaration.Variables.FirstOrDefault().Identifier.ToString();
                    dictionary.Add(name, field);

                }

            }

            return dictionary;

        }

        public void afterInsertingText(object arg)
        {
            saveFiles(null);
            windowControl.assembledSolution = CodeAnalyzer.assembleSearchableSolution(windowControl);
        }

        public Dictionary<string, object> insertText(object arg)
        {

            IDictionary<string, object> input = (IDictionary<string, object>)arg;

            input.TryGetValue("text", out object objectText);
            string text = (string)objectText;

            input.TryGetValue("id", out object objectID);
            string id = (string)objectID;

            input.TryGetValue("mainColor", out object objectFill);
            string mainColor = (string)objectFill;

            MyWindowControl.printInBrowserConsole(text);

            //windowControl.assembledSolution = CodeAnalyzer.assembleSearchableSolution(windowControl);

            Dictionary<string, Document> allDocuments = new Dictionary<string, Document>();
            Dictionary<string, string[]> allContents = new Dictionary<string, string[]>();
            Dictionary<string, SemanticModel> semanticModels = new Dictionary<string, SemanticModel>();
            CodeAnalyzer.getSourceDocuments(windowControl.assembledSolution, out allDocuments, out allContents, out semanticModels);

            Document document = allDocuments.Values.ElementAt(2);
            SyntaxTree tree = document.GetSyntaxTreeAsync().Result;
            SyntaxNode root = tree.GetRoot();

            SyntaxNode lastMethod = null;

            Dictionary<string, SyntaxNode> descendants = JsHandler.getDescendantsByType(root, "method");
            foreach (KeyValuePair<string, SyntaxNode> kvp in descendants)
            {
                MyWindowControl.printInBrowserConsole(kvp.Key + " : " + kvp.Value);
                lastMethod = kvp.Value;
            }

            var linePosition = tree.GetLineSpan(lastMethod.Span).EndLinePosition.Line + 1;
            //var endPosition = tree.GetLineSpan(lastMethod.Span).Span.End.Character + 1;
            var endPosition = lastMethod.Span.Start + lastMethod.Span.Length;

            Dictionary<string, object> gotoArgs = new Dictionary<string, object> {
                { "id", id },
                { "mainColor", mainColor },
                { "startLine", linePosition + 1 },
                { "endLine", linePosition + 1 + 4 },
                { "lineNumber", linePosition + 1 },
                { "file", document.FilePath },
                { "animate", false },
                { "newDispatcher", false }
            };

            Dictionary<string, object> response = new Dictionary<string, object>();
            response.Add("linePosition", linePosition + 1);
            response.Add("file", document.FilePath);

            /*var activeDoc = windowControl.dte.ActiveDocument;
            TextSelection tSelection = (EnvDTE.TextSelection)activeDoc.Selection;
            tSelection.GotoLine(linePosition + 1, false);*/

            //var descendants = root.DescendantNodes();

            //string pancho = "";
            //foreach (var pepe in descendants) {
            //    pancho += "*** " + pepe.ToString() + "\n\n";
            //}

            IVsTextView ivsTextView = Utils.GetActiveView();
            IWpfTextView wpfTextView = Utils.GetWpfView(ivsTextView);


            theDispatcher.Invoke(new Action(() => {


                ITextEdit edit = wpfTextView.TextBuffer.CreateEdit();
                ITextSnapshot snapshot = edit.Snapshot;

                //int position = snapshot.GetText().IndexOf("gist:");
                //edit.Delete(endPosition, 5);
                edit.Insert(endPosition, text);
                edit.Apply();

                goTo(gotoArgs);


                /*string csCode = System.IO.File.ReadAllText(document.FilePath);
                csCode = CSharpSyntaxTree.ParseText(csCode).GetRoot().NormalizeWhitespace().ToFullString();
                MyWindowControl.printInBrowserConsole(csCode);
                ivsTextView = Utils.GetActiveView();
                wpfTextView = Utils.GetWpfView(ivsTextView);
                ITextEdit edit2 = wpfTextView.TextBuffer.CreateEdit();
                edit2.Delete(0, wpfTextView.TextBuffer.CurrentSnapshot.Length);
                edit2.Insert(0, csCode);
                edit2.Apply();
                saveFiles(null);*/

                /*var dte = windowControl.dte;
                var activeDoc = dte.ActiveDocument;
                TextSelection tSelection = (EnvDTE.TextSelection)activeDoc.Selection;
                tSelection.GotoLine(linePosition + 1, false);*/

            }));







            //MyWindowControl.printInBrowserConsole(pancho);

            //VariableDeclarationSyntax variableDeclaration = descendants.OfType<ClassDeclarationSyntax>().FirstOrDefault().DescendantNodes().OfType<VariableDeclarationSyntax>().FirstOrDefault();


            //JsHandler.insertProgramElement(document, variableDeclaration);




            return response;
        }







        public Dictionary<string, object> isValidExpression(object arg)
        {

            Dictionary<string, object> response = new Dictionary<string, object>();

            IDictionary<string, object> input = (IDictionary<string, object>)arg;

            input.TryGetValue("text", out object textObject);
            string expression = (string)textObject;
            expression = expression.Trim();

            List<string> errors = new List<string>();

            ExpressionSyntax parsedExpression = SyntaxFactory.ParseExpression(expression);

            SyntaxTree syntaxTree = CSharpSyntaxTree.ParseText($"class C{{static void Main(string[] args){{var expression = {expression};}}}}");

            var mscorlib = MetadataReference.CreateFromFile(typeof(string).Assembly.Location);

            var compilation = CSharpCompilation.Create("Test").AddSyntaxTrees(syntaxTree).AddReferences(mscorlib);

            bool isValid = true;

            using (var ms = new MemoryStream())
            {

                EmitResult result = compilation.Emit(ms);

                if (!result.Success)
                {
                    int count = 1;
                    IEnumerable<Diagnostic> failures = result.Diagnostics;
                    foreach (Diagnostic diagnostic in failures)
                    {
                        if (diagnostic.Id != "CS0103")
                        {
                            string newError = (count++) + ") " + diagnostic.GetMessage().ToString() + " (" + diagnostic.DefaultSeverity.ToString() + " " + diagnostic.Id + "): " + diagnostic.Location.SourceTree.FilePath + ". Line #:" + diagnostic.Location.GetLineSpan().StartLinePosition.Line + ". Char #:" + diagnostic.Location.ToString();
                            errors.Add(newError);
                            isValid = false;
                        }
                    }
                }
            }


            response.Add("errors", errors.ToArray());

            if (isValid)
            {

                string expressionID = Utils.generateID();

                MyWindowControl.printInBrowserConsole("expressionID: " + expressionID);


                response.Add("expressionID", expressionID);

                Dictionary<string, object> editorState = getEditorState(arg);

                editorState.TryGetValue("startPos", out object startPosObject);
                int startPos = (int)startPosObject;

                editorState.TryGetValue("endPos", out object endPosObject);
                int endPos = (int)endPosObject;

                editorState.TryGetValue("startLine", out object startLineObject);
                int startLine = (int)startLineObject;

                editorState.TryGetValue("endLine", out object endLineObject);
                int endLine = (int)endLineObject;

                editorState.TryGetValue("fileName", out object fileNameObject);
                string fileName = (string)fileNameObject;

                Dictionary<string, Document> allDocuments = new Dictionary<string, Document>();
                Dictionary<string, string[]> allContents = new Dictionary<string, string[]>();
                Dictionary<string, SemanticModel> semanticModels = new Dictionary<string, SemanticModel>();
                CodeAnalyzer.getSourceDocuments(windowControl.assembledSolution, out allDocuments, out allContents, out semanticModels);

                allDocuments.TryGetValue(fileName, out Document document);




                document.TryGetText(out SourceText sourceText);

                SyntaxNode expressionNode = getExpressionNode(sourceText, startLine, startPos, endPos);

                if (expressionNode != null)
                {

                    windowControl.trackedExpressionsIDs.Add(expressionID);
                    windowControl.trackedExpressions.Add(expressionID, Tuple.Create(expressionNode, document.FilePath));

                }
                else
                {
                    isValid = false; // after all, the expression was not an expression we can work with
                }

            }

            response.Add("isValid", isValid);

            return response;

        }



        public static void printNodeHeirarchy(SyntaxNode node)
        {
            if (node == null)
            {
                MyWindowControl.printInBrowserConsole("Node was null inside heirarchy ");
                return;
            }

            MyWindowControl.printInBrowserConsole("Inside heirarchy ");
            SyntaxNode parent = node.Parent;
            //SyntaxKind parentType = parent.Kind();
            //string parentStatement = parent.ToString().Replace("\"", "\\\"").Replace("{", "{{").Replace("}", "}}");

            //// Change starts here
            MyWindowControl.printInBrowserConsole("Node member: " + node.ToString());
            MyWindowControl.printInBrowserConsole("node.Ancestors: " + node.Ancestors().ToString());
            MyWindowControl.printInBrowserConsole("node children: " + node.ChildNodes().ToString());
            MyWindowControl.printInBrowserConsole("node DescendantNodes: " + node.DescendantNodes().ToString());
            //MyWindowControl.printInBrowserConsole("parent member: " + parent.ToString());
            //MyWindowControl.printInBrowserConsole("parentType member: " + parentType.ToString());
            //MyWindowControl.printInBrowserConsole("parentStatement member: " + parentStatement.ToString());


            MyWindowControl.printInBrowserConsole("Child nodes is: ");
            //MyWindowControl.printInBrowserConsole(members.Count());

            foreach (var member in node.ChildNodes().OfType<MemberDeclarationSyntax>())
            {
                MyWindowControl.printInBrowserConsole("Entered inside members");
                //MyWindowControl.printInBrowserConsole(member.ToString());

                if (member is MethodDeclarationSyntax method)
                {
                    MyWindowControl.printInBrowserConsole("Method: " + method.Identifier.ToString());

                }
                else if (member is PropertyDeclarationSyntax property)
                {

                    MyWindowControl.printInBrowserConsole("Property: " + property.Identifier.ToString());

                }
                else if (member is ClassDeclarationSyntax classDeclaration)
                {
                    MyWindowControl.printInBrowserConsole("classDeclaration: " + classDeclaration.Identifier.ToString());
                }
                else if (member is NamespaceDeclarationSyntax nameDeclaration)
                {
                    MyWindowControl.printInBrowserConsole("nameDeclaration: " + nameDeclaration.NamespaceKeyword.ToString());
                }
                else if (member is ConstructorDeclarationSyntax constructor)
                {
                    MyWindowControl.printInBrowserConsole("constructor: " + constructor.Identifier.ToString());

                }
                else if (member is InterfaceDeclarationSyntax interfaceDeclaration)
                {

                    MyWindowControl.printInBrowserConsole("interfaceDeclaration: " + interfaceDeclaration.Identifier.ToString());
                }
                else if (member is DelegateDeclarationSyntax delegateDeclaration)
                {

                    MyWindowControl.printInBrowserConsole("delegateDeclaration: " + delegateDeclaration.Identifier.ToString());
                }
                else if (member is FieldDeclarationSyntax field)
                {
                    var name = field.Declaration.Variables.FirstOrDefault().Identifier.ToString();
                    MyWindowControl.printInBrowserConsole("field: " + name);
                }

            }

            MyWindowControl.printInBrowserConsole("Ancestor nodes is: ");
            //MyWindowControl.printInBrowserConsole(members.Count());

            foreach (var member in node.Ancestors().OfType<MemberDeclarationSyntax>())
            {
                MyWindowControl.printInBrowserConsole("Entered inside members");
                //MyWindowControl.printInBrowserConsole(member.ToString());

                if (member is MethodDeclarationSyntax method)
                {
                    MyWindowControl.printInBrowserConsole("Method: " + method.Identifier.ToString());

                }
                else if (member is PropertyDeclarationSyntax property)
                {

                    MyWindowControl.printInBrowserConsole("Property: " + property.Identifier.ToString());

                }
                else if (member is ClassDeclarationSyntax classDeclaration)
                {
                    MyWindowControl.printInBrowserConsole("classDeclaration: " + classDeclaration.Identifier.ToString());
                }
                else if (member is NamespaceDeclarationSyntax nameDeclaration)
                {
                    MyWindowControl.printInBrowserConsole("nameDeclaration: " + nameDeclaration.NamespaceKeyword.ToString());
                }
                else if (member is ConstructorDeclarationSyntax constructor)
                {
                    MyWindowControl.printInBrowserConsole("constructor: " + constructor.Identifier.ToString());

                }
                else if (member is InterfaceDeclarationSyntax interfaceDeclaration)
                {

                    MyWindowControl.printInBrowserConsole("interfaceDeclaration: " + interfaceDeclaration.Identifier.ToString());
                }
                else if (member is DelegateDeclarationSyntax delegateDeclaration)
                {

                    MyWindowControl.printInBrowserConsole("delegateDeclaration: " + delegateDeclaration.Identifier.ToString());
                }
                else if (member is FieldDeclarationSyntax field)
                {
                    var name = field.Declaration.Variables.FirstOrDefault().Identifier.ToString();
                    MyWindowControl.printInBrowserConsole("field: " + name);
                }

            }

            MyWindowControl.printInBrowserConsole("\n\n\n");
        }

        public Dictionary<string, object> processDropOnCanvas(object arg)
        {

            Dictionary<string, object> editorState = null;
            if (windowControl.projectOpen())
            {

                editorState = getEditorState(arg);

                editorState.TryGetValue("caretPosition", out object caret);
                int caretPosition = (int)caret;

                editorState.TryGetValue("fileName", out object file);
                string fileName = (string)file;

                theDispatcher.Invoke(new Action(() => {

                    // because the files could have been changed, we need to reassemble the assembled solution
                    windowControl.assembledSolution = CodeAnalyzer.assembleSearchableSolution(windowControl);

                    Dictionary<string, Document> allDocuments = new Dictionary<string, Document>();
                    Dictionary<string, string[]> allContents = new Dictionary<string, string[]>();
                    Dictionary<string, SemanticModel> semanticModels = new Dictionary<string, SemanticModel>();
                    CodeAnalyzer.getSourceDocuments(windowControl.assembledSolution, out allDocuments, out allContents, out semanticModels);


                    bool doNotSearchSymbol = false;
                    if (arg != null)
                    {
                        IDictionary<string, object> input = (IDictionary<string, object>)arg;
                        doNotSearchSymbol = (bool)input["doNotSearchSymbol"];
                    }
                    MyWindowControl.printInBrowserConsole("!!!!!!!!! doNotSearchSymbol is " + doNotSearchSymbol);

                    if (!doNotSearchSymbol)
                    {

                        // finding the symbol at the given position in the given file
                        ISymbol symbol = CodeAnalyzer.findSymbolInFile(fileName, caretPosition, allDocuments);

                        MyWindowControl.printInBrowserConsole("()()()()() Symbol is " + symbol.ToString());
                        MyWindowControl.printInBrowserConsole("()()()()() Symbol name is " + symbol.Name.ToString());
                        MyWindowControl.printInBrowserConsole("()()()()() Symbol Kind is " + symbol.Kind.ToString());
                        MyWindowControl.printInBrowserConsole("()()()()() Symbol OriginalDefinition is " + symbol.OriginalDefinition.ToString());
                        MyWindowControl.printInBrowserConsole("()()()()() Symbol OriginalDefinition is " + symbol.OriginalDefinition.ToString());
                        MyWindowControl.printInBrowserConsole("()()()()() Symbol GetType is " + symbol.GetType().ToString());


                        // Element dropped onto the canvas is a method parameter.
                        if (symbol.Kind == SymbolKind.Parameter)
                        {
                            string containingClassName = symbol.ContainingType != null ? symbol.ContainingType.ToString(): "";
                            containingClassName = containingClassName.Substring(containingClassName.LastIndexOf(".") + 1).Trim();
                            string methodName = symbol.ContainingSymbol.ToString();
                            methodName = methodName.Substring(methodName.LastIndexOf(".") + 1, methodName.IndexOf("(") - methodName.LastIndexOf(".") - 1).Trim();

                            ClassDeclarationSyntax myClass = allDocuments[fileName].GetSyntaxTreeAsync().Result.GetRoot().DescendantNodes().OfType<ClassDeclarationSyntax>()
                            .FirstOrDefault(c => c.Identifier.Text == containingClassName);

                            if (myClass != null)
                            {
                                IEnumerable<InvocationExpressionSyntax> methodInvocations = allDocuments[fileName].GetSyntaxRootAsync().Result.DescendantNodes().OfType<InvocationExpressionSyntax>().Where(m => m.Expression.ToFullString().Trim() == methodName);

                                foreach(InvocationExpressionSyntax methodInvocation in methodInvocations)
                                {
                                    MyWindowControl.printInBrowserConsole("123123 methodInvocation is ");
                                    
                                    MyWindowControl.printInBrowserConsole("Method arguments are: " + methodInvocation.ArgumentList.ToFullString());
                                    MyWindowControl.printInBrowserConsole("Method arguments FullSpan is: " + methodInvocation.ArgumentList.FullSpan.ToString());
                                    
                                    //MyWindowControl.printInBrowserConsole("methodInvocation.Expression.ToFullString() " + methodInvocation.Expression.ToFullString());
                                    //MyWindowControl.printInBrowserConsole("methodInvocation.FullSpan.ToFullString() " + methodInvocation.FullSpan.ToString());
                                    //MyWindowControl.printInBrowserConsole("methodInvocation.Language.ToFullString() " + methodInvocation.Language.ToString());
                                    //MyWindowControl.printInBrowserConsole("methodInvocation.Parent.ToFullString() " + methodInvocation.Parent.ToFullString());
                                    //MyWindowControl.printInBrowserConsole("methodInvocation.ArgumentList.ToFullString() " + methodInvocation.ArgumentList.ToFullString());

                                }

                                MethodDeclarationSyntax myMethod = myClass.Members.Where(m => m.Kind() == SyntaxKind.MethodDeclaration)
                                                    .OfType<MethodDeclarationSyntax>()
                                                    .FirstOrDefault(m => m.Identifier.Text == methodName);

                                if (myMethod != null)
                                {
                                    SeparatedSyntaxList<ParameterSyntax> parameters = myMethod.ParameterList.Parameters;

                                    foreach(ParameterSyntax parameter in parameters)
                                    {
                                        MyWindowControl.printInBrowserConsole("()()()()() Parameter " + parameter.ToFullString());
                                    }
                                }
                            }

                            //MyWindowControl.printInBrowserConsole("()()()()() containingClassName is " + containingClassName);
                            //MyWindowControl.printInBrowserConsole("()()()()() methodName is " + methodName);
                        }

                        bool symbolFound = symbol != null;

                        semanticModels.TryGetValue(fileName, out SemanticModel theSemanticModel);
                        allDocuments.TryGetValue(fileName, out Document document);

                        //CHANGE STARTS HERE
                        SyntaxNode objectSyntaxNode = getNodeFromSymbol(symbol);
                        string objectMembers = "";
                        if (objectSyntaxNode == null)
                        {
                            MyWindowControl.printInBrowserConsole("!!!!!!!!! objectSyntaxNode is null");
                        }
                        else
                        {
                            string symbolName = symbol.Name;
                            MyWindowControl.printInBrowserConsole("!!!!!!!!! Symbolname is: " + symbolName);
                            string className = objectSyntaxNode.Ancestors().First().DescendantNodes().First().ToString();

                            // Array
                            if (className.Contains('['))
                            {
                                className = className.Substring(0, className.IndexOf('['));
                                MyWindowControl.printInBrowserConsole("!!!!!!!!! Array dropped to canvas");
                            }

                            MyWindowControl.printInBrowserConsole("!!!!!!!!! ClassName is: " + className);
                            objectMembers = getMembersForClass(allDocuments, semanticModels, className, symbolName);
                        }

                        if (!string.IsNullOrEmpty(objectMembers))
                        {
                            editorState.Add("members", objectMembers);
                        }
                        //CHANGE ENDS HERE

                        editorState.Add("symbolFound", symbolFound);
                        MyWindowControl.printInBrowserConsole("!!!!!!!!! Symbolfound is: " + symbolFound);

                        if (symbolFound)
                        {

                            string symbolID = Utils.generateID();

                            windowControl.positions.Add(caretPosition);
                            windowControl.fileNames.Add(fileName);
                            windowControl.trackedSymbolsIDs.Add(symbolID);



                            MyWindowControl.printInBrowserConsole("&&&&&&&&&&&&&&&&&&&&&&&&&&&& SYMBOL " + symbolFound + " ADDED WITH ID " + symbolID);


                            windowControl.trackedSymbols.Add(symbolID, symbol);

                            editorState.Add("symbolID", symbolID);
                            editorState.Add("Kind", symbol.Kind);
                            editorState.Add("Kind_String", symbol.Kind.ToString());
                            editorState.Add("Name", symbol.Name);
                            editorState.Add("ContainingNamespace", symbol.ContainingNamespace.ToString());
                            editorState.Add("ContainingType", symbol.ContainingType != null ? symbol.ContainingType.ToString() : "");
                            editorState.Add("ContainingSymbol", symbol.ContainingSymbol.ToString());
                            editorState.Add("IsStatic", symbol.IsStatic);
                            editorState.Add("IsSealed", symbol.IsSealed);
                            editorState.Add("IsAbstract", symbol.IsAbstract);
                            editorState.Add("CanBeReferencedByName", symbol.CanBeReferencedByName);
                            editorState.Add("ContainingAssembly", symbol.ContainingAssembly.ToString());
                            editorState.Add("ContainingModule", symbol.ContainingModule.ToString());
                            editorState.Add("DeclaredAccessibility", symbol.DeclaredAccessibility.ToString());
                            editorState.Add("HasUnsupportedMetadata", symbol.HasUnsupportedMetadata);
                            editorState.Add("IsDefinition", symbol.IsDefinition);
                            editorState.Add("IsExtern", symbol.IsExtern);
                            editorState.Add("IsImplicitlyDeclared", symbol.IsImplicitlyDeclared);
                            editorState.Add("IsOverride", symbol.IsOverride);
                            editorState.Add("DeclaringSyntaxReferences", symbol.DeclaringSyntaxReferences.ToString());
                            editorState.Add("OriginalDefinition", symbol.OriginalDefinition.ToString());
                            editorState.Add("Locations", symbol.Locations.ToString());
                            editorState.Add("IsVirtual", symbol.IsVirtual);
                            editorState.Add("Language", symbol.Language);
                            editorState.Add("MetadataName", symbol.MetadataName);
                            editorState.Add("Type", symbol.GetType().ToString());

                            semanticModels.TryGetValue(fileName, out SemanticModel model);

                            // commented block
                            //allDocuments.TryGetValue(fileName, out Document document);
                            //SyntaxNode root = document.GetSyntaxTreeAsync().Result.GetRoot();
                            //SyntaxNode node = root;
                            //Microsoft.CodeAnalysis.Text.TextSpan textSpan = new Microsoft.CodeAnalysis.Text.TextSpan(caretPosition, caretPosition + 1);
                            //SyntaxNode foundNode = root.FindNode(textSpan);
                            //TypeInfo typeInfo = model.GetTypeInfo(foundNode);

                            //editorState.Add("typeInfo.Type", typeInfo.Type.ToString());
                            //MyWindowControl.printInBrowserConsole("Type " + symbol.GetType().ToString());


                            //MyWindowControl.printInBrowserConsole("TypeInfo.Type " + typeInfo.Type.ToString())
                            //printNodeHeirarchy(root);
                            //MyWindowControl.printInBrowserConsole("\n\n\n foundNode: ");
                            //printNodeHeirarchy(foundNode);

                            editorState.Add("MinimalDisplayString", SymbolDisplay.ToMinimalDisplayString(symbol, model, caretPosition));

                            SymbolDisplayFormat df = new SymbolDisplayFormat(
                                SymbolDisplayGlobalNamespaceStyle.Omitted,
                                SymbolDisplayTypeQualificationStyle.NameOnly,
                                SymbolDisplayGenericsOptions.IncludeTypeParameters,
                                SymbolDisplayMemberOptions.IncludeType,
                                SymbolDisplayDelegateStyle.NameOnly,
                                SymbolDisplayExtensionMethodStyle.Default,
                                SymbolDisplayParameterOptions.IncludeType,
                                SymbolDisplayPropertyStyle.NameOnly,
                                SymbolDisplayLocalOptions.IncludeType,
                                SymbolDisplayKindOptions.IncludeTypeKeyword,
                                SymbolDisplayMiscellaneousOptions.UseSpecialTypes);

                            string nameAndType = symbol.ToDisplayString(df).Trim();

                            string[] splitTokens = { " " };
                            string[] parts = nameAndType.Split(splitTokens, StringSplitOptions.RemoveEmptyEntries);


                            //string dataType = .Replace(symbol.Name, "");

                            editorState.Add("dataType", parts[0].Trim());

                            editorState.Add("0", symbol.ToDisplayString(df));
                            editorState.Add("1", symbol.ToDisplayString(SymbolDisplayFormat.MinimallyQualifiedFormat));
                            editorState.Add("2", symbol.ToDisplayString(SymbolDisplayFormat.CSharpErrorMessageFormat));
                            editorState.Add("3", symbol.ToDisplayString(SymbolDisplayFormat.FullyQualifiedFormat));
                            editorState.Add("4", symbol.ToDisplayString(SymbolDisplayFormat.CSharpShortErrorMessageFormat));

                            string displayString = symbol.ToDisplayString();

                            int i = 0;
                            foreach (var location in symbol.Locations)
                            {
                                editorState.Add("location_" + i, location.ToString());
                                i++;
                            }

                            MyWindowControl.printInBrowserConsole("JSHandler getScope");
                            Dictionary<string, object> scopeResults = getScope(symbol, document, windowControl);
                            foreach (KeyValuePair<string, object> kvp in scopeResults)
                            {
                                editorState.Add(kvp.Key, kvp.Value);
                            }


                        }


                    }



                }));

            }

            return editorState;
        }

        private static string getMembersForClass(Dictionary<string, Document> allDocuments, Dictionary<string, SemanticModel> semanticModels, String className, string symbolName)
        {
            StringBuilder sb = new StringBuilder();
            StringWriter sw = new StringWriter(sb);

            using (JsonWriter writer = new JsonTextWriter(sw))
            {
                writer.Formatting = Formatting.None;
                writer.WriteStartObject();

                writer.WritePropertyName("Type");
                writer.WriteValue(className);

                writer.WritePropertyName("Name");
                writer.WriteValue(symbolName);

                writer.WritePropertyName("Members");
                writer.WriteStartArray();

                foreach (var objectDocumentPair in allDocuments)
                {
                    Document objectDocument = objectDocumentPair.Value;
                    SyntaxTree objectSyntaxTree = objectDocument.GetSyntaxTreeAsync().Result;
                    SyntaxNode objectRoot = objectSyntaxTree.GetRoot();

                    SemanticModel objectSemanticModel = semanticModels[objectDocumentPair.Key];
                    IEnumerable<ClassDeclarationSyntax> objectEnumerableRoot = objectRoot.DescendantNodes().OfType<ClassDeclarationSyntax>().Where(item => item.Identifier.ToString() == className);
                    ClassDeclarationSyntax objectDeclarationSyntax = null;
                    IEnumerable<FieldDeclarationSyntax> objectFieldsList = null;

                    if (objectEnumerableRoot != null && objectEnumerableRoot.Count() != 0)
                    {
                        objectDeclarationSyntax = objectEnumerableRoot.First();
                        objectFieldsList = objectDeclarationSyntax.DescendantNodes().OfType<FieldDeclarationSyntax>();

                        if (objectFieldsList != null)
                        {
                            foreach (FieldDeclarationSyntax objectField in objectFieldsList)
                            {
                                MyWindowControl.printInBrowserConsole("\n\n\n######## Declaration line: " + objectField.ToString());
                                string[] declarationLineArray = objectField.ToString().Split(' ');
                                string accessModifier = "";
                                string type = "";

                                // Check if access modifer is the first word of the declaration
                                if (Array.Exists(accessModifiers, x => x == declarationLineArray[0]))
                                {
                                    accessModifier += declarationLineArray[0];
                                    type = declarationLineArray[1];

                                    // C# also has access modifiers consisting of multiple words, such as protected internal and private protected. 
                                    if (Array.Exists(accessModifiers, x => x == declarationLineArray[1]))
                                    {
                                        accessModifier += " " + declarationLineArray[1];
                                        type = declarationLineArray[2];
                                    }
                                }
                                else
                                {
                                    // No access modifier explicitly given. Default to private.
                                    accessModifier = "private";
                                    type = declarationLineArray[0];
                                }

                                foreach (var variable in objectField.Declaration.Variables)
                                {
                                    StringBuilder memberBuilder = new StringBuilder();
                                    StringWriter memberStringWriter = new StringWriter(memberBuilder);

                                    using (JsonWriter memberWriter = new JsonTextWriter(memberStringWriter))
                                    {
                                        memberWriter.Formatting = Formatting.None;
                                        memberWriter.WriteStartObject();

                                        var fieldSymbol = objectSemanticModel.GetDeclaredSymbol(variable);
                                        MyWindowControl.printInBrowserConsole("@@@@@ Access modifier: " + accessModifier);
                                        MyWindowControl.printInBrowserConsole("@@@@@ Type: " + type);
                                        MyWindowControl.printInBrowserConsole("@@@@@ Name: " + fieldSymbol.Name);

                                        memberWriter.WritePropertyName("access_modifier");
                                        memberWriter.WriteValue(accessModifier);

                                        // If type is not primitive, call the function recursively again
                                        if (!Array.Exists(builtInTypes, x => x == type))
                                        {
                                            MyWindowControl.printInBrowserConsole("\n\n\n!!! Getting members for class: " + type);
                                            memberWriter.WritePropertyName("object");
                                            memberWriter.WriteValue(getMembersForClass(allDocuments, semanticModels, type, fieldSymbol.Name));
                                        }
                                        else
                                        {
                                            memberWriter.WritePropertyName("type");
                                            memberWriter.WriteValue(type);

                                            memberWriter.WritePropertyName("name");
                                            memberWriter.WriteValue(fieldSymbol.Name);
                                        }

                                        memberWriter.WriteEnd();
                                    }
                                    writer.WriteValue(memberBuilder.ToString());
                                    MyWindowControl.printInBrowserConsole("\n\n\n@@@@@ ToString: " + memberBuilder.ToString());

                                    //var typeKind = objectSemanticModel.GetTypeInfo(objectField.Declaration.Type).Type.TypeKind; // Gives typekind = class
                                    //MyWindowControl.printInBrowserConsole("\n\n\n@@@@@ TypeKind: " + typeKind);
                                }
                            }
                            writer.WriteEnd();
                            writer.WriteEndObject();
                        }
                    }
                }
            }
            return sb.ToString();
        }

        public static Dictionary<string, object> getScope(ISymbol symbol, Document document, MyWindowControl windowControl)
        {

            Dictionary<string, object> results = new Dictionary<string, object>();

            int i = 0;

            // places where the symbol has been declared
            foreach (SyntaxReference syntaxReference in symbol.DeclaringSyntaxReferences)
            {

                SyntaxNode node = syntaxReference.GetSyntax();

                int declareAtFrom = node.GetLocation().GetLineSpan().StartLinePosition.Line + 1;
                int declareAtTo = node.GetLocation().GetLineSpan().EndLinePosition.Line + 1;
                results.Add("declareAtFrom", declareAtFrom);
                results.Add("declareAtTo", declareAtTo);

                ISymbol declarationEnclosingSymbol = document.GetSemanticModelAsync().Result.GetEnclosingSymbol(node.GetLocation().SourceSpan.Start);
                //ISymbol objectSymbol = CodeAnalyzer.findSymbolInFile(fileName, caretPosition, allDocuments);

                SyntaxNode parent = node.Ancestors().ElementAt(2);

                var firstAncestor = node.Ancestors().First();

                // We need to check for all potential types of declarations (variables, class atributes, etc.)

                if (firstAncestor is VariableDeclarationSyntax)
                {

                    VariableDeclarationSyntax firstAncestorDS = firstAncestor as VariableDeclarationSyntax;

                    var variables = firstAncestorDS.Variables;
                    VariableDeclaratorSyntax declaratorSyntax = variables.First();

                    if (declaratorSyntax != null && declaratorSyntax.Initializer != null)
                    {

                        MyWindowControl.printInBrowserConsole("declaratorSyntax.Initializer.ToFullString(): " + declaratorSyntax.Initializer.ToFullString());
                        MyWindowControl.printInBrowserConsole("declaratorSyntax.Initializer.ToString(): " + declaratorSyntax.Initializer.ToString());

                        string initialValue = declaratorSyntax.Initializer.ToString().Replace('=', ' ').Trim();

                        results.Add("initialValue", initialValue);

                        MyWindowControl.printInBrowserConsole("Initial value of: " + declaratorSyntax.Initializer.ToString());

                    }

                }

                MyWindowControl.printInBrowserConsole("firstAncestor.GetType().ToString(): " + firstAncestor.GetType().ToString());


                int j = 0;
                foreach (var ancestor in node.Ancestors())
                {
                    results.Add("*** Ancestor Kind " + j, ancestor.Kind().ToString());
                    j++;
                }

                int from = parent.GetLocation().GetLineSpan().StartLinePosition.Line + 1;
                int to = parent.GetLocation().GetLineSpan().EndLinePosition.Line + 1;

                /*results.Add("syntaxReference_" + i, node.ToString());
                results.Add("syntaxReference_" + i + "_type", node.GetType().ToString());*/
                //results.Add("parentFrom_" + i, from);
                //results.Add("parentTo_" + i, to);

                results.Add("scopeFrom", from);
                results.Add("scopeTo", to);

                //results.Add("declarator", symbol.ContainingSymbol.ToString());
                results.Add("declarator", declarationEnclosingSymbol.ToString());

                results.Add("filePath", declarationEnclosingSymbol.Locations.First().SourceTree.FilePath);

                i++;
            }

            return results;

        }


        public Dictionary<string, object> onObjectCreated(object arg)
        {

            Dictionary<string, object> result = null;
            IDictionary<string, object> input = (IDictionary<string, object>)arg;

            input.TryGetValue("id", out object idObject);
            string id = (string)idObject;

            input.TryGetValue("mainColor", out object mainColor);
            string color = (string)mainColor;

            input.TryGetValue("opacity", out object opacityObject);
            double opacity = 0.25;
            if (opacityObject != null)
            {
                opacity = Convert.ToDouble(opacityObject);
            }


            IWpfTextView textView = Utils.GetWpfView();

            //if (textView != null) TODO ERROR FIX
            //{
            //    theDispatcher.Invoke(new Action(() => {
            //        Dictionary<string, CodeAdornment> codeAdornments = windowControl.codeAdornments;
            //        SolidColorBrush brush = (SolidColorBrush)(new BrushConverter().ConvertFrom(color));
            //        brush.Opacity = opacity;
            //        CodeAdornment codeAdornment = new CodeAdornment(textView, brush);
            //        codeAdornments.Add(id, codeAdornment);
            //    }));
            //}

            return result;
        }

        public static async void insertProgramElement(Document doc, VariableDeclarationSyntax variableDeclaration)
        {



            /*VariableDeclaratorSyntax variableDeclarator = statement.AncestorsAndSelf().OfType<VariableDeclaratorSyntax>().First();
            FieldDeclarationSyntax fieldStatement = variableDeclarator.AncestorsAndSelf().OfType<FieldDeclarationSyntax>().First();*/



            // VariableDeclarationSyntax variableDeclaration = statement.DescendantNodes().OfType<VariableDeclarationSyntax>().First();

            var newProperty = SyntaxFactory.PropertyDeclaration(variableDeclaration.Type, "hola");

            var editor = await DocumentEditor.CreateAsync(doc);
            editor.InsertAfter(variableDeclaration, newProperty);


        }



        public void paintLinesInEditor(object arg)
        {

            if (arg != null)
            {

                IDictionary<string, object> input = (IDictionary<string, object>)arg;

                input.TryGetValue("file", out object fileName);
                input.TryGetValue("lineNumber", out object lineNumber);

                input.TryGetValue("newDispatcher", out object newDispatcherObject);

                string file = (string)fileName;
                int line = (int)lineNumber;

                bool createNewDispatcher = (bool)newDispatcherObject;

                DTE dte = windowControl.dte;
                dte.MainWindow.Activate();



                if (!dte.ItemOperations.IsFileOpen(file))
                {
                    EnvDTE.Window w = dte.ItemOperations.OpenFile(file, EnvDTE.Constants.vsViewKindTextView);
                }

                var activeDoc = dte.ActiveDocument;
                TextSelection tSelection = (EnvDTE.TextSelection)activeDoc.Selection;


                //tSelection.GotoLine(line + 1, false);
                //tSelection.GotoLine(cursorPosition + 4, false);



                input.TryGetValue("startLine", out object startLine);
                input.TryGetValue("endLine", out object endLine);

                if (startLine == null || endLine == null)
                {
                    startLine = lineNumber;
                    endLine = lineNumber;
                    //MyWindowControl.printInBrowserConsole("startLine or endLine are null");
                }

                int start = (int)startLine;
                int end = (int)endLine;

                IVsTextView ivsTextView = Utils.GetActiveView();
                IWpfTextView wpfTextView = Utils.GetWpfView(ivsTextView);
                var lines = wpfTextView.VisualSnapshot.Lines;

                var linesStart = lines.FirstOrDefault(item => item.LineNumber == start - 1);
                var linesEnd = lines.FirstOrDefault(item => item.LineNumber == end - 1);
                var startPosition = linesStart.Start;
                var endPosition = linesEnd.Start;
                var snapshotSpan = new SnapshotSpan(wpfTextView.TextSnapshot, Span.FromBounds(startPosition, endPosition));

                input.TryGetValue("id", out object idObject);
                string id = (string)idObject;

                Dictionary<string, CodeAdornment> codeAdornments = windowControl.codeAdornments;
                codeAdornments.TryGetValue(id, out CodeAdornment codeAdornment);
                if (codeAdornment == null)
                {
                    onObjectCreated(arg); // this guarantees that this object has a code adornment assigned
                    codeAdornments.TryGetValue(id, out codeAdornment);
                }

                ITextSnapshotLine snapshotLine = null;
                SnapshotPoint snapshotPoint;
                IWpfTextViewLine wpfTextViewLine = null;

                if (createNewDispatcher)
                {

                    theDispatcher.Invoke(new Action(() => {

                        codeAdornment.RemoveVisuals();

                        // wpfTextView.ViewScroller.EnsureSpanVisible(snapshotSpan, EnsureSpanVisibleOptions.AlwaysCenter);
                        for (int i = start; i <= end; i++)
                        {
                            snapshotLine = snapshotSpan.Snapshot.GetLineFromLineNumber(i);
                            if (snapshotLine != null)
                            {
                                snapshotPoint = snapshotLine.Start;
                                wpfTextViewLine = wpfTextView.GetTextViewLineContainingBufferPosition(snapshotPoint);
                                codeAdornment.CreateVisuals(wpfTextViewLine);
                            }
                        }

                    }));

                }

            }
        }


        public void goTo(object arg)
        {

            if (arg != null)
            {

                IDictionary<string, object> input = (IDictionary<string, object>)arg;

                input.TryGetValue("file", out object fileName);
                input.TryGetValue("lineNumber", out object lineNumber);
                input.TryGetValue("animate", out object animateObject);
                input.TryGetValue("newDispatcher", out object newDispatcherObject);

                string file = (string)fileName;
                int line = (int)lineNumber;
                bool animate = (bool)animateObject;
                bool createNewDispatcher = (bool)newDispatcherObject;

                DTE dte = windowControl.dte;
                dte.MainWindow.Activate();



                if (!dte.ItemOperations.IsFileOpen(file))
                {
                    EnvDTE.Window w = dte.ItemOperations.OpenFile(file, EnvDTE.Constants.vsViewKindTextView);
                }


                IWpfTextView textView = Utils.GetWpfView();
                int cursorCurrentPosition = textView.Selection.StreamSelectionSpan.Start.Position.GetContainingLine().LineNumber;

                var activeDoc = dte.ActiveDocument;
                TextSelection tSelection = (EnvDTE.TextSelection)activeDoc.Selection;


                //tSelection.GotoLine(line + 1, false);
                //tSelection.GotoLine(cursorPosition + 4, false);



                input.TryGetValue("startLine", out object startLine);
                input.TryGetValue("endLine", out object endLine);

                if (startLine == null || endLine == null)
                {
                    startLine = lineNumber;
                    endLine = lineNumber;
                    //MyWindowControl.printInBrowserConsole("startLine or endLine are null");
                }

                int start = (int)startLine;
                int end = (int)endLine;

                IVsTextView ivsTextView = Utils.GetActiveView();
                IWpfTextView wpfTextView = Utils.GetWpfView(ivsTextView);
                var lines = wpfTextView.VisualSnapshot.Lines;

                var linesStart = lines.FirstOrDefault(item => item.LineNumber == start - 1);
                var linesEnd = lines.FirstOrDefault(item => item.LineNumber == end - 1);
                var startPosition = linesStart.Start;
                var endPosition = linesEnd.Start;
                var snapshotSpan = new SnapshotSpan(wpfTextView.TextSnapshot, Span.FromBounds(startPosition, endPosition));

                input.TryGetValue("id", out object idObject);
                string id = (string)idObject;

                Dictionary<string, CodeAdornment> codeAdornments = windowControl.codeAdornments;
                codeAdornments.TryGetValue(id, out CodeAdornment codeAdornment);
                if (codeAdornment == null)
                {
                    onObjectCreated(arg); // this guarantees that this object has a code adornment assigned
                    codeAdornments.TryGetValue(id, out codeAdornment);
                }

                ITextSnapshotLine snapshotLine = null;
                SnapshotPoint snapshotPoint;
                IWpfTextViewLine wpfTextViewLine = null;


                int a, b, c, verticalScrollPosition;
                var scrollInfo = ivsTextView.GetScrollInfo(1, out a, out b, out c, out verticalScrollPosition);

                int difference = line - cursorCurrentPosition;
                ScrollDirection scrollDirection = difference > 0 ? ScrollDirection.Down : ScrollDirection.Up;

                if (createNewDispatcher)
                {

                    theDispatcher.Invoke(new Action(() => {

                        codeAdornment.RemoveVisuals();



                        ivsTextView.SetScrollPosition(1, verticalScrollPosition);

                        if (difference == 0 || !animate)
                        {

                            tSelection.GotoLine(line + 1, false);
                            wpfTextView.ViewScroller.EnsureSpanVisible(snapshotSpan, EnsureSpanVisibleOptions.AlwaysCenter);
                            for (int i = start; i <= end; i++)
                            {
                                snapshotLine = snapshotSpan.Snapshot.GetLineFromLineNumber(i);
                                if (snapshotLine != null)
                                {
                                    snapshotPoint = snapshotLine.Start;
                                    wpfTextViewLine = wpfTextView.GetTextViewLineContainingBufferPosition(snapshotPoint);
                                    codeAdornment.CreateVisuals(wpfTextViewLine);
                                }
                            }


                        }
                        else
                        {


                            DispatcherTimer timer = new DispatcherTimer();
                            int totalSteps = 10;
                            double seconds = 0.5;
                            timer.Interval = TimeSpan.FromSeconds(seconds / totalSteps);
                            int currentStep = 1;



                            timer.Tick += (ss, ee) => {
                                if (currentStep >= totalSteps)
                                {
                                    timer.Stop();
                                    tSelection.GotoLine(line + 1, false);
                                    wpfTextView.ViewScroller.EnsureSpanVisible(snapshotSpan, EnsureSpanVisibleOptions.AlwaysCenter);
                                    for (int i = start; i <= end; i++)
                                    {
                                        snapshotLine = snapshotSpan.Snapshot.GetLineFromLineNumber(i);
                                        if (snapshotLine != null)
                                        {
                                            snapshotPoint = snapshotLine.Start;
                                            wpfTextViewLine = wpfTextView.GetTextViewLineContainingBufferPosition(snapshotPoint);
                                            codeAdornment.CreateVisuals(wpfTextViewLine);
                                        }
                                    }
                                }
                                else
                                {
                                    currentStep++;
                                    wpfTextView.ViewScroller.ScrollViewportVerticallyByLines(scrollDirection, Math.Abs(difference / totalSteps));

                                    //tSelection.GotoLine(cursorCurrentPosition + 1 + (currentStep * difference / totalSteps), false);

                                }
                            };
                            timer.Start();

                        }

                        //MyWindowControl.printInBrowserConsole("difference: " + difference);






                        //wpfTextView.ViewScroller.ScrollViewportVerticallyByLines(ScrollDirection.Down, 4);





                    }));

                }
                else
                {







                    codeAdornment.RemoveVisuals();



                    ivsTextView.SetScrollPosition(1, verticalScrollPosition);

                    if (difference == 0 || !animate)
                    {

                        MyWindowControl.printInBrowserConsole("HERE");

                        wpfTextView.ViewScroller.ScrollViewportVerticallyByLines(scrollDirection, Math.Abs(difference));

                        tSelection.GotoLine(line + 1, false);
                        wpfTextView.ViewScroller.EnsureSpanVisible(snapshotSpan, EnsureSpanVisibleOptions.AlwaysCenter);
                        for (int i = start; i <= end; i++)
                        {
                            snapshotLine = snapshotSpan.Snapshot.GetLineFromLineNumber(i);
                            if (snapshotLine != null)
                            {
                                snapshotPoint = snapshotLine.Start;
                                wpfTextViewLine = wpfTextView.GetTextViewLineContainingBufferPosition(snapshotPoint);
                                codeAdornment.CreateVisuals(wpfTextViewLine);

                            }
                            else
                            {
                                MyWindowControl.printInBrowserConsole("NULL line " + i);
                            }
                        }


                    }
                    else
                    {


                        DispatcherTimer timer = new DispatcherTimer();
                        int totalSteps = 10;
                        double seconds = 0.5;
                        timer.Interval = TimeSpan.FromSeconds(seconds / totalSteps);
                        int currentStep = 1;
                        timer.Tick += (ss, ee) => {
                            if (currentStep >= totalSteps)
                            {
                                timer.Stop();
                                tSelection.GotoLine(line + 1, false);
                                wpfTextView.ViewScroller.EnsureSpanVisible(snapshotSpan, EnsureSpanVisibleOptions.AlwaysCenter);
                                for (int i = start; i <= end; i++)
                                {
                                    snapshotLine = snapshotSpan.Snapshot.GetLineFromLineNumber(i);
                                    if (snapshotLine != null)
                                    {
                                        snapshotPoint = snapshotLine.Start;
                                        wpfTextViewLine = wpfTextView.GetTextViewLineContainingBufferPosition(snapshotPoint);
                                        codeAdornment.CreateVisuals(wpfTextViewLine);
                                    }
                                }
                            }
                            else
                            {
                                currentStep++;
                                wpfTextView.ViewScroller.ScrollViewportVerticallyByLines(scrollDirection, Math.Abs(difference / totalSteps));

                                //tSelection.GotoLine(cursorCurrentPosition + 1 + (currentStep * difference / totalSteps), false);

                            }
                        };
                        timer.Start();

                    }

                    MyWindowControl.printInBrowserConsole("difference: " + difference);





                }




            }
        }

        private void MyWidthAnimatedButtonStoryboard_Changed(object sender, EventArgs e)
        {
            MyWindowControl.printInBrowserConsole(e.ToString());
        }



        public Dictionary<string, object> reset(object arg)
        {
            Dictionary<string, object> result = new Dictionary<string, object>();
            theDispatcher.Invoke(new Action(() => {
                windowControl.fileNames.Clear();
                windowControl.positions.Clear();
                windowControl.trackedSymbols.Clear();
                windowControl.trackedSymbolsIDs.Clear();
                MyWindowControl.signalsPositions.Clear();
                MyWindowControl.trackedSignalIDs.Clear();
                windowControl.trackedExpressions.Clear();

                arrayLine.lineNumbersArray.Clear();
                SignalGlyphTagger.updateTags();
                windowControl.trackedExpressionsIDs.Clear();
                windowControl.codeAdornments.Clear();
                CodeAnalyzer.setEvaluatedLine(-1, null, null);
            }));
            return result;
        }

        public Dictionary<string, object> getEditorState(object arg)
        {

            // possible alternative to obtain caret position: view.TextViewLines.GetCaretBounds(view.Caret.Position.BufferPosition)

            Dictionary<string, object> result = new Dictionary<string, object>();

            IWpfTextView textView = Utils.GetWpfView();

            if (textView != null)
            {

                string fileName = windowControl.dte.ActiveDocument.FullName;

                LineText lineText = new LineText();
                lineText.setLine(textView);
                // FIX ERROR TODO lineText.addAdornment(textView);


                var selection = (TextSelection)windowControl.dte.ActiveDocument.Selection;

                int caretPosition = textView.Caret.Position.BufferPosition.Position;

                // string selectedText = textView.Selection.StreamSelectionSpan.GetText();
                string selectedText = selection.Text;
                int start = textView.Selection.StreamSelectionSpan.Start.Position;
                int end = textView.Selection.StreamSelectionSpan.End.Position;

                int startLine = textView.Selection.StreamSelectionSpan.Start.Position.GetContainingLine().LineNumber;
                int endLine = textView.Selection.StreamSelectionSpan.End.Position.GetContainingLine().LineNumber;

                result.Add("selectedText", selectedText);
                result.Add("startPos", start);
                result.Add("endPos", end);
                result.Add("startLine", startLine);
                result.Add("endLine", endLine);
                result.Add("fileName", fileName);
                result.Add("caretPosition", caretPosition);
            }

            return result;

        }

        public Dictionary<string, object> getTrackedSymbolsIDs(object arg)
        {

            Dictionary<string, object> result = new Dictionary<string, object>();
            if (windowControl.projectOpen())
            {
                List<string> trackedSymbolsIDs = windowControl.trackedSymbolsIDs;
                result.Add("trackedSymbolsIDs", trackedSymbolsIDs.ToArray());
            }
            return result;
        }

        public void setEvaluatedLine(object arg)
        {
            IDictionary<string, object> input = (IDictionary<string, object>)arg;

            input.TryGetValue("lineNumber", out object lineNumberString);
            int lineNumber = (int)lineNumberString;

            string expressions = (string)input["expressions"];

            string[] values = ((string)input["values"].ToString()).Split(',');
            string[] types = (input["types"].ToString()).Split(',');



            TextMarkerTag[] markers = new TextMarkerTag[values.Length];

            for (int i = 0; i < values.Length; i++)
            {
                string value = values[i];
                string type = types[i];

                MyWindowControl.printInBrowserConsole("value: " + value + " type: " + type);

                if (value == "True")
                {

                    markers[i] = new TrueHighlight();

                }
                else if (value == "False")
                {

                    markers[i] = new FalseHighlight();

                }
                else if (type == "SimpleAssignmentExpression" || type == "PreDecrementExpression" || type == "PostDecrementExpression" || type == "PreIncrementExpression" || type == "PostIncrementExpression" || type == "ElementAccessExpression")
                {

                    markers[i] = new AssignmentHighlight();

                }
                else
                {

                    markers[i] = new GeneralHighlight();

                }
            }
            CodeAnalyzer.setEvaluatedLine(lineNumber, expressions.Split(','), markers);
        }


        public Dictionary<string, object> runCodeAnalyzer(object arg)
        {

            Dictionary<string, object> result = new Dictionary<string, object>();
            if (windowControl.projectOpen())
            {

                string solutionPath = windowControl.dte.Solution.FullName;
                string solutionDir = System.IO.Path.GetDirectoryName(solutionPath);
                string progvolverDir = solutionDir + "/progvolver";

                if (!Directory.Exists(progvolverDir))
                {
                    Directory.CreateDirectory(progvolverDir);
                }
                var outputDir = progvolverDir + "/" + Utils.generateID();

                List<string> fileNames = windowControl.fileNames;
                List<int> positions = windowControl.positions;
                List<string> trackedSymbolsIDs = windowControl.trackedSymbolsIDs;
                List<string> trackedExpressionsIDs = windowControl.trackedExpressionsIDs;

                string[] logFileContent;
                string[] scopeFileContent;
                bool success;

                var compilationMessage = CodeAnalyzer.analyzeCode(windowControl.assembledSolution, outputDir, fileNames, positions, trackedSymbolsIDs, trackedExpressionsIDs, out logFileContent, out scopeFileContent, windowControl, out success);

                string[] signalFileContent = { };
                string signalFilePath = outputDir + "\\" + "run" + ".signal";

                FileInfo signalFileInfo = new FileInfo(signalFilePath);

                if (signalFileInfo.Exists)
                {
                    signalFileContent = File.ReadAllLines(outputDir + "\\" + "run" + ".signal");
                }

                result.Add("trackedSymbolsIDs", trackedSymbolsIDs.ToArray());
                result.Add("trackedExpressionsIDs", trackedExpressionsIDs.ToArray());
                result.Add("trackedSignalIDs", MyWindowControl.trackedSignalIDs.ToArray());
                result.Add("logFileContent", logFileContent);
                result.Add("scopeFileContent", scopeFileContent);
                result.Add("signalFileContent", signalFileContent);
                result.Add("success", success);
                result.Add("response", compilationMessage);
            }
            return result;
        }


        public Dictionary<string, object> onObjectSelected(object arg)
        {

            Dictionary<string, object> result = null;
            IDictionary<string, object> input = (IDictionary<string, object>)arg;

            input.TryGetValue("id", out object idObject);
            string id = (string)idObject;

            input.TryGetValue("startLine", out object startLine);
            input.TryGetValue("endLine", out object endLine);

            if (startLine == null || endLine == null)
            {
                System.Windows.MessageBox.Show("startLine or endLine are null");
                return null;
            }

            int start = (int)startLine;
            int end = (int)endLine;

            //MessageBox.Show(startLine + " - " + endLine);


            IVsTextView ivsTextView = Utils.GetActiveView();
            IWpfTextView wpfTextView = Utils.GetWpfView(ivsTextView);

            //ITextSnapshot snapshot = wpfTextView.TextBuffer.CurrentSnapshot;



            var lines = wpfTextView.VisualSnapshot.Lines;
            var linesStart = lines.FirstOrDefault(a => a.LineNumber == start - 1);
            var linesEnd = lines.FirstOrDefault(a => a.LineNumber == end - 1);
            var startPosition = linesStart.Start;
            var endPosition = linesEnd.Start;
            var snapshotSpan = new SnapshotSpan(wpfTextView.TextSnapshot, Span.FromBounds(startPosition, endPosition));

            Dictionary<string, CodeAdornment> codeAdornments = windowControl.codeAdornments;
            codeAdornments.TryGetValue(id, out CodeAdornment codeAdornment);
            if (codeAdornment == null)
            {
                onObjectCreated(arg); // this is going to guarantee that this object has a code adornment assigned
                codeAdornments.TryGetValue(id, out codeAdornment);
            }

            theDispatcher.Invoke(new Action(() => {
                wpfTextView.ViewScroller.EnsureSpanVisible(snapshotSpan, EnsureSpanVisibleOptions.AlwaysCenter);
                for (int i = start; i <= end; i++)
                {
                    ITextSnapshotLine snapshotLine = snapshotSpan.Snapshot.GetLineFromLineNumber(i);
                    if (snapshotLine != null)
                    {
                        SnapshotPoint snapshotPoint = snapshotLine.Start;
                        IWpfTextViewLine line = wpfTextView.GetTextViewLineContainingBufferPosition(snapshotPoint);
                        codeAdornment.CreateVisuals(line);
                    }
                }
            }));





            return null;


            //Dictionary<string, CodeAdornment> codeAdornments = windowControl.codeAdornments;
            //codeAdornments.TryGetValue(id, out CodeAdornment codeAdornment);




            //if (codeAdornment == null) {
            //    onObjectCreated(arg); // this is going to guarantee that this object has a code adornment assigned
            //    codeAdornments.TryGetValue(id, out codeAdornment);
            //}



            /*for (int i = start; i <= end; i++) {
                ITextSnapshotLine snapshotLine = snapshot.GetLineFromLineNumber(i);
                if (snapshotLine != null) {
                    SnapshotPoint snapshotPoint = snapshotLine.Start;
                    IWpfTextViewLine line = textView.GetTextViewLineContainingBufferPosition(snapshotPoint);
                    theDispatcher.Invoke(new Action(() => {
                        codeAdornment.CreateVisuals(line);
                    }));
                }
            }*/




            //IWpfTextViewLineCollection lines = wpfTextView.TextViewLines;
            ////for (int i = start; i <= end; i++) {
            ////    if () { 
            ////    }
            ////    ITextViewLine line = lines.ElementAt(i);
            ////    theDispatcher.Invoke(new Action(() => {
            ////        codeAdornment.CreateVisuals(line);
            ////    }));
            ////}

            //List<ITextViewLine> copy = lines.Skip(start).Take(end - start + 2).ToList();
            //foreach (ITextViewLine line in copy) {
            //    theDispatcher.Invoke(new Action(() => {
            //        codeAdornment.CreateVisuals(line);
            //    }));
            //}



            //try {

            //    ITextSnapshotLine snapshotLine = snapshot.GetLineFromLineNumber(i);

            //    if (snapshotLine != null) {

            //        SnapshotPoint snapshotPoint = snapshotLine.Start;
            //        IWpfTextViewLine line = textView.GetTextViewLineContainingBufferPosition(snapshotPoint);

            //        //Color col = (Color)ColorConverter.ConvertFromString("Red");



            //        //MessageBox.Show(color);

            //        theDispatcher.Invoke(new Action(() => {



            //            //codeAdornment.setLine(textView);
            //            //codeAdornment.addAdornment(textView);
            //            //codeAdornment.CreateVisuals(line, brush);
            //            codeAdornment.CreateVisuals(line);


            //        }));


            //    }


            //} catch (Exception e) {
            //    Console.WriteLine(e.Message);
            //}











            return result;

        }

        public Dictionary<string, object> onObjectDeselected(object arg)
        {

            Dictionary<string, object> result = null;
            IDictionary<string, object> input = (IDictionary<string, object>)arg;

            input.TryGetValue("id", out object idObject);
            string id = (string)idObject;

            theDispatcher.Invoke(new Action(() => {

                Dictionary<string, CodeAdornment> codeAdornments = windowControl.codeAdornments;
                CodeAdornment codeAdornment = null;
                codeAdornments.TryGetValue(id, out codeAdornment);

                if (codeAdornment != null)
                {
                    codeAdornment.RemoveVisuals();
                }

            }));

            return result;

        }

        public static void SaveAllFiles(EnvDTE.Solution soln)
        {
            for (int i = 1; i <= soln.Projects.Count; i++)
            {
                if (!soln.Projects.Item(i).Saved)
                {
                    soln.Projects.Item(i).Save();
                }
                for (int j = 1; j <= soln.Projects.Item(i).ProjectItems.Count; j++)
                {
                    if (!soln.Projects.Item(i).ProjectItems.Item(j).Saved)
                    {
                        soln.Projects.Item(i).ProjectItems.Item(j).Save();
                    }
                }
            }
        }

        public void saveFiles(object arg)
        {
            SaveAllFiles(windowControl.openedSolution);
        }

        public static SyntaxNode getExpressionNode(SourceText sourceText, int line, int startPosition, int endPosition)
        {

            SyntaxNode expressionNode = null;
            Microsoft.CodeAnalysis.Text.TextSpan lineSpan = sourceText.Lines[line].Span;
            int length = endPosition - startPosition;
            Microsoft.CodeAnalysis.Text.TextSpan theSpan = new Microsoft.CodeAnalysis.Text.TextSpan(startPosition, length);

            var tree = SyntaxFactory.ParseSyntaxTree(sourceText);
            var nodeFound = tree.GetRoot().FindNode(lineSpan);
            IEnumerable<SyntaxNode> allNodes = nodeFound.DescendantNodes().Where(x => theSpan.Contains(x.Span));

            if (allNodes != null && allNodes.Count() > 1)
            {
                expressionNode = allNodes.First();
            }
            return expressionNode;
        }


        public static List<ISymbol> getSymbolsFromExpression(SyntaxNode expressionNode, Document document, out List<SyntaxNode> nodes)
        {
            List<ISymbol> symbols = new List<ISymbol>();
            nodes = new List<SyntaxNode>();
            IEnumerable<SyntaxNode> identifiers = expressionNode.DescendantNodes().Where(x => x.IsKind(SyntaxKind.IdentifierName));
            foreach (SyntaxNode identifier in identifiers)
            {
                nodes.Add(identifier);
                ISymbol symbol = SymbolFinder.FindSymbolAtPositionAsync(document, identifier.Span.Start).Result;
                symbols.Add(symbol);
            }
            return symbols;
        }

        public static SyntaxNode getNodeFromSymbol(ISymbol symbol)
        {
            SyntaxNode node = null;
            if (symbol.Locations.FirstOrDefault() is Location location)
            {
                node = location.SourceTree?.GetRoot()?.FindNode(location.SourceSpan);
            }
            return node;
        }

        public Dictionary<string, object> createCodeControlBranch(object arg)
        {
            Dictionary<string, object> result = new Dictionary<string, object>();
            string idStr;
            string branchIdStr;

            if (arg != null)
            {
                IDictionary<string, object> input = (IDictionary<string, object>)arg;
                input.TryGetValue("id", out object id);
                input.TryGetValue("branchId", out object branchId);

                idStr = (string)id;
                branchIdStr = (string)branchId;

                MyWindowControl.printInBrowserConsole(codeControlFilePath);

                // Initialize or Reinitialize JSON file
                CodeControls.InitializeJsonFile(idStr, branchIdStr, codeControlFilePath);
            }
            //if (windowControl.projectOpen())
            //{
            //    string solutionDir = System.IO.Path.GetDirectoryName(windowControl.dte.Solution.FullName);
            //    MyWindowControl.printInBrowserConsole(solutionDir);

            //    solutionDir = "\"" + solutionDir + "\"";

            //    // Initialize or Reinitialize JSON file
            //    CodeControls.InitializeGitRepo(solutionDir);

            //    int numberOfBranches = CodeControls.GetNumberOfBranches(solutionDir);
            //    MyWindowControl.printInBrowserConsole("Number of Branches: " + numberOfBranches);

            //    string id = Utils.generateID();
            //    string branchName = "";
            //    if (numberOfBranches != -1)
            //    {
            //        if (numberOfBranches == 0)
            //        {
            //            // No branches yet, commit everything on master
            //            branchName = "master";
            //            MyWindowControl.CurrentBranchID = id;
            //            MyWindowControl.CurrentBranch = branchName;
            //            MyWindowControl.GitBranchID.Add(branchName, id);

            //            CodeControls.ParseGitDiff(solutionDir, branchName, id);
            //            CodeControls.AddGitChanges(solutionDir);
            //            CodeControls.CommitGitChanges(solutionDir);
            //        }
            //        else
            //        {
            //            // Earlier commits already made. Commit changes to present branch and then checkout to new branch
            //            CodeControls.ParseGitDiff(solutionDir, MyWindowControl.CurrentBranch, MyWindowControl.CurrentBranchID);
            //            CodeControls.AddGitChanges(solutionDir);
            //            CodeControls.CommitGitChanges(solutionDir);

            //            branchName = id;
            //            MyWindowControl.CurrentBranchID = id;
            //            MyWindowControl.CurrentBranch = branchName;
            //            MyWindowControl.GitBranchID.Add(branchName, id);

            //            // branchName = id; TODO WHY???
            //            CodeControls.CreateAndCheckoutGitBranch(solutionDir, id);
            //            CodeControls.CommitGitChanges(solutionDir);
            //        }
            //    }

            //    result.Add("id", id);
            //    result.Add("branchName", branchName);
            //}
            return result;
        }

        public Dictionary<string, object> goToControlBranch(object arg)
        {
            Dictionary<string, object> result = new Dictionary<string, object>();

            string solutionDir = System.IO.Path.GetDirectoryName(windowControl.dte.Solution.FullName);

            solutionDir = "\"" + solutionDir + "\"";

            if (arg != null)
            {
                IDictionary<string, object> input = (IDictionary<string, object>)arg;
                input.TryGetValue("branchName", out object branchName);
                string branch = (string)branchName;
                CodeControls.CheckoutToBranch(solutionDir, branch);
            }

            return result;
        }
        public Dictionary<string, object> updateControlBranch(object arg)
        {
            // First check if we are on the said branch, only then allow update TODO discuss this

            Dictionary<string, object> result = new Dictionary<string, object>();

            string solutionDir = System.IO.Path.GetDirectoryName(windowControl.dte.Solution.FullName);
            solutionDir = "\"" + solutionDir + "\"";

            if (arg != null)
            {
                IDictionary<string, object> input = (IDictionary<string, object>)arg;
                input.TryGetValue("branchName", out object branchName);
                input.TryGetValue("id", out object id);

                string branch = (string)branchName;
                string idStr = (string)id;

                CodeControls.ParseGitDiff(solutionDir, branch, idStr);
                CodeControls.AddGitChanges(solutionDir);
                CodeControls.CommitGitChanges(solutionDir);
            }
            return result;
        }

        public Dictionary<string, object> deleteControlBranch(object arg)
        {
            // First check if we are on the said branch, only then allow delete TODO discuss this

            Dictionary<string, object> result = new Dictionary<string, object>();

            string solutionDir = System.IO.Path.GetDirectoryName(windowControl.dte.Solution.FullName);
            solutionDir = "\"" + solutionDir + "\"";

            if (arg != null)
            {
                IDictionary<string, object> input = (IDictionary<string, object>)arg;
                input.TryGetValue("branchName", out object branchName);
                string branch = (string)branchName;
                CodeControls.DeleteBranch(solutionDir, branchName);
            }
            return result;
        }

        public Dictionary<string, object> mergeBranches(object arg)
        {
            Dictionary<string, object> result = new Dictionary<string, object>();

            string solutionDir = System.IO.Path.GetDirectoryName(windowControl.dte.Solution.FullName);
            solutionDir = "\"" + solutionDir + "\"";

            if (arg != null)
            {
                IDictionary<string, object> input = (IDictionary<string, object>)arg;
                input.TryGetValue("branchOne", out object branchOne);
                input.TryGetValue("branchTwo", out object branchTwo);

                string branchOneStr = (string)branchOne;
                string branchTwoStr = (string)branchTwo;

                CodeControls.MergeBranches(solutionDir, branchOneStr, branchTwoStr);
            }
            return result;
        }

        public Dictionary<string, object> initializeCodeControl(object arg)
        {
            Dictionary<string, object> result = new Dictionary<string, object>();

            string solutionDir = System.IO.Path.GetDirectoryName(windowControl.dte.Solution.FullName);
            solutionDir = "\"" + solutionDir + "\"";

            if (arg != null)
            {
                IDictionary<string, object> input = (IDictionary<string, object>)arg;
                input.TryGetValue("id", out object id);
                input.TryGetValue("saturatedColor", out object saturatedColorObj);
                input.TryGetValue("unsaturatedColor", out object unsaturatedColorObj);

                string idStr = (string)id;
                string saturatedColorStr = (string)saturatedColorObj;
                string unsaturatedColorStr = (string)unsaturatedColorObj;

                System.Drawing.Color saturatedColor = System.Drawing.ColorTranslator.FromHtml(saturatedColorStr);
                System.Drawing.Color unsaturatedColor = System.Drawing.ColorTranslator.FromHtml(unsaturatedColorStr);

                MyWindowControl.printInBrowserConsole("idStr: " + idStr);
                MyWindowControl.printInBrowserConsole("saturatedColorStr: " + saturatedColorStr);
                MyWindowControl.printInBrowserConsole("unsaturatedColorStr: " + unsaturatedColorStr);

                CodeControlInfo codeControlInfo = new CodeControlInfo(idStr, Color.FromArgb(saturatedColor.A, saturatedColor.R, saturatedColor.G, saturatedColor.B), 
                    Color.FromArgb(unsaturatedColor.A, unsaturatedColor.R, unsaturatedColor.G, unsaturatedColor.B), null, null);

                MyWindowControl.CodeControlInfos.Add(idStr, codeControlInfo);
                MyWindowControl.CurrentCodeControl = codeControlInfo;
            }
            return result;
        }

        public Dictionary<string, object> updateCodeControlName(object arg)
        {
            Dictionary<string, object> result = new Dictionary<string, object>();

            if (arg != null)
            {
                IDictionary<string, object> input = (IDictionary<string, object>)arg;
                input.TryGetValue("id", out object id);
                input.TryGetValue("name", out object name);

                string idStr = (string)id;
                string nameStr = (string)name;

                MyWindowControl.printInBrowserConsole("Name of code control");
                MyWindowControl.printInBrowserConsole("idStr: " + nameStr);
                MyWindowControl.CodeControlInfos[idStr].Name = nameStr;

                //if (MyWindowControl.controlEditorAdornment != null)
                //{
                //    MyWindowControl.currentDispatcher.Invoke(new Action(() =>
                //    {
                //        CodeControlEditorAdornment.CreateEditorVisuals(null);
                //    }));
                //}
            }
            return result;
        }

        public Dictionary<string, object> updateSelectedCodeControl(object arg)
        {
            Dictionary<string, object> result = new Dictionary<string, object>();

            if (arg != null)
            {
                IDictionary<string, object> input = (IDictionary<string, object>)arg;
                input.TryGetValue("id", out object id);

                string idStr = (string)id;

                MyWindowControl.printInBrowserConsole("Updating code control");
                MyWindowControl.printInBrowserConsole("idStr: " + idStr);
                MyWindowControl.CurrentCodeControl = MyWindowControl.CodeControlInfos[idStr];

                if (MyWindowControl.controlEditorAdornment != null)
                {
                    MyWindowControl.currentDispatcher.Invoke(new Action(() =>
                    {
                        CodeControlEditorAdornment.CreateEditorVisuals(null);
                    }));
                }
            }
            return result;
        }

        public Dictionary<string, object> saveCanvasFile(object arg)
        {
            MyWindowControl.printInBrowserConsole("Saving canvas state");

            Dictionary<string, object> result = new Dictionary<string, object>();

            if (arg != null)
            {
                IDictionary<string, object> input = (IDictionary<string, object>)arg;
                input.TryGetValue("content", out object content);

                string contentStr = (string)content;

                SaveFileDialog saveFileDialog1 = new SaveFileDialog();
                saveFileDialog1.Filter = "Progvolver Persistent Canvas |*.plog";
                saveFileDialog1.Title = "Save progvolver canvas";
                theDispatcher.Invoke(new Action(() =>
                {
                    saveFileDialog1.ShowDialog();
                }));

                MyWindowControl.printInBrowserConsole("I am here");
                // If the file name is not an empty string open it for saving.
                if (saveFileDialog1.FileName != "")
                {
                    System.IO.FileStream fs =
                        (System.IO.FileStream)saveFileDialog1.OpenFile();

                    byte[] bytes = Encoding.UTF8.GetBytes(contentStr);
                    fs.Write(bytes, 0, bytes.Length);
                    fs.Close();
                }
            }

            return result;
        }

    }
}
