using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Text;
using Microsoft.CodeAnalysis.FindSymbols;
using Microsoft.Build.Construction;
using Microsoft.CodeAnalysis.MSBuild;
using Microsoft.Build.Evaluation;
using System.IO;
using System.Threading.Tasks;
using System.Globalization;
using System.Collections.Immutable;
using System.CodeDom.Compiler;
using System.Diagnostics;
using Microsoft.CodeAnalysis.Emit;
using System.Reflection;
using System.Text;
using GalaSoft.MvvmLight.Messaging;
using System.Windows;
using System.Windows.Controls;
using P_Inti;
using System.Windows.Threading;
using System.Windows.Media.Animation;
using CefSharp;
using Microsoft.VisualStudio.Settings;
using Microsoft.VisualStudio.Text.Tagging;
using System.Collections.Specialized;

namespace TestingCodeAnalysis
{
    public class CodeAnalyzer
    {

        //private static string outputFolder = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location) + "\\progvolver\\" + generateID();        

        private static MSBuildWorkspace workspace;


        private static Dictionary<string, List<Tuple<SyntaxNode, string, ReferenceLocation, ISymbol, Document>>> symbolsCoOcurrences;

        // lineChanger("new content for this line" , "sample.text" , 34);
        public static void changeLine(string newText, string fileName, int line_to_edit)
        {
            string[] arrLine = File.ReadAllLines(fileName);
            arrLine[line_to_edit - 1] = newText;
            File.WriteAllLines(fileName, arrLine);
        }

        public static bool isValidDocumentName(string documentName)
        {
            return !(documentName.IndexOf("AssemblyInfo", StringComparison.OrdinalIgnoreCase) >= 0 || documentName.IndexOf("AssemblyAttributes", StringComparison.OrdinalIgnoreCase) >= 0);
        }

        public static Solution assembleSearchableSolution(MyWindowControl windowControl)
        {
            string pathToSolution = windowControl.openedSolution.FullName;
            return assembleSearchableSolution(pathToSolution, out windowControl.addedProjects, out windowControl.addedDocuments);
        }

        public static Solution assembleSearchableSolution(string pathToSolution, out Dictionary<ProjectId, Microsoft.CodeAnalysis.Project> addedProjects, out Dictionary<ProjectId, Dictionary<string, Document>> addedDocuments)
        {

            addedProjects = new Dictionary<ProjectId, Microsoft.CodeAnalysis.Project>();
            addedDocuments = new Dictionary<ProjectId, Dictionary<string, Document>>();

            Solution solution = null;
            Dictionary<string, Dictionary<string, string>> sourcesPerProject = new Dictionary<string, Dictionary<string, string>>();

            using (workspace = MSBuildWorkspace.Create())
            {

                solution = workspace.OpenSolutionAsync(pathToSolution).Result;
                string[] sourceFiles = Array.Empty<string>();

                foreach (var currentProject in solution.Projects)
                {

                    string projectName = currentProject.Name;

                    if (currentProject.HasDocuments)
                    {
                        IEnumerable<TextDocument> documents = currentProject.Documents;
                        foreach (var document in documents)
                        {
                            if (!isValidDocumentName(document.FilePath))
                            {
                                sourceFiles.Append(document.FilePath);
                            }
                        }
                    }
                    else
                    {

                        MessageBox.Show("Acá entré");

                        FileInfo fInfo = new FileInfo(currentProject.FilePath);
                        String dirName = fInfo.Directory.FullName;
                        // Console.WriteLine("dirName: " + dirName);
                        //sourceFiles = Directory.GetFiles(dirName, "*.cs", SearchOption.TopDirectoryOnly);
                        sourceFiles = Directory.GetFiles(dirName, "*.cs").Where(file => !file.Contains("AssemblyInfo") && !file.Contains("AssemblyAttributes")).ToArray();


                    }

                    Dictionary<string, string> filesContents = new Dictionary<string, string>();
                    foreach (string sourceFile in sourceFiles)
                    {
                        string content = File.ReadAllText(sourceFile);
                        filesContents.Add(sourceFile, content);
                    }
                    sourcesPerProject.Add(projectName, filesContents);
                }

            }

            Console.WriteLine(sourcesPerProject.Count + " projects in the solution");

            // creating the new workspace and solution
            var ws = new AdhocWorkspace();
            //Create new solution
            var solId = SolutionId.CreateNewId();
            var solutionInfo = SolutionInfo.Create(solId, VersionStamp.Create());

            foreach (KeyValuePair<string, Dictionary<string, string>> pair in sourcesPerProject)
            {

                string projectName = pair.Key;
                Dictionary<string, string> sources = pair.Value;

                Console.WriteLine("PROJECT: " + projectName + " : " + sources.Count + " files");

                //Create new project



                Microsoft.CodeAnalysis.Project project = ws.AddProject(projectName, "C#");

                addedProjects.Add(project.Id, project);

                //Add project to workspace
                ws.TryApplyChanges(project.Solution);

                Dictionary<string, Document> projectDocuments = new Dictionary<string, Document>();

                foreach (KeyValuePair<string, string> sourceContent in sources)
                {

                    string fileName = sourceContent.Key;
                    string fileContent = sourceContent.Value;

                    //Console.WriteLine("\tFILE: " + fileName);
                    //Console.WriteLine("\tCONTENT: " + fileContent);

                    //Create new document
                    SourceText sourceText = SourceText.From(fileContent);


                    Document addedDocument = ws.AddDocument(project.Id, fileName, sourceText);


                    //Console.WriteLine("%%% BEFORE: " + project.Documents.Count());
                    project = addedDocument.Project;
                    //Console.WriteLine("%%% AFTER: " + project.Documents.Count());
                    solution = project.Solution;
                    ws.TryApplyChanges(solution);


                    projectDocuments.Add(addedDocument.FilePath, addedDocument);


                    //Console.WriteLine(project.Id + " " + addedDocument.Name);
                }
                addedDocuments.Add(project.Id, projectDocuments);
            }

            Console.WriteLine("ººººººººººººººººººººººººººº" + solution.Projects.First().Documents.Count());

            return solution;
        }

        public static ISymbol findSymbolInFile(string fileName, int position, Dictionary<string, Document> allDocuments)
        {
            allDocuments.TryGetValue(fileName, out Document theDocument);
            return SymbolFinder.FindSymbolAtPositionAsync(theDocument, position).Result;
        }


        public static void printLocation(ReferenceLocation location)
        {
            Console.WriteLine("********* LOCATION *********");
            Console.WriteLine(location.Location);
            Console.WriteLine("LineSpan: " + location.Location.GetLineSpan());
            Console.WriteLine("Path: " + location.Location.GetLineSpan().Path);
            Console.WriteLine("StartLinePosition: " + location.Location.GetLineSpan().StartLinePosition);
            Console.WriteLine("EndLinePosition: " + location.Location.GetLineSpan().EndLinePosition);
            Console.WriteLine("SourceSpan: " + location.Location.SourceSpan);
            Console.WriteLine("SourceSpan.Start: " + location.Location.SourceSpan.Start);
            Console.WriteLine("SourceSpan.End: " + location.Location.SourceSpan.End);
            Console.WriteLine(location.Document);
            Console.WriteLine(location.Document.Name);
            Console.WriteLine(location.Alias);
            Console.WriteLine(location.CandidateReason);
            Console.WriteLine(location.IsCandidateLocation);
            Console.WriteLine(location.IsImplicit);
            Console.WriteLine();
        }

        private static void writeFile(string fileName, string content)
        {
            using (FileStream fs = File.Create(fileName))
            {
                Byte[] contentInBytes = new UTF8Encoding(true).GetBytes(content);
                fs.Write(contentInBytes, 0, contentInBytes.Length);
                fs.Close();
            }
        }

        public static List<ReferencedSymbol> registerdReferencesTo(ISymbol symbol, string symbolID, Solution solution, Dictionary<string, string[]> docContents, Document document, MyWindowControl windowControl)
        {

            List<ReferencedSymbol> references = SymbolFinder.FindReferencesAsync(symbol, solution).Result.ToList();

            foreach (ReferencedSymbol reference in references)
            {

                List<ReferenceLocation> locations = reference.Locations.ToList();

                MyWindowControl.printInBrowserConsole(">>>>>>> " + reference + " in  " + locations.Count + " locations.");

                foreach (ReferenceLocation location in locations)
                {

                    Document document1 = location.Document;
                    SyntaxNode root = document1.GetSyntaxTreeAsync().Result.GetRoot();
                    SyntaxNode foundNode = root.FindNode(location.Location.SourceSpan);
                    if (foundNode != null)
                    {

                        SyntaxNode parent = foundNode.Parent;
                        SyntaxKind parentType = parent.Kind();
                        LinePosition line = location.Location.GetLineSpan().StartLinePosition;

                        MyWindowControl.printInBrowserConsole("parentType.ToString(): " + parentType.ToString());

                        docContents.TryGetValue(document.FilePath, out string[] docContent);

                        if (docContent != null)
                        {

                            // the symbol is just being referenced here

                            string key = document.FilePath + "_" + line.Line;

                            if (!symbolsCoOcurrences.ContainsKey(key))
                            {
                                symbolsCoOcurrences.Add(key, new List<Tuple<SyntaxNode, string, ReferenceLocation, ISymbol, Document>>());
                            }
                            symbolsCoOcurrences[key].Add(new Tuple<SyntaxNode, string, ReferenceLocation, ISymbol, Document>(foundNode, symbolID, location, symbol, document));

                        }
                        else
                        {
                            MyWindowControl.printInBrowserConsole("ERROR: Could not find document with name: " + document.FilePath);
                        }

                    }
                }
            }


            return references;
        }

        static String generateID()
        {
            Random rnd = new Random();
            return DateTime.Now.ToString("dd_MMMM_yyyy___HH_mm_ss_fff", CultureInfo.InvariantCulture) + "___" + Guid.NewGuid().ToString() + "___" + rnd.Next(0, 10000);
        }

        static List<string> getSourceFilesList(string directory)
        {
            List<string> files = new List<string>();
            string[] filePaths = Directory.GetFiles(directory);
            foreach (string filePath in filePaths)
            {
                if (filePath.EndsWith(".cs", true, CultureInfo.InvariantCulture))
                {
                    files.Add(filePath);
                }
            }
            return files;
        }

        static bool IsAccessorMethod(ISymbol symbol)
        {
            var accessorSymbol = symbol as IMethodSymbol;
            return accessorSymbol != null &&
                (accessorSymbol.MethodKind == MethodKind.PropertySet || accessorSymbol.MethodKind == MethodKind.PropertyGet ||
                    accessorSymbol.MethodKind == MethodKind.EventRemove || accessorSymbol.MethodKind == MethodKind.EventAdd);
        }

        static ISymbol GetEnclosingMethodOrPropertyOrField(SemanticModel semanticModel, ReferenceLocation reference)
        {

            var enclosingSymbol = semanticModel.GetEnclosingSymbol(reference.Location.SourceSpan.Start);

            for (var current = enclosingSymbol; current != null; current = current.ContainingSymbol)
            {
                if (current.Kind == SymbolKind.Field)
                {
                    return current;
                }

                if (current.Kind == SymbolKind.Property)
                {
                    return current;
                }

                if (current.Kind == SymbolKind.Method)
                {
                    var method = (IMethodSymbol)current;
                    if (IsAccessorMethod(method))
                    { //before, this was method.IsAccessor() but IsAccessor does not exist
                        return method.AssociatedSymbol;
                    }

                    if (method.MethodKind != MethodKind.AnonymousFunction)
                    {
                        return method;
                    }
                }
            }
            return null;
        }





        public static void getSourceDocuments(Solution solution, out Dictionary<string, Document> allDocuments, out Dictionary<string, string[]> allContents, out Dictionary<string, SemanticModel> semanticModels)
        {
            allDocuments = new Dictionary<string, Document>();
            allContents = new Dictionary<string, string[]>();
            semanticModels = new Dictionary<string, SemanticModel>();
            foreach (Microsoft.CodeAnalysis.Project project in solution.Projects)
            {
                foreach (Document document in project.Documents)
                {
                    if (isValidDocumentName(document.FilePath))
                    {
                        semanticModels.Add(document.FilePath, document.GetSemanticModelAsync().Result);
                        allDocuments.Add(document.FilePath, document);
                        allContents.Add(document.FilePath, File.ReadAllLines(document.FilePath));
                    }
                }
            }
        }

        public static string processAssignmentNode(MyWindowControl windowControl, SyntaxNode foundNode, ReferenceLocation location, string symbolID, ISymbol symbol, Document document)
        {


            MyWindowControl.printInBrowserConsole("public static string processAssignmentNode(MyWindowControl windowControl, SyntaxNode foundNode, ReferenceLocation location, string symbolID, ISymbol symbol, Document document) {");

            SyntaxNode parent = foundNode.Parent;
            SyntaxKind parentType = parent.Kind();
            LinePosition line = location.Location.GetLineSpan().StartLinePosition;

            Document document1 = location.Document;
            SyntaxNode root = document1.GetSyntaxTreeAsync().Result.GetRoot();
            ISymbol enclosingSymbol = document1.GetSemanticModelAsync().Result.GetEnclosingSymbol(location.Location.SourceSpan.Start);
            SyntaxNode enclosingNode = root.FindNode(enclosingSymbol.Locations.First().SourceSpan);
            int enclosingSymbolStart = enclosingNode.GetLocation().GetLineSpan().StartLinePosition.Line + 1;
            int enclosingSymbolEnd = enclosingNode.GetLocation().GetLineSpan().EndLinePosition.Line + 1;

            MyWindowControl.printInBrowserConsole("PROCESSING parentType.ToString(): " + parentType.ToString());

            StringBuilder assignmentStringBuilder = new StringBuilder();

            string parentExpression = parent.ToString().Replace("\"", "\\\"").Replace("{", "{{").Replace("}", "}}");

            /*Dictionary<string, object> scopeInfo = JsHandler.getScope(symbol, document, windowControl);
            scopeInfo.TryGetValue("declareAtFrom", out object declareAtFrom);
            scopeInfo.TryGetValue("declareAtTo", out object declareAtTo);
            scopeInfo.TryGetValue("scopeFrom", out object scopeFrom);
            scopeInfo.TryGetValue("scopeTo", out object scopeTo);
            scopeInfo.TryGetValue("declarator", out object declarator);*/

            string filePath = document.FilePath.Replace(@"\", "/");
            string expressionsToLog;
            string logString = " Logger.logAssignment(\"{0}~{1}~{2}~{{0}}~{3}~{4}~{5}\", {6});";

            // only here when we are logging arrays or matrices
            if (parentType == SyntaxKind.ElementAccessExpression)
            {

                // here when we have arrays or matrices
                // we need to extract the indices that are being updated

                string assignment = parent.ToString().Replace("\"", "\\\"");
                int from = assignment.IndexOf("[") + 1;
                int to = assignment.LastIndexOf("]");

                String indices = assignment.Substring(from, to - from);
                MyWindowControl.printInBrowserConsole("indices: " + indices);

                List<object> values = new List<object>();
                values.Add(parent.ToString().Replace("\"", "\\\""));
                string[] split = indices.Split(',');
                foreach (string s in split)
                {
                    values.Add(s);
                }
                string result = string.Join(",", values);

                MyWindowControl.printInBrowserConsole("result: " + result);

                Boolean is1D = split.Length == 1;
                Boolean is2D = split.Length == 2;

                expressionsToLog = foundNode + "," + result;

                assignmentStringBuilder.AppendFormat(logString, foundNode, parentExpression, parentType, line.Line + 1, filePath, symbolID, expressionsToLog);


                //if (is2D) {
                //    //assignmentStringBuilder.AppendFormat(" Logger.logAssignment(\"{0}~{{0}}~{1}~{2}~{3}~{4}~{5}~{6}~{7}~{8}~{9}~{10}~{11}~{12}\", {13});", foundNode, parentExpression, line.Line + 1, filePath, symbolID, declareAtFrom, declareAtTo, declarator, scopeFrom, scopeTo, enclosingSymbol.Name, enclosingSymbolStart, enclosingSymbolEnd, result);
                //    assignmentStringBuilder.AppendFormat(" Logger.logAssignment(\"{0}~{{0}}~{1}~{2}~{3}~{4}~{5}~{6}~{7}\", {8});", foundNode, parentExpression, line.Line + 1, filePath, symbolID, enclosingSymbol.Name, enclosingSymbolStart, enclosingSymbolEnd, result);
                //} else if (is1D) {
                //    //assignmentStringBuilder.AppendFormat(" Logger.logAssignment(\"{0}~{{0}}~{1}~{2}~{3}~{4}~{5}~{6}~{7}~{8}~{9}~{10}~{11}~{12}\", {13});", foundNode, parentExpression, line.Line + 1, filePath, symbolID, declareAtFrom, declareAtTo, declarator, scopeFrom, scopeTo, enclosingSymbol.Name, enclosingSymbolStart, enclosingSymbolEnd, result);
                //    assignmentStringBuilder.AppendFormat(" Logger.logAssignment(\"{0}~{{0}}~{1}~{2}~{3}~{4}~{5}~{6}~{7}\", {8});", foundNode, parentExpression, line.Line + 1, filePath, symbolID, enclosingSymbol.Name, enclosingSymbolStart, enclosingSymbolEnd, result);
                //}

                //MyWindowControl.printInBrowserConsole("ARRAY");
                //MyWindowControl.printInBrowserConsole(assignmentStringBuilder.ToString());

            }
            else
            {

                //assignmentStringBuilder.AppendFormat(" Logger.logAssignment(\"{0}~{{0}}~{1}~{2}~{3}~{4}~{5}~{6}~{7}\", {0});", foundNode, parentExpression, line.Line + 1, filePath, symbolID, enclosingSymbol.Name, enclosingSymbolStart, enclosingSymbolEnd);

                //MyWindowControl.printInBrowserConsole("VARIABLE");
                //MyWindowControl.printInBrowserConsole(assignmentStringBuilder.ToString());




                expressionsToLog = foundNode.ToString();

                assignmentStringBuilder.AppendFormat(logString, foundNode, parentExpression, parentType, line.Line + 1, filePath, symbolID, expressionsToLog);



            }

            return assignmentStringBuilder.ToString();

        }

        public static Dictionary<string, Tuple<List<ISymbol>, List<SyntaxNode>>> getSymbolsPerExpressions(Dictionary<string, Tuple<SyntaxNode, string>> expressions, Dictionary<string, Document> allDocuments)
        {
            Dictionary<string, Tuple<List<ISymbol>, List<SyntaxNode>>> symbolsPerExpressions = new Dictionary<string, Tuple<List<ISymbol>, List<SyntaxNode>>>();
            foreach (KeyValuePair<string, Tuple<SyntaxNode, string>> kvp in expressions)
            {
                MyWindowControl.printInBrowserConsole("kvp value " + kvp.Value);
                string expressionID = kvp.Key;
                Tuple<SyntaxNode, string> expressionTuple = kvp.Value;
                SyntaxNode expressionNode = expressionTuple.Item1;
                string fileName = expressionTuple.Item2;
                allDocuments.TryGetValue(fileName, out Document document);
                List<ISymbol> expressionSymbols = JsHandler.getSymbolsFromExpression(expressionNode, document, out List<SyntaxNode> nodes);
                symbolsPerExpressions.Add(expressionID, Tuple.Create(expressionSymbols, nodes));
            }
            return symbolsPerExpressions;
        }









        public static string getContainingExpressionID(Dictionary<ISymbol, ReferenceLocation> symbols, Dictionary<string, Tuple<List<ISymbol>, List<SyntaxNode>>> symbolsPerExpressions, MyWindowControl windowControl, out SyntaxNode expression)

        {

            Dictionary<ISymbol, ReferenceLocation>.KeyCollection theKyes = symbols.Keys;
            List<ISymbol> theSymbols = theKyes.ToList();
            theSymbols.Sort(delegate (ISymbol x, ISymbol y)
            {
                return x.Name.CompareTo(y.Name);
            });

            MyWindowControl.printInBrowserConsole("$$$$$$$$$$$$$$ AFTER SORTING $$$$$$$$$$$$$$");
            MyWindowControl.printInBrowserConsole("$$$$$$$$$$$$$$ symbols: " + string.Join(", ", (object[])theSymbols.ToArray()));

            foreach (KeyValuePair<string, Tuple<List<ISymbol>, List<SyntaxNode>>> kvp in symbolsPerExpressions)
            {

                var key = kvp.Key;
                var value = kvp.Value;
                var expressionSymbols = value.Item1;

                if (theSymbols.Count() == expressionSymbols.Count())
                {
                    MyWindowControl.printInBrowserConsole("ttttttttt ttttt");

                    expressionSymbols.Sort(delegate (ISymbol x, ISymbol y)
                    {
                        return x.Name.CompareTo(y.Name);
                    });
                    MyWindowControl.printInBrowserConsole("$$$$$$$$$$$$$$ AFTER SORTING $$$$$$$$$$$$$$");
                    MyWindowControl.printInBrowserConsole("$$$$$$$$$$$$$$ expressionSymbols: " + string.Join(", ", (object[])expressionSymbols.ToArray()));

                    windowControl.trackedExpressions.TryGetValue(key, out Tuple<SyntaxNode, string> containingTuple);
                    SyntaxNode currentExpression = containingTuple.Item1;

                    // are both collections of symbols the same? (i.e., do their names and locations coincide?)

                    Location location2 = currentExpression.GetLocation();

                    int totalSymbols = theSymbols.Count();
                    int totalCoincidences = 0;

                    for (int i = 0; i < totalSymbols; i++)
                    {
                        ISymbol symbol1 = theSymbols.ElementAt(i);
                        ReferenceLocation location1 = symbols[symbol1];
                        ISymbol symbol2 = expressionSymbols.ElementAt(i);
                        if (symbol1.Name == symbol2.Name && symbol1.Kind == symbol2.Kind && location1.Location.GetLineSpan().StartLinePosition.Line == location2.GetLineSpan().StartLinePosition.Line)
                        {
                            MyWindowControl.printInBrowserConsole("mmmmmmmmmmmmm");

                            totalCoincidences++;
                        }
                        else
                        {
                            MyWindowControl.printInBrowserConsole("bbbbbbbbbbbbbb");

                            MyWindowControl.printInBrowserConsole($"The symbols {symbol1} did not coincide {symbol2} at locations {location1} and {location2}");
                        }
                    }
                    if (totalCoincidences == totalSymbols)
                    {
                        MyWindowControl.printInBrowserConsole("qqqqqqqqqqqqqqqqq");

                        expression = currentExpression;
                        return key;
                    }
                    else
                    {
                        MyWindowControl.printInBrowserConsole("zzzzzzzzzzzzzzzzzzzz");

                        MyWindowControl.printInBrowserConsole($"Only {totalCoincidences} were found.");
                    }
                }
                else
                {
                    MyWindowControl.printInBrowserConsole("pppppppppppppppppp");

                    MyWindowControl.printInBrowserConsole("PROBLEM: The compared collections have different sizes");
                }




















                //foreach (ISymbol expressionSymbol in expressionSymbols) {



                //    if (containingTuple != null) {



                //        // we need to know wether ALL THE SYMBOLS are at the same line of this expression
                //        bool rightLocation = true;
                //        for (int i = 0; i<symbols.Count(); i++) {
                //            ISymbol s = symbols.ElementAt(i);
                //            ReferenceLocation location = locations.ElementAt(i);
                //            rightLocation = rightLocation && location.Location.GetLineSpan().StartLinePosition.Line == currentExpression.GetLocation().GetLineSpan().StartLinePosition.Line;
                //        }

                //        MyWindowControl.printInBrowserConsole("$$$$$$$$$$$$$$ rightLocation: " + rightLocation);

                //        if (rightLocation) {

                //            // we now need to check that all the symbols of the expression are present in the list of symbols that we are evaluating




                //            int countSymbols = 0;
                //            foreach (ISymbol s in symbols) {
                //                if (expressionSymbol.Name == s.Name && expressionSymbol.Kind == s.Kind) {
                //                    countSymbols++;
                //                }
                //            }

                //            if (rightLocation && countSymbols == symbols.Count()) {
                //                expression = currentExpression;
                //                return key;
                //            }

                //        }                        
                //    }
                //}




            }







            expression = null;
            return null;
        }







        public static string getContainingExpressionID(ISymbol symbol, ReferenceLocation location, Dictionary<string, Tuple<List<ISymbol>, List<SyntaxNode>>> symbolsPerExpressions, MyWindowControl windowControl, out SyntaxNode expression)
        {
            foreach (KeyValuePair<string, Tuple<List<ISymbol>, List<SyntaxNode>>> kvp in symbolsPerExpressions)
            {
                var key = kvp.Key;
                var value = kvp.Value;
                var symbols = value.Item1;

                foreach (ISymbol s in symbols)
                {
                    windowControl.trackedExpressions.TryGetValue(key, out Tuple<SyntaxNode, string> containingTuple);
                    if (containingTuple != null)
                    {
                        expression = containingTuple.Item1;
                        bool rightLocation = location.Location.GetLineSpan().StartLinePosition.Line == expression.GetLocation().GetLineSpan().StartLinePosition.Line;
                        if (rightLocation && s.Name == symbol.Name && s.Kind == symbol.Kind)
                        {
                            return key;
                        }
                    }
                }
            }
            expression = null;
            return null;
        }



        public static string getSymbolScopeString(string widgetID, ISymbol symbol, Dictionary<string, object> scopeInfo)
        {
            return $"{symbol}~{scopeInfo["initialValue"]}~{widgetID}~{scopeInfo["declareAtFrom"]}~{scopeInfo["declareAtTo"]}~{scopeInfo["scopeFrom"]}~{scopeInfo["scopeTo"]}~{scopeInfo["declarator"]}~{scopeInfo["filePath"]}";
        }

        public static string processTrackedProgramElements(List<int> positions, List<string> fileNames, List<string> trackedSymbolsIDs, List<string> trackedExpressionsIDs, Solution solution, string outputFolder, out Dictionary<string, ISymbol> symbols, out string[] logFileContent, out string[] useFileContent, out Dictionary<string, string[]> allContents, string logFileName, Boolean runMode, MyWindowControl windowControl, out bool success)
        {
            //IEnumerable<ISymbol> objectMemberList = SymbolFinder.FindSourceDeclarationsAsync(solution, "ManyFieldsClass", true).Result;

            //foreach(var x in objectMemberList)
            //{
            //    MyWindowControl.printInBrowserConsole("&&&&&&&&&&&&&&&&&&&&&&&&&&&& ObjectMemberList " + x.ToString());
            //    MyWindowControl.printInBrowserConsole("&&&&&&&&&&&&&&&&&&&&&&&&&&&& ObjectMemberList First " + x.Locations.First().ToString());
            //}

            Dictionary<string, Document> allDocuments = new Dictionary<string, Document>();
            allContents = new Dictionary<string, string[]>();
            List<SyntaxTree> syntaxTrees = new List<SyntaxTree>();
            symbols = new Dictionary<string, ISymbol>();

            // getting all the docuements that need to be processed
            foreach (Microsoft.CodeAnalysis.Project project in solution.Projects)
            {
                foreach (Document document in project.Documents)
                {
                    if (isValidDocumentName(document.FilePath))
                    {
                        allDocuments.Add(document.FilePath, document);
                        allContents.Add(document.FilePath, File.ReadAllLines(document.FilePath));
                    }
                }
            }

            List<string> scopeFileLines = new List<string>();

            int i = 0;
            foreach (string fileName in fileNames)
            {
                Document theDocument = null;
                allDocuments.TryGetValue(fileName, out theDocument);
                if (theDocument != null)
                {
                    int position = positions[i];
                    string symbolID = trackedSymbolsIDs[i];
                    ISymbol symbolFound = SymbolFinder.FindSymbolAtPositionAsync(theDocument, position).Result;
                    if (symbolFound != null)
                    {
                        symbols.Add(symbolID, symbolFound);
                        registerdReferencesTo(symbolFound, symbolID, solution, allContents, theDocument, windowControl);

                        // scope of symbols dragged onto the canvas
                        Dictionary<string, object> scopeInfo = JsHandler.getScope(symbolFound, theDocument, windowControl);
                        scopeFileLines.Add(getSymbolScopeString(symbolID, symbolFound, scopeInfo));
                    }
                }
                i++;
            }

            MyWindowControl.printInBrowserConsole(" &*&*&*&*&* windowControl.trackedExpressions " + windowControl.trackedExpressions.Count());

            Dictionary<string, Tuple<List<ISymbol>, List<SyntaxNode>>> symbolsPerExpressions = getSymbolsPerExpressions(windowControl.trackedExpressions, allDocuments);

            MyWindowControl.printInBrowserConsole("symbolsPerExpressions: " + symbolsPerExpressions);

            // scope of the symbols that compose the EXPRESSIONS dragged onto the canvas
            foreach (string expressionId in windowControl.trackedExpressionsIDs)
            {

                Tuple<SyntaxNode, string> expressionTuple = windowControl.trackedExpressions[expressionId];
                SyntaxNode theExpression = expressionTuple.Item1;
                string theFile = expressionTuple.Item2;
                Document theDocument = allDocuments[theFile];
                Tuple<List<ISymbol>, List<SyntaxNode>> tuple = symbolsPerExpressions[expressionId];
                List<ISymbol> theExpressionSymbols = tuple.Item1;
                foreach (ISymbol theExpressionSymbol in theExpressionSymbols)
                {
                    Dictionary<string, object> scopeInfo = JsHandler.getScope(theExpressionSymbol, theDocument, windowControl);
                    scopeFileLines.Add(getSymbolScopeString("", theExpressionSymbol, scopeInfo));
                }
            }



            // logging references to symbols
            foreach (KeyValuePair<string, List<Tuple<SyntaxNode, string, ReferenceLocation, ISymbol, Document>>> entry in symbolsCoOcurrences)
            {



                SyntaxNode closestControlAncestor = null;

                string entryKey = entry.Key;
                MyWindowControl.printInBrowserConsole("key: " + entryKey);

                var split = entryKey.Split('_');

                string filePath = split[0];
                int line = Int32.Parse(split[1]);
                string fileName = filePath.Replace(@"\", "/");

                MyWindowControl.printInBrowserConsole("filePath: " + filePath);
                MyWindowControl.printInBrowserConsole("fileName: " + fileName);

                allContents.TryGetValue(filePath, out string[] docContent);

                List<Tuple<SyntaxNode, string, ReferenceLocation, ISymbol, Document>> tuples = entry.Value;

                Tuple<SyntaxNode, string, ReferenceLocation, ISymbol, Document> onlyTuple = tuples.First();
                SyntaxNode onlyNode = onlyTuple.Item1;
                SyntaxNode onlyParent = onlyNode.Parent;
                SyntaxKind onlyParentType = onlyParent.Kind();

                MyWindowControl.printInBrowserConsole("\n\nOnlyParentType: " + onlyParentType.ToString());
                MyWindowControl.printInBrowserConsole("Line number: " + line);
                if (tuples.Count == 1 && (onlyParentType == SyntaxKind.SimpleAssignmentExpression ||
                            onlyParentType == SyntaxKind.PreDecrementExpression ||
                            onlyParentType == SyntaxKind.PostDecrementExpression ||
                            onlyParentType == SyntaxKind.PreIncrementExpression ||
                            onlyParentType == SyntaxKind.PostIncrementExpression ||
                            onlyParentType == SyntaxKind.ElementAccessExpression))
                {
                    MyWindowControl.printInBrowserConsole("Single tuple case: ");
                    string widgetID = onlyTuple.Item2;
                    ReferenceLocation location = onlyTuple.Item3;
                    ISymbol symbol = onlyTuple.Item4;
                    Document document = onlyTuple.Item5;
                    string parentExpression = symbol.ToString().Replace("\"", "\\\"").Replace("{", "{{").Replace("}", "}}");
                    string type = onlyNode.Kind().ToString();
                    string useString = processAssignmentNode(windowControl, onlyNode, location, widgetID, symbol, document);
                    docContent[line] = string.Concat(docContent[line], useString);

                }
                else
                {


                    MyWindowControl.printInBrowserConsole("co-occurence tuple case: ");

                    // we are here in a co-ocurrence case (i.e., one or variables are being referred together)

                    string symbolsString = "";
                    string values = "";
                    string parentStatements = "";
                    string widgetsIDs = "";
                    string types = "";

                    Dictionary<ISymbol, ReferenceLocation> allSymbols = new Dictionary<ISymbol, ReferenceLocation>();
                    Dictionary<ISymbol, Document> symbolDocument = new Dictionary<ISymbol, Document>();
                    string symbolsStringWithScope = "";
                    string symbolsStringWithScopeAfter = "";
                    Dictionary<ISymbol, Dictionary<string, object>> symbolsWithScope = new Dictionary<ISymbol, Dictionary<string, object>>();
                    List<LineNumberProcessAssignmentNode> lineProcessingNodeString = new List<LineNumberProcessAssignmentNode>();

                    foreach (Tuple<SyntaxNode, string, ReferenceLocation, ISymbol, Document> tuple in tuples)
                    {


                        SyntaxNode node = tuple.Item1;
                        string symbolID = tuple.Item2;
                        ReferenceLocation location = tuple.Item3;
                        ISymbol symbol = tuple.Item4;
                        Document document = tuple.Item5;
                        SyntaxNode parent = node.Parent;
                        SyntaxKind parentType = parent.Kind();
                        // TODO CHECK IF IT DEPENDS ON TYPE
                        string parentStatement = parent.ToString().Replace("\"", "\\\"").Replace("{", "{{").Replace("}", "}}");

                        if (!allSymbols.ContainsKey(symbol))
                        {

                            allSymbols.Add(symbol, location);
                            symbolDocument.Add(symbol, document);
                            symbolsWithScope.Add(symbol, JsHandler.getScope(symbol, document, windowControl));

                            string symbolName = symbol.ToString();

                            // TODO WHY DO THIS?
                            // ONLY DO IT WHEN PARTICULAR TYPE OF EXPRESSION?? ELEMENTACCESS
                            if (parentStatement.StartsWith("["))
                            {
                                MyWindowControl.printInBrowserConsole("ASASAS Parent statement is: ");
                                MyWindowControl.printInBrowserConsole(parentStatement);

                                int startIndex = parentStatement.IndexOf('[');
                                int endIndex = parentStatement.IndexOf(']');

                                parentStatement = parentStatement.Substring(startIndex + 1, endIndex - 1);
                                MyWindowControl.printInBrowserConsole(parentStatement);
                            }

                            if (parentStatement.StartsWith("="))
                            {
                                parentStatement = parentStatement.Replace('=', ' ');
                                parentStatement = parentStatement.Trim();
                            }

                            if (symbolName.StartsWith("["))
                            {
                                symbolName = symbolName.Substring(1, symbolName.Length - 1);
                            }
                            else
                            {
                                MyWindowControl.printInBrowserConsole("Size of symbols is: " + symbolsPerExpressions.Count);

                                foreach (string key in symbolsPerExpressions.Keys)
                                {
                                    MyWindowControl.printInBrowserConsole("Key is: " + key);
                                }
                                symbolsPerExpressions.Remove(symbolID);

                                string useString = processAssignmentNode(windowControl, onlyNode, location, symbolID, symbol, document);

                                // saving it to a dictionary, which will be accessed and the strings appended to the docContent once the bracesOffset is obtained.
                                
                                lineProcessingNodeString.Add(new LineNumberProcessAssignmentNode(line, useString));
                                //docContent[line] = string.Concat(docContent[line], useString);
                            }

                            MyWindowControl.printInBrowserConsole("Node: ");
                            //JsHandler.printNodeHeirarchy(node);
                            MyWindowControl.printInBrowserConsole("Node parent: ");
                            //JsHandler.printNodeHeirarchy(parent);

                            MyWindowControl.printInBrowserConsole("\tnode: " + node.ToString());
                            MyWindowControl.printInBrowserConsole("\tnodeID: " + symbolID);

                            symbolsString += symbolName + ",";
                            values += symbolName + ",";
                            parentStatements += parentStatement + ",";
                            widgetsIDs += symbolID + ",";
                            //types += node.Kind() + ",";
                            types += parent.Kind() + ",";
                        }


                    }

                    symbolsString = symbolsString.TrimEnd(',');
                    values = values.TrimEnd(',');
                    parentStatements = parentStatements.TrimEnd(',');
                    widgetsIDs = widgetsIDs.TrimEnd(',');
                    types = types.TrimEnd(',');

                    MyWindowControl.printInBrowserConsole("\t theNodes: " + symbolsString);
                    MyWindowControl.printInBrowserConsole("\t theValues: " + values);
                    MyWindowControl.printInBrowserConsole("\t parentStatements: " + parentStatements);
                    MyWindowControl.printInBrowserConsole("\t widgetsIDs: " + widgetsIDs);
                    MyWindowControl.printInBrowserConsole("\t types: " + types);

                    string containingExpressionID = getContainingExpressionID(allSymbols, symbolsPerExpressions, windowControl, out SyntaxNode containingExpression);
                    IEnumerable<SyntaxNode> controlAncestors = null;

                    if (containingExpression != null)
                    {
                        MyWindowControl.printInBrowserConsole("\t eeeeeeeeeee else types: " + types);


                        symbolsString += "," + containingExpression.ToString();
                        values += "," + containingExpression;
                        parentStatements += "," + containingExpression;
                        widgetsIDs += "," + containingExpressionID;
                        types += "," + containingExpression.Kind();

                        windowControl.processedExpressions.Add(containingExpressionID, windowControl.trackedExpressions[containingExpressionID]);

                        MyWindowControl.printInBrowserConsole($"The symbols {symbolsString} are contained by the expression {containingExpression} at line {line + 1}!!!");

                        controlAncestors = containingExpression.Ancestors().Where(ancestor => ancestor is WhileStatementSyntax || ancestor is ForStatementSyntax || ancestor is IfStatementSyntax || ancestor is ElseClauseSyntax);

                    }
                    else
                    {
                        MyWindowControl.printInBrowserConsole("\t ffffffffff else types: " + types);

                        MyWindowControl.printInBrowserConsole($"No expression was found for the symbols {symbolsString} at the location {line + 1}!!!");
                        SyntaxNode firstNode = tuples.FirstOrDefault().Item1;
                        controlAncestors = firstNode.Ancestors().Where(ancestor => ancestor is WhileStatementSyntax || ancestor is ForStatementSyntax || ancestor is IfStatementSyntax || ancestor is ElseClauseSyntax);

                    }

                    if (controlAncestors != null && controlAncestors.Count() > 0)
                    {
                        MyWindowControl.printInBrowserConsole("\t 00000000000 else types: " + types);

                        closestControlAncestor = controlAncestors.First();
                        MyWindowControl.printInBrowserConsole("closestControlAncestor.ToString(): " + closestControlAncestor.ToString());
                    }

                    MyWindowControl.printInBrowserConsole("parentExpressions: ");
                    MyWindowControl.printInBrowserConsole(parentStatements);

                    string logReferenceString = " Logger.logReferences(\"{5}\", \"{0}~{1}~{6}~{{0}}~{2}~{3}~{4}\", {1});";

                    if (closestControlAncestor != null)
                    {
                        int endOfWhile = closestControlAncestor.GetLocation().GetLineSpan().EndLinePosition.Line;

                        MyWindowControl.printInBrowserConsole("AAAA symbolsString " + symbolsString);

                        var key = "RAND ancestor at " + fileName + " line " + (line + 1) + "_" + symbolsString + "_" + widgetsIDs + Utils.generateID();
                        MyWindowControl.printInBrowserConsole("`````` Key was: " + key);


                        MyWindowControl.printInBrowserConsole("||||||closestControlAncestor.ToString(): " + closestControlAncestor.ToString());
                        MyWindowControl.printInBrowserConsole("||||||closestControlAncestor.GetLocation() " + closestControlAncestor.GetLocation().ToString());
                        MyWindowControl.printInBrowserConsole("||||||closestControlAncestor.GetLocation().GetLineSpan() " + closestControlAncestor.GetLocation().GetLineSpan().ToString()); ;
                        MyWindowControl.printInBrowserConsole("||||||closestControlAncestor.GetLocation().GetLineSpan().StartLinePosition.Line " + closestControlAncestor.GetLocation().GetLineSpan().StartLinePosition.Line.ToString()); ;

                        //braces not on same line fix
                        string closestControlAncestorStr = closestControlAncestor.ToString();
                        int bracesOffset = GetLineNumber(closestControlAncestorStr, "{") - 1;

                        // Add the earlier info from processAssignmentNode
                        foreach (LineNumberProcessAssignmentNode lineNumberProcessAssignment in lineProcessingNodeString)
                        {
                            int lineNumber = lineNumberProcessAssignment.LineNumber;
                            string value = lineNumberProcessAssignment.ProcessAssignmentNodeString;

                            int linePosition = lineNumber + bracesOffset;
                            if (linePosition == endOfWhile)
                            {
                                docContent[lineNumber + bracesOffset] = string.Concat(value, docContent[lineNumber + bracesOffset]);
                            }
                            else
                            {
                                docContent[lineNumber + bracesOffset] = string.Concat(docContent[lineNumber + bracesOffset], value);
                            }
                        }

                        MyWindowControl.printInBrowserConsole("||||||Braces offset: " + bracesOffset);

                        int ancestorLine = closestControlAncestor.GetLocation().GetLineSpan().StartLinePosition.Line + bracesOffset;
                        //line += bracesOffset;
                        if (ancestorLine == line)
                        {

                            MyWindowControl.printInBrowserConsole("\t 12121212 else types: " + types);

                            MyWindowControl.printInBrowserConsole("closestControlAncestor.ToString(): " + closestControlAncestor.ToString());

                            String beforeString = "";
                            MyWindowControl.printInBrowserConsole("`````` onlyParentType " + onlyParentType);


                            bool areSymbolsInScopeBefore = true;
                            bool areSymbolsInScopeAfter = true;

                            foreach(ISymbol symbol in symbolsWithScope.Keys)
                            {
                                Dictionary<string, object> scopeDict = symbolsWithScope[symbol];
                                int declaredLineFrom = (int)scopeDict["declareAtFrom"];
                                int declaredLineTo = (int)scopeDict["declareAtTo"];

                                MyWindowControl.printInBrowserConsole("`````` symbol here is: " + symbol.Name);
                                MyWindowControl.printInBrowserConsole("`````` declaredLine here is: " + declaredLineFrom);
                                MyWindowControl.printInBrowserConsole("`````` declaredLineTo here is: " + declaredLineTo);
                                MyWindowControl.printInBrowserConsole("`````` Line here is: " + line);

                                if (declaredLineFrom < (line + 1))
                                {
                                    symbolsStringWithScope += symbol.Name + ",";
                                } 
                                else
                                {
                                    areSymbolsInScopeBefore = false;
                                }

                                if (declaredLineTo >= endOfWhile)
                                {
                                    symbolsStringWithScopeAfter += symbol.Name + ",";
                                }
                                else
                                {
                                    areSymbolsInScopeAfter = false;
                                }
                            }

                            if (!areSymbolsInScopeBefore)
                            {
                                symbolsStringWithScope = "";
                            }

                            if (!areSymbolsInScopeAfter)
                            {
                                symbolsStringWithScopeAfter = "";
                            }

                            if (symbolsStringWithScope != "")
                            {
                                symbolsStringWithScope = symbolsStringWithScope.TrimEnd(',');
                            }

                            if (containingExpression != null)
                            {
                                symbolsStringWithScope += "," + containingExpression.ToString();
                            }

                            if (symbolsStringWithScopeAfter != "")
                            {
                                symbolsStringWithScopeAfter = symbolsStringWithScopeAfter.TrimEnd(',');
                            }

                            if (containingExpression != null)
                            {
                                symbolsStringWithScopeAfter += "," + containingExpression.ToString();
                            }


                            //key = "RAND ancestor at " + fileName + " line " + (line + 1) + "_" + symbolsStringWithScope + "_" + widgetsIDs + Utils.generateID();
                            MyWindowControl.printInBrowserConsole("`````` Key is now!!!: " + key);
                            MyWindowControl.printInBrowserConsole("`````` Types !!!: " + types);


                            if (symbolsStringWithScope != "")
                            {
                                StringBuilder beforeControlSB = new StringBuilder();
                                //beforeControlSB.AppendFormat(logReferenceString, symbolsString, parentStatements, line + 1, fileName, widgetsIDs, key, types);
                                beforeControlSB.AppendFormat(logReferenceString, symbolsStringWithScope, symbolsStringWithScope, line + 1, fileName, widgetsIDs, key, types);
                                MyWindowControl.printInBrowserConsole("`````` logReferenceString !!!: " + logReferenceString);
                                MyWindowControl.printInBrowserConsole("`````` symbolsStringWithScope !!!: " + symbolsStringWithScope);
                                MyWindowControl.printInBrowserConsole("`````` line + 1 !!!: " + (line + 1));
                                MyWindowControl.printInBrowserConsole("`````` fileName !!!: " + fileName);
                                MyWindowControl.printInBrowserConsole("`````` widgetsIDs !!!: " + widgetsIDs);

                                beforeString = beforeControlSB.ToString();
                                MyWindowControl.printInBrowserConsole("***** beforeString " + beforeString);
                            }

                            StringBuilder insideControlSB = new StringBuilder();

                            if (onlyParentType == SyntaxKind.ElementAccessExpression)
                            {
                                MyWindowControl.printInBrowserConsole("\t ssssssssss else types: " + types);

                                insideControlSB.AppendFormat(" if ( Logger.getExecutionCount(\"{5}\") != 1 ) {{ " + logReferenceString + " }} else {{ Logger.increaseExecutionCount(\"{5}\"); }}", symbolsString, symbolsString, line + 1, fileName, widgetsIDs, key, types);

                            }
                            else
                            {
                                MyWindowControl.printInBrowserConsole("\t gggggggggg else types: " + types);

                                insideControlSB.AppendFormat(" if ( Logger.getExecutionCount(\"{5}\") != 1 ) {{ " + logReferenceString + " }} else {{ Logger.increaseExecutionCount(\"{5}\"); }}", symbolsString, symbolsString, line + 1, fileName, widgetsIDs, key, types);

                            }
                            //insideControlSB.AppendFormat(" if ( Logger.getExecutionCount(\"{5}\") != 1 ) {{ " + logReferenceString + " }} else {{ Logger.increaseExecutionCount(\"{5}\"); }}", symbolsString, parentStatements, line + 1, fileName, widgetsIDs, key, types);
                            //insideControlSB.AppendFormat(" if ( Logger.getExecutionCount(\"{5}\") != 1 ) {{ " + logReferenceString + " }} else {{ Logger.increaseExecutionCount(\"{5}\"); }}", symbolsString, symbolsString, line + 1, fileName, widgetsIDs, key, types);

                            MyWindowControl.printInBrowserConsole("***** insideControlSB " + insideControlSB.ToString());

                            String afterString = insideControlSB.ToString();

                            string tmp = string.Concat(beforeString, docContent[line + bracesOffset]);
                            MyWindowControl.printInBrowserConsole("***** tmp " + tmp);
                            docContent[line + bracesOffset] = string.Concat(tmp, afterString);


                            // at the end of the loop, we need to log the final value of the expression 
                            // This has to be done ONLY IF the program actually entered into the while loop

                            if (symbolsStringWithScopeAfter != "")
                            {
                                StringBuilder afterControlSB = new StringBuilder();
                                //afterControlSB.AppendFormat(" if ( Logger.getExecutionCount(\"{5}\") > 1 ) {{ " + logReferenceString + " }}", symbolsString, parentStatements, line + 1, fileName, widgetsIDs, key, types);
                                afterControlSB.AppendFormat(" if ( Logger.getExecutionCount(\"{5}\") > 1 ) {{ " + logReferenceString + " }}", symbolsStringWithScopeAfter, symbolsStringWithScopeAfter, line + 1, fileName, widgetsIDs, key, types);
                                MyWindowControl.printInBrowserConsole("***** afterControlSB " + afterControlSB);
                                docContent[endOfWhile] = docContent[endOfWhile] + afterControlSB.ToString();
                            }

                        }
                        else
                        {
                            MyWindowControl.printInBrowserConsole("\t 555555555555 else types: " + types);
                            MyWindowControl.printInBrowserConsole("`````` else onlyParentType " + onlyParentType);
                            MyWindowControl.printInBrowserConsole("||||||Braces offset: " + bracesOffset); ;

                            // the while loop found is not on the same line as the symbols
                            StringBuilder useStringBuilder = new StringBuilder();
                            if (onlyParentType == SyntaxKind.ElementAccessExpression)
                            {
                                MyWindowControl.printInBrowserConsole("\t ccccccccccc else types: " + types);

                                useStringBuilder.AppendFormat(logReferenceString, symbolsString, symbolsString, line + 1 + bracesOffset, fileName, widgetsIDs, null, types);
                            }
                            else
                            {
                                MyWindowControl.printInBrowserConsole("\t vvvvvvvvv else types: " + types);

                                useStringBuilder.AppendFormat(logReferenceString, symbolsString, parentStatements, line + 1 + bracesOffset, fileName, widgetsIDs, null, types);

                            }

                            if (bracesOffset > 0)
                            {
                                bracesOffset += 1;
                            }

                            docContent[line + bracesOffset] = string.Concat(useStringBuilder.ToString(), docContent[line + bracesOffset]);
                        }
                    }
                    else
                    {
                        // the symbols are not contained by a while loop
                        StringBuilder useStringBuilder = new StringBuilder();

                        MyWindowControl.printInBrowserConsole("\t 888888888888888888888888888888 types: " + types);

                        if (onlyParentType == SyntaxKind.ElementAccessExpression)
                        {
                            MyWindowControl.printInBrowserConsole("\t 66666666666 if types: " + types);

                            useStringBuilder.AppendFormat(logReferenceString, symbolsString, symbolsString, line + 1, fileName, widgetsIDs, null, types);
                        }
                        else
                        {
                            MyWindowControl.printInBrowserConsole("\t 7777777777 else types: " + types);

                            useStringBuilder.AppendFormat(logReferenceString, symbolsString, parentStatements, line + 1, fileName, widgetsIDs, null, types);
                        }

                        docContent[line] = string.Concat(docContent[line], useStringBuilder.ToString());
                    }







                }

            }


            processPendingExpressions(allContents, windowControl, symbolsPerExpressions);

            saveScopeFile(scopeFileLines, logFileName, outputFolder);


            // we need to modify the program files further to be able to log the signals
            foreach (string key in MyWindowControl.signalsPositions.Keys)
            {
                Tuple<string, int> tuple = MyWindowControl.signalsPositions[key];
                string file = tuple.Item1;
                int pos = tuple.Item2;

                allContents[file][pos] += $" Logger.logSignal(@\"{file}~{pos}~{key}\");";
            }



            return compileModifiedFiles(outputFolder, out logFileContent, out useFileContent, allContents, logFileName, runMode, windowControl, out success, syntaxTrees);

        }

        // In a multi line string text, get the line number of another string lineToFind.
        private static int GetLineNumber(string text, string lineToFind, StringComparison comparison = StringComparison.CurrentCulture)
        {
            int lineNum = 0;
            using (StringReader reader = new StringReader(text))
            {
                string line;
                while ((line = reader.ReadLine()) != null)
                {
                    lineNum++;
                    if (line.Contains(lineToFind))
                        return lineNum;
                }
            }
            return -1;
        }

        private static void saveScopeFile(List<string> scopeFileLines, string fileName, string outputFolder)
        {
            string scopeFileContent = "index~symbol~initialValue~widgetID~declareAtFrom~declareAtTo~scopeFrom~scopeTo~declarator~filePath\n";
            int totalLines = scopeFileLines.Count();
            for (int i = 0; i < totalLines; i++)
            {
                scopeFileContent += i + "~" + scopeFileLines[i] + "\n";
            }
            if (!Directory.Exists(outputFolder))
            {
                Directory.CreateDirectory(outputFolder);
            }
            writeFile(outputFolder + "\\" + fileName + ".scope", scopeFileContent);
        }

        public static void processPendingExpressions(Dictionary<string, string[]> allContents, MyWindowControl windowControl, Dictionary<string, Tuple<List<ISymbol>, List<SyntaxNode>>> symbolsPerExpressions)
        {

            Dictionary<string, Tuple<SyntaxNode, string>> allTrackedExpressions = windowControl.trackedExpressions;
            Dictionary<string, Tuple<SyntaxNode, string>> processedExpressions = windowControl.processedExpressions;

            foreach (KeyValuePair<string, Tuple<SyntaxNode, string>> kvp in allTrackedExpressions)
            {
                string key = kvp.Key;
                if (!processedExpressions.ContainsKey(key))
                {
                    MyWindowControl.printInBrowserConsole("You still need to process the expression: " + allTrackedExpressions[key].Item1 + " " + allTrackedExpressions[key].Item2);
                    logExpression(key, allTrackedExpressions[key].Item1, allTrackedExpressions[key].Item2, allContents, windowControl, symbolsPerExpressions[key]);
                }
            }

        }

        public static void logExpression(string widgetID, SyntaxNode expression, string fileName, Dictionary<string, string[]> allContents, MyWindowControl windowControl, Tuple<List<ISymbol>, List<SyntaxNode>> tuple)
        {

            MyWindowControl.printInBrowserConsole("SyntaxNode expression: ");
            MyWindowControl.printInBrowserConsole(expression.ToString());

            allContents.TryGetValue(fileName, out string[] docContent);
            if (docContent != null)
            {

                IEnumerable<SyntaxNode> controlAncestors = expression.Ancestors().Where(ancestor => ancestor is WhileStatementSyntax || ancestor is ForStatementSyntax || ancestor is IfStatementSyntax || ancestor is ElseClauseSyntax);
                SyntaxNode closestControlAncestor = null;

                var sss = string.Join(",", (object[])controlAncestors.ToArray());

                MyWindowControl.printInBrowserConsole("All ancestors:");
                MyWindowControl.printInBrowserConsole(sss);

                int line = expression.GetLocation().GetLineSpan().StartLinePosition.Line;

                string symbolsString = "";
                string parentStatements = "";
                string values = "";
                string widgetIDs = "";
                string types = "";

                List<ISymbol> symbols = tuple.Item1;
                List<SyntaxNode> nodes = tuple.Item2;

                int totalSymbols = symbols.Count();

                for (int i = 0; i < totalSymbols; i++)
                {
                    ISymbol symbol = symbols.ElementAt(i);
                    SyntaxNode node = nodes.ElementAt(i);
                    SyntaxNode parent = node.Parent;
                    string parentStatement = parent.ToString().Replace("\"", "\\\"").Replace("{", "{{").Replace("}", "}}");

                    symbolsString += symbol + ",";
                    values += symbol + ",";
                    parentStatements += parentStatement + ",";
                    widgetIDs += windowControl.trackedSymbols.FirstOrDefault(s => s.Value.Name == symbol.Name && s.Value.Kind == symbol.Kind && s.Value.Locations.FirstOrDefault().SourceSpan.Start == symbol.Locations.FirstOrDefault().SourceSpan.Start && s.Value.Locations.FirstOrDefault().SourceSpan.End == symbol.Locations.FirstOrDefault().SourceSpan.End).Key + ",";
                    types += parent.Kind() + ",";
                }

                symbolsString += expression.ToString();
                values += expression;
                parentStatements += expression;
                widgetIDs += widgetID;
                types += expression.Kind();

                string cleanFileName = fileName.Replace(@"\", "/");
                string key = "Expression at " + cleanFileName + "_" + line + "_" + expression + "_" + Utils.generateID();
                string logReferenceString = " Logger.logReferences(\"{5}\", \"{0}~{1}~{6}~{{0}}~{2}~{3}~{4}\", {1});";

                MyWindowControl.printInBrowserConsole("$^%%% expression " + expression.Kind());
                if (controlAncestors.Count() > 0)
                {

                    closestControlAncestor = controlAncestors.First();
                    MyWindowControl.printInBrowserConsole("closestAncestor.ToString(): " + closestControlAncestor.ToString());

                    // key += closestAncestor.ToString();

                    MyWindowControl.printInBrowserConsole("$^% expression " + expression.Kind());
                    String beforeString = "";
                    if (expression.Kind() != SyntaxKind.DeclarationExpression)
                    {
                        StringBuilder beforeWhileSB = new StringBuilder();
                        //beforeWhileSB.AppendFormat(logReferenceString, symbolsString, parentStatements, line + 1, cleanFileName, widgetIDs, key, types);
                        beforeWhileSB.AppendFormat(logReferenceString, symbolsString, symbolsString, line + 1, cleanFileName, widgetIDs, key, types);
                        beforeString = beforeWhileSB.ToString();
                    }

                    StringBuilder insideWhileSB = new StringBuilder();
                    insideWhileSB.AppendFormat(" if ( Logger.getExecutionCount(\"{5}\") != 1 ) {{ " + logReferenceString + " }} else {{ Logger.increaseExecutionCount(\"{5}\"); }}", symbolsString, parentStatements, line + 1, cleanFileName, widgetIDs, key, types);
                    String afterString = insideWhileSB.ToString();

                    string tmp = string.Concat(beforeString, docContent[line]);
                    docContent[line] = string.Concat(tmp, afterString);

                    int endOfWhile = closestControlAncestor.GetLocation().GetLineSpan().EndLinePosition.Line;

                    // at the end of the loop, we need to log the final value of the expression 
                    // This has to be done ONLY IF the program actually entered into the while loop

                    StringBuilder afterWhileSB = new StringBuilder();
                    //afterWhileSB.AppendFormat(" if ( Logger.getExecutionCount(\"{5}\") > 1 ) {{ " + logReferenceString + " }}", symbolsString, parentStatements, line + 1, cleanFileName, widgetIDs, key, types);
                    afterWhileSB.AppendFormat(" if ( Logger.getExecutionCount(\"{5}\") > 1 ) {{ " + logReferenceString + " }}", symbolsString, symbolsString, line + 1, cleanFileName, widgetIDs, key, types);
                    docContent[endOfWhile] = docContent[endOfWhile] + afterWhileSB.ToString();


                }
                else
                {

                    StringBuilder sb = new StringBuilder();
                    //sb.AppendFormat(logReferenceString, symbolsString, parentStatements, line + 1, cleanFileName, widgetIDs, key, types);
                    sb.AppendFormat(logReferenceString, symbolsString, symbolsString, line + 1, cleanFileName, widgetIDs, key, types);
                    docContent[line] = docContent[line] + sb.ToString();

                    MyWindowControl.printInBrowserConsole("fileName: " + fileName);
                    MyWindowControl.printInBrowserConsole("cleanFileName: " + cleanFileName);

                }

            }
            else
            {
                MyWindowControl.printInBrowserConsole("ERROR: I could not find the document for the path: " + fileName);
            }
        }


        public static string compileModifiedFiles(string outputFolder, out string[] logFileContent, out string[] scopeFileContent, Dictionary<string, string[]> allContents, string logFileName, bool runMode, MyWindowControl windowControl, out bool success, List<SyntaxTree> syntaxTrees)
        {

            string stringResult = "";
            string[] signalFileContent;

            if (runMode)
            {

                foreach (KeyValuePair<string, string[]> kvp in allContents)
                {
                    String allText = string.Join("\n", kvp.Value);
                    string dirName = new DirectoryInfo(Path.GetDirectoryName(kvp.Key)).Name;
                    string outputFile = dirName + "_" + Path.GetFileName(kvp.Key);
                    if (!Directory.Exists(outputFolder))
                    {
                        Directory.CreateDirectory(outputFolder);
                    }
                    writeFile(outputFolder + "\\" + outputFile, allText);
                    syntaxTrees.Add(CSharpSyntaxTree.ParseText(allText));
                }


                string loggerFilePath = null;

                // MyWindowControl.printInBrowserConsole("loggerFilePath: " + loggerFilePath);

                var refs = new List<MetadataReference>();

                //MyWindowControl.printInBrowserConsole("typeof(Console).Assembly.Location): " + typeof(Console).Assembly.Location);


                refs.Add(MetadataReference.CreateFromFile(typeof(object).Assembly.Location));
                refs.Add(MetadataReference.CreateFromFile(typeof(Console).Assembly.Location));
                refs.Add(MetadataReference.CreateFromFile(typeof(System.Runtime.AssemblyTargetedPatchBandAttribute).Assembly.Location));
                refs.Add(MetadataReference.CreateFromFile(typeof(Microsoft.CSharp.RuntimeBinder.RuntimeBinderException).Assembly.Location));
                refs.Add(MetadataReference.CreateFromFile(typeof(Microsoft.CSharp.RuntimeBinder.RuntimeBinderInternalCompilerException).Assembly.Location));

                if (Assembly.GetEntryAssembly() != null)
                {
                    Assembly.GetEntryAssembly().GetReferencedAssemblies().ToList().ForEach(
                    a => refs.Add(MetadataReference.CreateFromFile(Assembly.Load(a).Location)));
                }


                foreach (var referencedAssembly in Assembly.GetCallingAssembly().GetReferencedAssemblies())
                {
                    var loadedAssembly = Assembly.Load(referencedAssembly);

                    string currentFileLocation = loadedAssembly.Location.ToString();

                    //MyWindowControl.printInBrowserConsole(currentFileLocation);

                    if (currentFileLocation.Contains("/extensions/") || currentFileLocation.Contains("\\extensions\\"))
                    {
                        loggerFilePath = Path.GetDirectoryName(currentFileLocation) + "/Resources/Logger.cs";
                    }

                    refs.Add(MetadataReference.CreateFromFile(loadedAssembly.Location));
                }





                var dd = typeof(Enumerable).GetTypeInfo().Assembly.Location;
                var coreDir = Directory.GetParent(dd);

                var dotNetCoreDir = Path.GetDirectoryName(typeof(object).GetTypeInfo().Assembly.Location);

                refs.Add(MetadataReference.CreateFromFile(Path.Combine(dotNetCoreDir, "System.Runtime.dll")));

                refs.Add(MetadataReference.CreateFromFile(typeof(Object).GetTypeInfo().Assembly.Location));
                refs.Add(MetadataReference.CreateFromFile(typeof(Uri).GetTypeInfo().Assembly.Location));

                refs.Add(MetadataReference.CreateFromFile(coreDir.FullName + Path.DirectorySeparatorChar + "System.Core.dll"));

                refs.Add(MetadataReference.CreateFromFile(@"C:\Windows\Microsoft.NET\Framework\v4.0.30319\mscorlib.dll"));
                refs.Add(MetadataReference.CreateFromFile(@"C:\Windows\Microsoft.NET\Framework\v4.0.30319\System.Runtime.dll"));
                refs.Add(MetadataReference.CreateFromFile(@"C:\Windows\Microsoft.NET\Framework\v4.0.30319\System.Core.dll"));






                MyWindowControl.printInBrowserConsole("***** loggerFilePath: " + loggerFilePath);
                //if (loggerFilePath != null) {
                //    syntaxTrees.Add(CSharpSyntaxTree.ParseText(File.ReadAllText(loggerFilePath)));
                //}

                // TMP
                //syntaxTrees.Add(CSharpSyntaxTree.ParseText(File.ReadAllText(@"C:\Users\Admin\Documents\GitHub\P_Inti\P-Inti\Resources\Logger.cs")));
                syntaxTrees.Add(CSharpSyntaxTree.ParseText(File.ReadAllText(@"C:\Dev\P-Inti\P-Inti\Resources\Logger.cs")));


                refs.Add(MetadataReference.CreateFromFile(typeof(object).GetTypeInfo().Assembly.Location));
                refs.Add(MetadataReference.CreateFromFile(typeof(Console).GetTypeInfo().Assembly.Location));
                refs.Add(MetadataReference.CreateFromFile(typeof(String).GetTypeInfo().Assembly.Location));
                refs.Add(MetadataReference.CreateFromFile(typeof(string).GetTypeInfo().Assembly.Location));
                refs.Add(MetadataReference.CreateFromFile(Path.Combine(dotNetCoreDir, "System.Runtime.dll")));


                var assemblyPath = Path.GetDirectoryName(typeof(object).Assembly.Location);
                var usings = syntaxTrees.Select(tree => tree.GetRoot().DescendantNodes().OfType<UsingDirectiveSyntax>()).SelectMany(s => s).ToArray();

                //for each using directive add a metadatareference to it
                foreach (var u in usings)
                {
                    string tmpFile = Path.Combine(assemblyPath, u.Name.ToString() + ".dll");
                    if (File.Exists(tmpFile))
                    {
                        //MyWindowControl.printInBrowserConsole("$$$ \t" + tmpFile);
                        refs.Add(MetadataReference.CreateFromFile(tmpFile));
                    }
                }



                var compilation = CSharpCompilation.Create(Path.GetFileName(Path.GetRandomFileName()))
                  .WithOptions(new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary))
                  .AddReferences(refs.ToArray())
                  .AddSyntaxTrees(syntaxTrees.ToArray());


                using (var ms = new MemoryStream())
                {

                    EmitResult result = compilation.Emit(ms);

                    success = result.Success;

                    if (!result.Success)
                    {
                        MyWindowControl.printInBrowserConsole("***** outputLogging: " + outputFolder + "\\" + logFileName);
                        logFileContent = new string[] { "" };
                        scopeFileContent = new string[] { "" };
                        signalFileContent = new string[] { "" };
                        stringResult = "The   following <b>problems</b> arose when trying to compile the program:<br/><br/>";
                        int count = 1;

                        IEnumerable<Diagnostic> failures = result.Diagnostics;
                        foreach (Diagnostic diagnostic in failures)
                        {
                            stringResult += "<b>" + (count++) + ")</b> " + diagnostic.GetMessage().ToString() + " (" + diagnostic.DefaultSeverity.ToString() + " " + diagnostic.Id + "): " + diagnostic.Location.SourceTree.FilePath + " " + " Line #: " + (diagnostic.Location.GetLineSpan().StartLinePosition.Line + 1) + ". Char #:" + diagnostic.Location.ToString() + "<br/>";
                        }

                    }
                    else
                    {

                        ms.Seek(0, SeekOrigin.Begin);

                        Assembly assembly = Assembly.Load(ms.ToArray());

                        Type typeLogger = assembly.GetType("ConsoleApp1.Logger");
                        object objLogger = Activator.CreateInstance(typeLogger);

                        typeLogger.InvokeMember("init", BindingFlags.NonPublic | BindingFlags.Static | BindingFlags.InvokeMethod,
                            null, null, new object[] { outputFolder + "\\" + logFileName });


                        Type typeMain = assembly.GetType("ConsoleApp1.Program");
                        object objMain = Activator.CreateInstance(typeMain);
                        //Assembly assemblyMain = Assembly.LoadFrom(Assembly.GetEntryAssembly().Location);
                        typeMain.InvokeMember("Main", BindingFlags.NonPublic | BindingFlags.Static | BindingFlags.InvokeMethod,
                            null, null, new object[] { new string[] { } });

                        typeLogger.InvokeMember("end", BindingFlags.NonPublic | BindingFlags.Static | BindingFlags.InvokeMethod,
                            null, null, new object[] { });

                        logFileContent = File.ReadAllLines(outputFolder + "\\" + logFileName + ".log");
                        scopeFileContent = File.ReadAllLines(outputFolder + "\\" + logFileName + ".scope");
                        signalFileContent = File.ReadAllLines(outputFolder + "\\" + logFileName + ".signal");

                        stringResult = "Program compiled and executed <b>successfuly</b>!";

                    }
                }

            }
            else
            {

                //logFileContent = File.ReadAllLines(outputFolder + "/" + logFileName);



                logFileContent = new string[] { "" };
                scopeFileContent = new string[] { "" };
                signalFileContent = new string[] { "" };
                success = true;
                stringResult = "Debugging finished!";

            }

            // MyWindowControl.printInBrowserConsole("stringResult: " + stringResult);

            return stringResult;

        }




        public static void debugCode(MyWindowControl windowControl)
        {

            Dictionary<string, object> result = new Dictionary<string, object>();
            if (windowControl.projectOpen())
            {

                // creating the output dir
                string solutionPath = windowControl.dte.Solution.FullName;
                string solutionDir = System.IO.Path.GetDirectoryName(solutionPath);
                string progvolverDir = solutionDir + "/progvolver";
                if (!Directory.Exists(progvolverDir))
                {
                    Directory.CreateDirectory(progvolverDir);
                }
                var outputDir = progvolverDir + "/" + Utils.generateID() + "_DEBUG";
                Directory.CreateDirectory(outputDir);

                // setting up the trace listener object
                string logFileName = "debug.log";
                string traceFileLocation = outputDir + "/" + logFileName;

                windowControl.traceListener = new TextWriterTraceListener(traceFileLocation);
                windowControl.traceListener.TraceOutputOptions = TraceOptions.LogicalOperationStack | TraceOptions.DateTime | TraceOptions.Timestamp | TraceOptions.ProcessId | TraceOptions.ThreadId;
                Trace.Listeners.Add(windowControl.traceListener);
                Trace.AutoFlush = true;

                List<string> fileNames = windowControl.fileNames;
                List<int> positions = windowControl.positions;
                List<string> trackedSymbolsIDs = windowControl.trackedSymbolsIDs;
                List<string> trackedExpressionsIDs = windowControl.trackedExpressionsIDs;
                string[] logFileContent;
                string[] useFileContent;
                bool success;

                windowControl.assembledSolution = CodeAnalyzer.assembleSearchableSolution(windowControl);

                //List<ISymbol> symbols;
                Dictionary<string, ISymbol> symbols;
                Dictionary<string, string[]> allContents;
                processTrackedProgramElements(positions, fileNames, trackedSymbolsIDs, trackedExpressionsIDs, windowControl.assembledSolution, outputDir, out symbols, out logFileContent, out useFileContent, out allContents, logFileName, false, windowControl, out success);




                Object[] showArgs = { };
                JavascriptResponse response = windowControl.theBrowser.EvaluateScriptAsync("getTrackedSymbolsIDs", showArgs).Result;
                string resultFromWebClient = (string)response.Result;




                foreach (KeyValuePair<string, ISymbol> kvp in symbols)
                {

                    var symbolID = kvp.Key;
                    var symbol = kvp.Value;

                    List<ReferencedSymbol> references = SymbolFinder.FindReferencesAsync(symbol, windowControl.assembledSolution).Result.ToList();

                    foreach (ReferencedSymbol reference in references)
                    {

                        List<ReferenceLocation> locations = reference.Locations.ToList();

                        foreach (ReferenceLocation location in locations)
                        {

                            Document document = location.Document;
                            SyntaxNode root = document.GetSyntaxTreeAsync().Result.GetRoot();
                            SyntaxNode foundNode = root.FindNode(location.Location.SourceSpan);

                            if (foundNode != null)
                            {

                                SyntaxNode parent = foundNode.Parent;
                                SyntaxKind parentType = foundNode.Parent.Kind();
                                LinePosition line = location.Location.GetLineSpan().StartLinePosition;


                                ISymbol enclosingSymbol = document.GetSemanticModelAsync().Result.GetEnclosingSymbol(location.Location.SourceSpan.Start);
                                SyntaxNode enclosingNode = root.FindNode(enclosingSymbol.Locations.First().SourceSpan);
                                int enclosingSymbolStart = enclosingNode.GetLocation().GetLineSpan().StartLinePosition.Line + 1;
                                int enclosingSymbolEnd = enclosingNode.GetLocation().GetLineSpan().EndLinePosition.Line + 1;


                                MyWindowControl.printInBrowserConsole(parentType.ToString());


                                if (parentType == SyntaxKind.SimpleAssignmentExpression ||
                                    parentType == SyntaxKind.PreDecrementExpression ||
                                    parentType == SyntaxKind.PostIncrementExpression)
                                {
                                    //string[] docContent = null;

                                    string filePath = Path.GetFileName(document.FilePath);
                                    int docPos = line.Line;

                                    EnvDTE.Breakpoints breakpoints = windowControl.debugger.Breakpoints;

                                    breakpoints.Add("", filePath, docPos + 1, 1, "",
                             EnvDTE.dbgBreakpointConditionType.dbgBreakpointConditionTypeWhenTrue,
                             "C#", "", 0, "", 0, EnvDTE.dbgHitCountType.dbgHitCountTypeNone);



                                    // getting symbol's scope
                                    Dictionary<string, object> scopeInfo = JsHandler.getScope(symbol, document, windowControl);
                                    scopeInfo.TryGetValue("declareAtFrom", out object declareAtFrom);
                                    scopeInfo.TryGetValue("declareAtTo", out object declareAtTo);
                                    scopeInfo.TryGetValue("scopeFrom", out object scopeFrom);
                                    scopeInfo.TryGetValue("scopeTo", out object scopeTo);
                                    scopeInfo.TryGetValue("declarator", out object declarator);

                                    // symbolID, declareAtFrom, declareAtTo, declarator, scopeFrom, scopeTo, enclosingSymbol.Name, enclosingSymbolStart, enclosingSymbolEnd

                                    EnvDTE80.Breakpoint2 lastBP = breakpoints.Item(breakpoints.Count) as EnvDTE80.Breakpoint2;
                                    lastBP.Message = MyWindowControl.debugLineInit + symbol.ToString() + "~{" + symbol.ToString() + "}~" + parent.ToString() + "~$CALLSTACK~$FILEPOS~" + symbolID + "~" + declareAtFrom + "~" + declareAtTo + "~" + declarator + "~" + scopeFrom + "~" + scopeTo + "~" + enclosingSymbol.Name + "~" + enclosingSymbolStart + "~" + enclosingSymbolEnd + "~$TICK" + MyWindowControl.debugLineEnd + "\n";
                                    lastBP.BreakWhenHit = false;

                                    windowControl.addedBreakPoints.Add(lastBP);

                                    /*foreach (EnvDTE80.Breakpoint2 bp in breakpoints) {
                                        bp.Message = "{" +  + "}, $FUNCTION, $ADDRESS, $CALLER, $CALLSTACK, $FILEPOS, $PID, $PNAME, $TICK, $TID, $TNAME";
                                        bp.BreakWhenHit = false;
                                    }*/
                                }
                            }
                        }
                    }
                }
            }
        }

        public static void setEvaluatedLine(int lineNumber, string[] expressions, TextMarkerTag[] markers)
        {
            Taggers.currentEvaluatedLine = lineNumber;
            HighlightWordTagger.currentEvaluatedLine = lineNumber;
            HighlightWordTagger.expressionsToHighlight = expressions;
            HighlightWordTagger.markers = markers;
            Taggers.updateTags();
            HighlightWordTagger.updateTags();
        }

        public static string analyzeCode(Solution solution, string outputFolder, List<string> fileNames, List<int> positions, List<string> trackedSymbolsIDs, List<string> trackedExpressionsIDs, out string[] logFileContent, out string[] useFileContent, MyWindowControl windowControl, out bool success)
        {
            Dictionary<string, ISymbol> symbols;
            Dictionary<string, string[]> allContents;
            symbolsCoOcurrences = new Dictionary<string, List<Tuple<SyntaxNode, string, ReferenceLocation, ISymbol, Document>>>();
            return processTrackedProgramElements(positions, fileNames, trackedSymbolsIDs, trackedExpressionsIDs, solution, outputFolder, out symbols, out logFileContent, out useFileContent, out allContents, "run", true, windowControl, out success);
        }

        public static string analyzeCode(string pathToSolution, string outputFolder, List<string> fileNames, List<int> positions, List<string> trackedSymbolsIDs, List<string> trackedExpressionsIDs, out string[] logFileContent, out string[] useFileContent, MyWindowControl windowControl, out bool success)
        {
            Dictionary<ProjectId, Microsoft.CodeAnalysis.Project> addedProjects = null;
            Dictionary<ProjectId, Dictionary<string, Document>> addedDocuments = null;
            Solution solution = assembleSearchableSolution(pathToSolution, out addedProjects, out addedDocuments);
            Dictionary<string, ISymbol> symbols;
            Dictionary<string, string[]> allContents;
            return processTrackedProgramElements(positions, fileNames, trackedSymbolsIDs, trackedExpressionsIDs, solution, outputFolder, out symbols, out logFileContent, out useFileContent, out allContents, "run", true, windowControl, out success);
        }

        public static Dictionary<string, CSharpSyntaxNode> getAssignmentsDescendants(SyntaxNode root)
        {

            Dictionary<string, CSharpSyntaxNode> dictionary = new Dictionary<string, CSharpSyntaxNode>();

            var members = root.DescendantNodes().OfType<AssignmentExpressionSyntax>();

            foreach (var member in members)
            {

                dictionary.Add(member.ToString(), member);

            }

            return dictionary;

        }

        public static Dictionary<string, CSharpSyntaxNode> getDescendantsByType(SyntaxNode root, string type)
        {

            Dictionary<string, CSharpSyntaxNode> dictionary = new Dictionary<string, CSharpSyntaxNode>();

            var members = root.DescendantNodes();

            foreach (var member in members)
            {
                MyWindowControl.printInBrowserConsole("%%%%%%%%% Member: " + member.ToString());
                getDescendantsByType(member, "property");

                if (member is MethodDeclarationSyntax method && type.Equals("method"))
                {
                    dictionary.Add(method.Identifier.ToString(), method);

                }
                else if (member is PropertyDeclarationSyntax property && type.Equals("property"))
                {

                    dictionary.Add(property.Identifier.ToString(), property);

                }
            }

            return dictionary;

        }

        public static SyntaxNode getNodeByLineNumber(string programText, SyntaxNode root, int lineNumber)
        {
            var text = SourceText.From(programText);
            var lineSpan = text.Lines[lineNumber].Span;
            return root.FindNode(lineSpan);
        }


        public static SemanticModel getSemanticModel(SyntaxTree tree)
        {
            var compilation = CSharpCompilation.Create("HelloWorld").AddReferences(MetadataReference.CreateFromFile(typeof(object).Assembly.Location)).AddSyntaxTrees(tree);
            return compilation.GetSemanticModel(tree);
        }

        public static bool compileExecutable(String sourceName, string[] sources)
        {

            FileInfo sourceFile = new FileInfo(sourceName);
            CodeDomProvider provider = provider = CodeDomProvider.CreateProvider("CSharp");
            bool compileOk = false;

            if (provider != null)
            {


                String exeName = String.Format(@"{0}\{1}.exe", System.Environment.CurrentDirectory, sourceFile.Name.Replace(".", "_"));


                Console.WriteLine("exeName: " + exeName);

                CompilerParameters cp = new CompilerParameters();

                // Generate an executable instead of 
                // a class library.
                cp.GenerateExecutable = true;

                // Specify the assembly file name to generate.
                cp.OutputAssembly = exeName;

                // Save the assembly as a physical file.
                cp.GenerateInMemory = false;

                // Set whether to treat all warnings as errors.
                cp.TreatWarningsAsErrors = false;

                // Invoke compilation of the source file.
                CompilerResults cr = provider.CompileAssemblyFromFile(cp, sources);



                if (cr.Errors.Count > 0)
                {
                    // Display compilation errors.
                    Console.WriteLine("Errors building {0} into {1}",
                        sourceName, cr.PathToAssembly);
                    foreach (CompilerError ce in cr.Errors)
                    {
                        Console.WriteLine("  {0}", ce.ToString());
                        Console.WriteLine();
                    }
                }
                else
                {
                    // Display a successful compilation message.
                    Console.WriteLine("Source {0} built into {1} successfully.",
                        sourceName, cr.PathToAssembly);
                }

                // Return the results of the compilation.
                if (cr.Errors.Count > 0)
                {
                    compileOk = false;
                }
                else
                {
                    compileOk = true;
                }
            }
            return compileOk;
        }




    }

}
