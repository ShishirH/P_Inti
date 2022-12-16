namespace P_Inti
{
    using System.Diagnostics.CodeAnalysis;
    using System;
    using System.Windows;
    using System.Diagnostics;
    using System.Windows.Controls;
    using EnvDTE;
    using Microsoft.VisualStudio;
    using Microsoft.VisualStudio.Shell.Interop;
    using Microsoft.VisualStudio.Shell;
    using Microsoft.VisualStudio.Debugger.Interop.Internal;
    using Microsoft.VisualStudio.Debugger.Interop;
    using System.Text;
    using Debugger = EnvDTE.Debugger;
    using System.Collections;
    using System.Windows.Shapes;
    using System.Windows.Media;
    using System.Reflection;
    using EnvDTE80;
    using System.IO;
    using System.Collections.Generic;
    using System.Linq;
    using System.Windows.Input;
    using System.Xml;
    using System.Windows.Markup;
    using CefSharp;
    using CefSharp.Wpf;
    using Microsoft.VisualStudio.Text.Editor;
    using Microsoft.VisualStudio.Text.Formatting;
    using Microsoft.VisualStudio.Text;
    using System.Dynamic;
    using System.Windows.Threading;
    using Microsoft.CodeAnalysis;
    using TestingCodeAnalysis;
    using Solution = Microsoft.CodeAnalysis.Solution;
    using Microsoft.Build.Tasks;
    using System.Diagnostics.Eventing;
    using Microsoft.VisualStudio.TextManager.Interop;
    using Microsoft.VisualStudio.Editor;
    using Microsoft.CodeAnalysis.CSharp.Syntax;

    /// <summary>
    /// Interaction logic for MyWindowControl.
    /// </summary>
    public partial class MyWindowControl : UserControl, IVsSolutionEvents
    {

        public readonly static string debugLineInit = "##########~";
        public readonly static string debugLineEnd = "~**********";

        public readonly DTE dte = null;
        public static  DTE dteNew = null;
        private Events events;
        public readonly Debugger debugger = null;
        public readonly DebuggerEvents debuggerEvents = null;

        public readonly SolutionEvents solutionEvents = null;

        public Dictionary<string, string> expressions = new Dictionary<string, string>();

        public long initSeconds;
        public long endSeconds;
        public long maxTimestamp;
        public static MyWindowControl theWindowControl = null;

        public JsHandler jsHandler = null;
        public static Dispatcher currentDispatcher = System.Windows.Threading.Dispatcher.CurrentDispatcher;

        public Dictionary<string, CodeAdornment> codeAdornments = new Dictionary<string, CodeAdornment>();
        public List<int> positions = new List<int>();
        public List<string> fileNames = new List<string>();

        public List<string> trackedSymbolsIDs = new List<string>();
        public List<string> trackedExpressionsIDs = new List<string>();
        public static List<string> trackedSignalIDs = new List<string>();


        public Dictionary<string, ISymbol> trackedSymbols = new Dictionary<string, ISymbol>();

        // the tuple that describes an expression is composed be: the expression's ID (string), the expression itself (SyntaxNode), fileName (string)
        public Dictionary<string, Tuple<SyntaxNode, string>> trackedExpressions = new Dictionary<string, Tuple<SyntaxNode, string>>();

        public Dictionary<string, Tuple<SyntaxNode, string>> processedExpressions = new Dictionary<string, Tuple<SyntaxNode, string>>();

        public static Dictionary<string, Tuple<string, int>> signalsPositions = new Dictionary<string, Tuple<string, int>>();

        public EnvDTE.Solution openedSolution;
        public Solution assembledSolution;
        public Dictionary<ProjectId, Microsoft.CodeAnalysis.Project> addedProjects = null;
        public Dictionary<ProjectId, Dictionary<string, Microsoft.CodeAnalysis.Document>> addedDocuments = null;

        public TextWriterTraceListener traceListener { get; set; }

        public static long initTime = -1;

        public List<EnvDTE80.Breakpoint2> addedBreakPoints = new List<EnvDTE80.Breakpoint2>();

        public static ChromiumWebBrowser bs;

        public static string CurrentBranch;
        public static string CurrentBranchID;
        public static CodeControlInfo CurrentCodeControl;
        public static Dictionary<string, CodeControlInfo> CodeControlInfos = new Dictionary<string, CodeControlInfo>();
        public static Dictionary<string, string> GitBranchID = new Dictionary<string, string>();
        public static CodeControlEditorAdornment controlEditorAdornment = null;

        public MyWindowControl()
        {
            this.InitializeComponent();
            //theBrowser.Address = Environment.CurrentDirectory + "/Resources/public_html/progvolver.html";
            theBrowser.Address = "http://localhost:8383/Resources/progvolver.html";
            //theBrowser.Address = "http://www.google.com";
            jsHandler = new JsHandler(this, currentDispatcher);
            theBrowser.JavascriptObjectRepository.Register("jsHandler", jsHandler, true);
            // TMP
            theBrowser.IsBrowserInitializedChanged += ChromeBrowser_IsBrowserInitializedChanged;
            bs = theBrowser;
            dte = Package.GetGlobalService(typeof(SDTE)) as DTE;
            dteNew = dte;
            IVsSolution vv = Package.GetGlobalService(typeof(SVsSolution)) as IVsSolution;
            uint cookie;
            events = dte.Events;
            solutionEvents = ((Events2)dte.Events).SolutionEvents;
            solutionEvents.Opened += SolutionOpened;
            // debugging support and events
            debugger = dte.Debugger;
            debuggerEvents = dte.Events.DebuggerEvents;
            debuggerEvents.OnEnterRunMode += OnEnterRunModeHandler;
            debuggerEvents.OnEnterBreakMode += new _dispDebuggerEvents_OnEnterBreakModeEventHandler(OnEnterBreakModeHandler);
            debuggerEvents.OnEnterDesignMode += OnEnterDesignMode;
            closeCodeUnboxer(null);
        }

        private void ChromeBrowser_IsBrowserInitializedChanged(object sender, DependencyPropertyChangedEventArgs e)
        {
            theBrowser.ShowDevTools();
        }

        public static void openCodeUnboxer(object directory)
        {
            IVsUIShell vsUIShell = (IVsUIShell)Package.GetGlobalService(typeof(SVsUIShell));
            Guid guid = typeof(ToolWindow1).GUID;
            IVsWindowFrame windowFrame;
            int result = vsUIShell.FindToolWindow((uint)__VSFINDTOOLWIN.FTW_fFindFirst, ref guid, out windowFrame);   // Find MyToolWindow

            if (result != VSConstants.S_OK)
                result = vsUIShell.FindToolWindow((uint)__VSFINDTOOLWIN.FTW_fForceCreate, ref guid, out windowFrame); // Crate MyToolWindow if not found

            if (result == VSConstants.S_OK)
            {                                                                 // Show MyToolWindow
                ErrorHandler.ThrowOnFailure(windowFrame.Show());
                //ToolWindow1Control.readFiles(directory.ToString());
            }
        }
        public static void closeCodeUnboxer(object directory)
        {
            IVsUIShell vsUIShell = (IVsUIShell)Package.GetGlobalService(typeof(SVsUIShell));
            Guid guid = typeof(ToolWindow1).GUID;
            IVsWindowFrame windowFrame;
            int result = vsUIShell.FindToolWindow((uint)__VSFINDTOOLWIN.FTW_fFindFirst, ref guid, out windowFrame);   // Find MyToolWindow

            if (result != VSConstants.S_OK)
                result = vsUIShell.FindToolWindow((uint)__VSFINDTOOLWIN.FTW_fForceCreate, ref guid, out windowFrame); // Crate MyToolWindow if not found

            if (result == VSConstants.S_OK)                                                                           // Show MyToolWindow
                ErrorHandler.ThrowOnFailure(windowFrame.Hide());
        }

        private void OnEnterRunModeHandler(dbgEventReason Reason)
        {

            IVsOutputWindow outWindow = (IVsOutputWindow)Package.GetGlobalService(typeof(SVsOutputWindow));
            Guid debugPaneGuid = VSConstants.GUID_OutWindowDebugPane;
            IVsOutputWindowPane pane;
            outWindow.GetPane(ref debugPaneGuid, out pane);

            IVsUserData userData = (IVsUserData)pane;
            Guid guidViewHost = DefGuidList.guidIWpfTextViewHost;
            userData.GetData(ref guidViewHost, out object o);

            IWpfTextViewHost viewHost = (IWpfTextViewHost)o;
            IWpfTextView textView = viewHost.TextView;
            textView.TextBuffer.Changed += OnConsoleTextChanged;

            MyWindowControl.initTime = nanoTime();

            CodeAnalyzer.debugCode(this);


        }

        private void OnConsoleTextChanged(object sender, TextContentChangedEventArgs e)
        {

            if (e.Changes != null)
            {
                for (int i = 0; i < e.Changes.Count; i++)
                {
                    string newText = e.Changes[i].NewText;

                    if (newText.Contains(MyWindowControl.debugLineInit))
                    {

                        string[] separatingStrings = { MyWindowControl.debugLineEnd };
                        string[] tokens = newText.Split(separatingStrings, System.StringSplitOptions.RemoveEmptyEntries);

                        foreach (string token in tokens)
                        {

                            string processedEntry = token.Replace("\r\n", "\n").Replace('\r', '\n').Replace("\n", "").Trim();

                            if (!string.IsNullOrEmpty(processedEntry))
                            {

                                int init = processedEntry.IndexOf(MyWindowControl.debugLineInit);

                                if (init != -1)
                                {
                                    processedEntry = processedEntry.Substring(init, processedEntry.Length - init).Replace(MyWindowControl.debugLineInit, "").Trim();

                                    char[] separator = { '~' };
                                    string[] parts = processedEntry.Split(separator, System.StringSplitOptions.RemoveEmptyEntries);

                                    int openingPar = parts[4].IndexOf("(");
                                    int closingPar = parts[4].IndexOf(")");

                                    string file = parts[4].Substring(0, openingPar);
                                    string lineNumber = parts[4].Substring(openingPar + 1, closingPar - openingPar - 1);


                                    //string lineToWrite = parts[0] + "~" + parts[1] + "~" + parts[2] + "~" + lineNumber + "~" + file + "~" + parts[6] + "~" + nanoTime() + "~" + (nanoTime() - MyWindowControl.initTime);


                                    //// lastBP.Message = MyWindowControl.debugLineInit +
                                    //symbol.ToString() +
                                    //    "~{" + symbol.ToString() + "}~" +
                                    //    parent.ToString() +
                                    //    "~$CALLSTACK~$FILEPOS~" +
                                    //    symbolID + "~" +
                                    //    declareAtFrom + "~" +
                                    //    declareAtTo + "~" + declarator + "~" + scopeFrom + "~" + scopeTo + "~" + enclosingSymbol.Name + "~" + enclosingSymbolStart + "~" + enclosingSymbolEnd + "~$TICK" + MyWindowControl.debugLineEnd + "\n";


                                    string symbolID = parts[5];
                                    string declareAtFrom = parts[6];
                                    string declareAtTo = parts[7];
                                    string declarator = parts[8];
                                    string scopeFrom = parts[9];
                                    string scopeTo = parts[10];
                                    string enclosingSymbolName = parts[11];
                                    string enclosingSymbolStart = parts[12];
                                    string enclosingSymbolEnd = parts[13];

                                    string lineToWrite = parts[0] + "~" + parts[1] + "~" + parts[2] + "~" + lineNumber + "~" + file + "~" + symbolID + "~" + declareAtFrom + "~" + declareAtTo + "~" + declarator + "~" + scopeFrom + "~" + scopeTo + "~" + enclosingSymbolName + "~" + enclosingSymbolStart + "~" + enclosingSymbolEnd + "~" + nanoTime();


                                    //traceListener.WriteLine(processedEntry + ";" + init + ";" + file + ";" + line + "\n\n");



                                    // Sending the lineToWrite variable to the web browser here so that the web client receives it as it is ready                                    

                                    Object[] showArgs = { lineToWrite };
                                    JavascriptResponse response = theBrowser.EvaluateScriptAsync("addSliderData", showArgs).Result;
                                    string result = (string)response.Result;


                                    traceListener.WriteLine(lineToWrite);

                                    //traceListener.WriteLine("FROM WEB CLIENT: " + result);

                                    traceListener.Flush();


                                }
                            }
                        }

                    }
                }
            }
        }

        public static void printInBrowserConsole(object o)
        {
            //Object[] showArgs = { "FROM VISUAL STUDIO:\n" + text };
            Object[] showArgs = { o.ToString() };
            JavascriptResponse response = bs.EvaluateScriptAsync("printInConsole", showArgs).Result;
            string result = (string)response.Result;
        }

        private static long nanoTime()
        {
            // TickCount cycles between Int32.MinValue, which is a negative
            // number, and Int32.MaxValue once every 49.8 days. This sample
            // removes the sign bit to yield a nonnegative number that cycles
            // between zero and Int32.MaxValue once every 24.9 days.

            long nano = 10000L * Stopwatch.GetTimestamp();
            nano /= TimeSpan.TicksPerMillisecond;
            nano *= 100L;
            return nano;
        }

        public void SolutionOpened()
        {

            openedSolution = dte.Solution;

            Object[] showArgs = { "Processing loaded solution" };
            JavascriptResponse response = theBrowser.EvaluateScriptAsync("showWaitingDialog", showArgs).Result;
            string id = (string)response.Result;

            assembledSolution = CodeAnalyzer.assembleSearchableSolution(this);

            Object[] hideArgs = { id, "Solution Loaded" };
            theBrowser.EvaluateScriptAsync("hideWaitingDialog", hideArgs);

            OutputWindowEvents outputWindowEvents = dte.Events.OutputWindowEvents["Output"];
            outputWindowEvents.PaneUpdated += new _dispOutputWindowEvents_PaneUpdatedEventHandler(DebugPaneUpdated);

        }

        private void DebugPaneUpdated(OutputWindowPane pane)
        {
            MessageBox.Show("I changed!");

        }

        private void theBrowser_Drop(object sender, System.Windows.DragEventArgs e)
        {
            // DragDropEffects.Copy guarantees that the text does get removed from VS' editor
            e.Effects = System.Windows.DragDropEffects.Copy;
            e.Handled = true;
        }


        /// <summary>
        /// Initializes a new instance of the <see cref="MyWindowControl"/> class.
        /// </summary>
        //    public MyWindowControl() {

        //    theWindowControl = this;

        //    this.InitializeComponent();

        //    //MyDesigner.theScrollViewer = theScrollViewer;
        //    //MyDesigner.LayoutTransform = new ScaleTransform();

        //    //MyDesigner.scaleTransform = new ScaleTransform();
        //    //MyDesigner.LayoutTransform = MyDesigner.scaleTransform;

        //    sliderGrid.Visibility = Visibility.Hidden;

        //    timeSlider.ValueChanged += TimeSlider_ValueChanged;

        //    dte = Package.GetGlobalService(typeof(SDTE)) as DTE;

        //    debugger = dte.Debugger;


        //    debuggerEvents = dte.Events.DebuggerEvents;




        //    debuggerEvents.OnEnterBreakMode += new _dispDebuggerEvents_OnEnterBreakModeEventHandler(BreakHandler);

        //    //debuggerEvents.OnEnterBreakMode += BreakHandler;

        //    debuggerEvents.OnEnterDesignMode += _dteDebuggerEvents_OnEnterDesignMode;

        //    //  string path = System.IO.Path.GetDirectoryName(Assembly.GetExecutingAssembly().CodeBase);

        //    string currentDir = Environment.CurrentDirectory;




        //    //prueba();


        //    // MessageBox.Show(currentDir);



        //}

        //private void TimeSlider_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e) {
        //    double userTime = changeRange(timeSlider.Value, timeSlider.Minimum, timeSlider.Maximum, 0, maxTimestamp);

        //    foreach (DictionaryEntry entry in expressionVisualizers) {
        //        ExpressionVisualizer expressionVisualizer = (ExpressionVisualizer)entry.Value;
        //        expressionVisualizer.filterMarks(userTime);
        //    }
        //}

        double changeRange(double oldValue, double oldMin, double oldMax, double newMin, double newMax)
        {
            var oldRange = (oldMax - oldMin);
            var newRange = (newMax - newMin);
            var newValue = (((oldValue - oldMin) * newRange) / oldRange) + newMin;
            if (Double.IsNaN(newValue))
            { // true when the oldRange is zero (i.e., when the oldMax and oldMin are equal)
                newValue = oldValue;
            }
            return newValue;
        }

        void onDebuggingStop()
        {
            foreach (var bp in addedBreakPoints)
            {
                bp.Delete();
            }
            addedBreakPoints.Clear();
            //            MessageBox.Show("Debugging process has stopped!");
        }

        // Fired when leaving run mode or debug mode, and when the debugger establishes design mode after debugging.
        void OnEnterDesignMode(dbgEventReason Reason)
        {
            switch (Reason)
            {
                case dbgEventReason.dbgEventReasonStopDebugging:
                    onDebuggingStop();
                    break;
            }
        }

        private IDebugProperty2 GetVsDebugProperty(string expressionString, IDebugStackFrame2 stackFrame, out IDebugExpression2 debugExpression, IDebugExpressionContext2 debugContext, out long evaluatedAtSeconds)
        {

            IDebugProperty2 debugProperty = null;
            StringBuilder sb = new StringBuilder();
            string errorString;
            uint pichError;
            debugExpression = null;

            //debugContext.ParseText(expressionString, (uint)(enum_PARSEFLAGS.PARSE_EXPRESSION | enum_PARSEFLAGS.PARSE_DESIGN_TIME_EXPR_EVAL), 10, out debugExpression, out errorString, out pichError);

            //debugExpression.EvaluateSync((uint)(enum_EVALFLAGS.EVAL_NOSIDEEFFECTS | enum_EVALFLAGS.EVAL_ALLOW_IMPLICIT_VARS | enum_EVALFLAGS.EVAL_ALLOWERRORREPORT), uint.MaxValue, null, out debugProperty);

            endSeconds = ((DateTimeOffset)(DateTime.UtcNow)).ToUnixTimeSeconds();

            evaluatedAtSeconds = endSeconds - initSeconds;

            maxTimestamp = evaluatedAtSeconds;

            Debug.WriteLine("########################### evaluatedAtSeconds: " + evaluatedAtSeconds);

            return debugProperty;
        }



        public void OnEnterBreakModeHandler(dbgEventReason reason, ref dbgExecutionAction execAction)
        {


            // There could be many reasons to enter here. The possible values are available at the dbgEventReason enumeration

            /*Debug.WriteLine("####################################################");
            Debug.WriteLine("reason: " + reason);
            Debug.WriteLine("debugger.LastBreakReason: " + debugger.LastBreakReason);
            Debug.WriteLine("####################################################");*/


            //debugger.StepOver();


            /*if (reason.Equals(dbgEventReason.dbgEventReasonBreakpoint)) {

                //debugger.Breakpoints

                Breakpoint bp = debugger.Breakpoints.Item(1);



                //bp.CurrentHits


                bp.Enabled = false;
                //bp.Delete();

                //debugger.StepOver();





                trackedExpressions.Clear();
                expressionVisualizers.Clear();
                expressions.Clear();

                initSeconds = ((DateTimeOffset)(DateTime.UtcNow)).ToUnixTimeSeconds();

                foreach (KeyValuePair<string, ISymbol> entry in this.trackedSymbols) {
                    addMonitoredExpression(entry.Key, entry.Value.ToString());
                }

            }

            evaluateExpressions(expressions);*/



        }

        public bool evaluateExpression(string expressionString, out DEBUG_PROPERTY_INFO propertyInfo, out TEXT_POSITION beginStatement, out TEXT_POSITION endStatement, out TEXT_POSITION beginSource, out TEXT_POSITION endSource, out string documentName, out long unixTimeTaken)
        {

            propertyInfo = default(DEBUG_PROPERTY_INFO);
            beginStatement = default(TEXT_POSITION);
            endStatement = default(TEXT_POSITION);
            beginSource = default(TEXT_POSITION);
            endSource = default(TEXT_POSITION);
            documentName = null;
            unixTimeTaken = default(long);

            Debug.WriteLine("");
            Debug.WriteLine("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            Debug.WriteLine("@@@@@@@ Evaluating expression " + expressionString + " @@@@@@@");
            Debug.WriteLine("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

            /*Debug.WriteLine("");
            Debug.WriteLine("debugger.LastBreakReason: " + debugger.LastBreakReason);*/

            IVsDebugger debugService = Package.GetGlobalService(typeof(SVsShellDebugger)) as IVsDebugger;
            IDebuggerInternal11 debuggerServiceInternal = (IDebuggerInternal11)debugService;
            IDebugThread2 thread = debuggerServiceInternal.CurrentThread;

            // Get frame info enum interface
            IEnumDebugFrameInfo2 enumDebugFrameInfo2;
            //if (VSConstants.S_OK != thread.EnumFrameInfo((uint)enum_FRAMEINFO_FLAGS.FIF_FRAME, 0, out enumDebugFrameInfo2))
            //{
            //    Debug.WriteLine("Could not enumerate stack frames.");
            //    return false;
            //}

            FRAMEINFO[] frameInfo = new FRAMEINFO[1];
            uint fetched = 0;
            //int hr = enumDebugFrameInfo2.Next(1, frameInfo, ref fetched);

            //if (hr != VSConstants.S_OK || fetched != 1)
            //{
            //    Debug.WriteLine("Failed to get current stack frame info.");
            //    return false;
            //}

            IDebugStackFrame2 stackFrame = frameInfo[0].m_pFrame;
            if (stackFrame == null)
            {
                Debug.WriteLine("Current stack frame is null.");
                return false;
            }

            // Get a context for evaluating expressions.
            IDebugExpressionContext2 expressionContext;
            if (VSConstants.S_OK != stackFrame.GetExpressionContext(out expressionContext))
            {
                Debug.WriteLine("Failed to get expression context.");
                return false;
            }

            IDebugExpression2 expression;
            IDebugProperty2 debugProperty = GetVsDebugProperty(expressionString, stackFrame, out expression, expressionContext, out unixTimeTaken);

            if (debugProperty != null)
            {

                IDebugReference2[] reference = new IDebugReference2[1];
                DEBUG_PROPERTY_INFO[] propertyInfoArray = new DEBUG_PROPERTY_INFO[1];

                //debugProperty.GetPropertyInfo(
                //        (uint)(enum_DEBUGPROP_INFO_FLAGS.DEBUGPROP_INFO_ALL | enum_DEBUGPROP_INFO_FLAGS.DEBUGPROP_INFO_VALUE),
                //        10, uint.MaxValue, reference, 0, propertyInfoArray);

                //debugProperty.GetPropertyInfo(
                //        (uint)(enum_DEBUGPROP_INFO_FLAGS.DEBUGPROP_INFO_STANDARD),
                //        10, uint.MaxValue, reference, 0, propertyInfoArray);

                propertyInfo = propertyInfoArray[0];

                TEXT_POSITION[] beginStatementArray = new TEXT_POSITION[1];
                TEXT_POSITION[] endStatementArray = new TEXT_POSITION[1];
                TEXT_POSITION[] beginSourceArray = new TEXT_POSITION[1];
                TEXT_POSITION[] endSourceArray = new TEXT_POSITION[1];
                IDebugDocumentContext2 debugDocumentContext2;

                stackFrame.GetDocumentContext(out debugDocumentContext2);
                if (debugDocumentContext2 != null)
                {
                    //debugDocumentContext2.GetName((uint)enum_GETNAME_TYPE.GN_FILENAME, out documentName);
                    debugDocumentContext2.GetStatementRange(beginStatementArray, endStatementArray);
                    debugDocumentContext2.GetSourceRange(beginSourceArray, endSourceArray);
                }

                beginStatement = beginStatementArray[0];
                endStatement = endStatementArray[0];
                beginSource = beginSourceArray[0];
                endSource = endSourceArray[0];

                return true;

            }
            else
            {
                return false;
            }
        }

        public void evaluateExpressions(Dictionary<string, string> expressions)
        {

            foreach (KeyValuePair<string, string> entry in expressions)
            {

                string expressionID = entry.Key;
                string expressionString = entry.Value;

                Debug.WriteLine("===========================================================");

                DEBUG_PROPERTY_INFO propertyInfo;
                TEXT_POSITION beginStatement;
                TEXT_POSITION endStatement;
                TEXT_POSITION beginSource;
                TEXT_POSITION endSource;
                string documentName;
                long timeStamp;

                bool success = evaluateExpression(expressionString, out propertyInfo, out beginStatement, out endStatement, out beginSource, out endSource, out documentName, out timeStamp);

                if (success && propertyInfo.bstrType != null)
                {

                    Debug.WriteLine("timeStamp: " + timeStamp);

                    string newValue = propertyInfo.bstrValue;

                    int numericValue;
                    var couldParse = Int32.TryParse(newValue, out numericValue);


                    if (couldParse)
                    {

                        Object[] args = { expressionID, newValue };
                        JavascriptResponse response = theBrowser.EvaluateScriptAsync("updateVariable", args).Result;

                        //if (trackedExpressions.Contains(expressionString)) {

                        //    string currentValue = (string)trackedExpressions[expressionString];

                        //    /*Debug.WriteLine("currentValue: " + currentValue);
                        //    Debug.WriteLine("newValue: " + newValue);*/

                        //    if (!newValue.Equals(currentValue)) {
                        //        ExpressionVisualizer visualizer = (ExpressionVisualizer)expressionVisualizers[expressionString];
                        //        MarkMetadata metadata = new MarkMetadata(documentName, (int)endStatement.dwLine, (int)endStatement.dwColumn, timeStamp, System.IO.Path.GetFileName(documentName), (int)numericValue);
                        //        visualizer.addMark(metadata);
                        //        trackedExpressions[expressionString] = newValue;
                        //    }

                        //} else {
                        //    trackedExpressions.Add(expressionString, newValue);
                        //    ExpressionVisualizer visualizer = (ExpressionVisualizer)expressionVisualizers[expressionString];
                        //    MarkMetadata metadata = new MarkMetadata(documentName, (int)endStatement.dwLine, (int)endStatement.dwColumn, timeStamp, System.IO.Path.GetFileName(documentName), (int)numericValue);
                        //    visualizer.addMark(metadata);
                        //}

                        Debug.WriteLine("");
                        Debug.WriteLine("documentName: " + documentName);

                        Debug.WriteLine("");
                        Debug.WriteLine("bstrType: " + propertyInfo.bstrType);
                        Debug.WriteLine("bstrFullName: " + propertyInfo.bstrFullName);
                        Debug.WriteLine("bstrName: " + propertyInfo.bstrName);
                        Debug.WriteLine("bstrValue: " + propertyInfo.bstrValue);
                        Debug.WriteLine("dwAttrib: " + propertyInfo.dwAttrib);
                        Debug.WriteLine("dwFields: " + propertyInfo.dwFields);

                        Debug.WriteLine("");
                        Debug.WriteLine("statement begin line: " + beginStatement.dwLine);
                        Debug.WriteLine("statement begin column: " + beginStatement.dwColumn);
                        Debug.WriteLine("statement end line: " + endStatement.dwLine);
                        Debug.WriteLine("statement end column: " + endStatement.dwColumn);

                        Debug.WriteLine("");
                        Debug.WriteLine("source begin line: " + beginSource.dwLine);
                        Debug.WriteLine("source begin column: " + beginSource.dwColumn);
                        Debug.WriteLine("source end line: " + endSource.dwLine);
                        Debug.WriteLine("source end column: " + endSource.dwColumn);
                        Debug.WriteLine("");


                    }
                    else
                    {

                        Debug.WriteLine("¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡");
                        Debug.WriteLine("The expression: " + expressionString + " does not have a value yet");
                        Debug.WriteLine("¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡");

                    }



                }
                else
                {

                    Debug.WriteLine("¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡");
                    Debug.WriteLine("I could NOT evaluate the expression: " + expressionString);
                    Debug.WriteLine("¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡");

                }


                Debug.WriteLine("===========================================================");





            }
        }






        /// <summary>
        /// Handles click on the button by displaying a message box.
        /// </summary>
        /// <param name="sender">The event sender.</param>
        /// <param name="e">The event args.</param>
        [SuppressMessage("Microsoft.Globalization", "CA1300:SpecifyMessageBoxOptions", Justification = "Sample code")]
        [SuppressMessage("StyleCop.CSharp.NamingRules", "SA1300:ElementMustBeginWithUpperCaseLetter", Justification = "Default event handler naming pattern")]


        //private void Upload_Click(object sender, RoutedEventArgs e) {
        //    Stream streamreader = new FileStream("designerCanvas.xaml", FileMode.OpenOrCreate, FileAccess.Read);
        //    // Stream streamreader = new Stream(filestream);

        //    if (streamreader.Length != -1) {
        //        TextReader reader = File.OpenText("designerCanvas.xaml");
        //        XmlReader xmlReader = XmlReader.Create(reader);
        //        DesignerCanvas copia = (DesignerCanvas)XamlReader.Load(xmlReader);

        //        if (copia != null) {
        //            //this.MyDesigner = copia;
        //        }



        //        reader.Close();
        //    }
        //}

        //private void prueba() {
        //    Stream streamreader = new FileStream("designerCanvas.xaml", FileMode.OpenOrCreate, FileAccess.Read);
        //    // Stream streamreader = new Stream(filestream);

        //    if (streamreader.Length != -1) {
        //        TextReader reader = File.OpenText("designerCanvas.xaml");
        //        XmlReader xmlReader = XmlReader.Create(reader);
        //        DesignerCanvas copia = (DesignerCanvas)XamlReader.Load(xmlReader);

        //        if (copia != null) {
        //            //this.MyDesigner = copia;
        //        }



        //        reader.Close();
        //    }

        //}

        void addMonitoredExpression(string id, string expressionString)
        {
            expressions.Add(id, expressionString);
            //Brush brush = Utils.ramdonBrush();
            //ExpressionVisualizer visualizer = new ExpressionVisualizer((DTE)dte, expressionString, brush);
            //addExpressionVisualizer(visualizer, expressionString);
        }


        public bool projectOpen()
        {
            return dte != null && dte.Solution != null && dte.Solution.Projects != null && dte.Solution.Projects.Count > 0;
        }



        private void Button_Click_2(object sender, RoutedEventArgs e)
        {


            //if (dte != null && dte.Solution != null && dte.Solution.Projects != null && dte.Solution.Projects.Count > 0) {

            //    myStackPanel.Children.Clear();
            //    expressionVisualizers.Clear();

            //    Project firstProject = dte.Solution.Projects.Item(1);

            //    string projectName = @"" + firstProject.FullName;

            //    String solutionDir = System.IO.Path.GetDirectoryName(projectName);

            //    List<String> expressions = new List<String>();
            //    expressions.Add("i");
            //    expressions.Add("j");
            //    expressions.Add("k");
            //    expressions.Add("i");
            //    expressions.Add("x + 1");
            //    expressions.Add("x + y + 21");
            //    expressions.Add("x + 41 + a");
            //    expressions.Add("4 + 10");
            //    expressions.Add("a || b");
            //    expressions.Add("x && y");
            //    expressions.Add("main");
            //    expressions.Add("aGlobal");

            //    programDumper.dumpProgram(expressions, solutionDir, this);

            //}

        }


        private void zoomAndPanControl_MouseWheel(object sender, MouseWheelEventArgs e)
        {
            e.Handled = true;
            if (e.Delta > 0)
            {
                Point curContentMousePoint = e.GetPosition(this);
                ZoomIn(curContentMousePoint);
            }
            else if (e.Delta < 0)
            {
                Point curContentMousePoint = e.GetPosition(this);
                ZoomOut(curContentMousePoint);
            }
        }

        private void ZoomOut(Point contentZoomCenter)
        {
            //zoomAndPanControl.ZoomAboutPoint(zoomAndPanControl.ContentScale - 0.1, contentZoomCenter);
        }

        private void ZoomIn(Point contentZoomCenter)
        {
            //zoomAndPanControl.ZoomAboutPoint(zoomAndPanControl.ContentScale + 0.1, contentZoomCenter);
        }

        private void upload_Click(object sender, RoutedEventArgs e)
        {

        }

        public int OnAfterOpenProject(IVsHierarchy pHierarchy, int fAdded)
        {
            return -1;
        }

        public int OnQueryCloseProject(IVsHierarchy pHierarchy, int fRemoving, ref int pfCancel)
        {
            return ((IVsSolutionEvents)MyToolWindow).OnQueryCloseProject(pHierarchy, fRemoving, ref pfCancel);
        }

        public int OnBeforeCloseProject(IVsHierarchy pHierarchy, int fRemoved)
        {
            return ((IVsSolutionEvents)MyToolWindow).OnBeforeCloseProject(pHierarchy, fRemoved);
        }

        public int OnAfterLoadProject(IVsHierarchy pStubHierarchy, IVsHierarchy pRealHierarchy)
        {
            return -1;
        }

        public int OnQueryUnloadProject(IVsHierarchy pRealHierarchy, ref int pfCancel)
        {
            return -1;
        }

        public int OnBeforeUnloadProject(IVsHierarchy pRealHierarchy, IVsHierarchy pStubHierarchy)
        {
            return -1;
        }

        public int OnAfterOpenSolution(object pUnkReserved, int fNewSolution)
        {
            return -1;
        }

        public int OnQueryCloseSolution(object pUnkReserved, ref int pfCancel)
        {
            return -1;
        }

        public int OnBeforeCloseSolution(object pUnkReserved)
        {
            return -1;
        }

        public int OnAfterCloseSolution(object pUnkReserved)
        {
            return -1;
        }
    }
}