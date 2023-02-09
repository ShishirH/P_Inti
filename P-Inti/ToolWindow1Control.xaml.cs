using System.Diagnostics.CodeAnalysis;
using System.Windows;
using System.Windows.Controls;
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
using System.Diagnostics;
using System.Threading;

namespace P_Inti
{
    /// <summary>
    /// Interaction logic for ToolWindow1Control.
    /// </summary>
    public partial class ToolWindow1Control : UserControl, IVsSolutionEvents
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ToolWindow1Control"/> class.
        /// </summary>
        /// 
        public readonly DTE dte = null;
        public JsHandler jsHandler = null;
        public static ChromiumWebBrowser bs;
        public static Dispatcher currentDispatcher = System.Windows.Threading.Dispatcher.CurrentDispatcher;
        public ToolWindow1Control()
        {
            this.InitializeComponent();
            dte = Package.GetGlobalService(typeof(SDTE)) as DTE;
            theBrowser2.Address = "http://localhost:8383/Resources/codeunboxer.html";
            bs = theBrowser2;
            jsHandler = new JsHandler(this, currentDispatcher);
            theBrowser2.JavascriptObjectRepository.Register("jsHandler", jsHandler, true);
            theBrowser2.IsBrowserInitializedChanged += ChromeBrowser_IsBrowserInitializedChanged;
        }



        public static void readFiles(string filePath)
        {
            //printInBrowserConsole("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX: " + filePath);
            ToolWindow1Control.printInBrowserConsole("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX: " + filePath);
            //string solutionPath = dte.Solution.FullName;
            //string solutionPath = "";
            //string solutionDir = System.IO.Path.GetDirectoryName(solutionPath);
            //string progvolverDir = solutionDir + "/progvolver";
            //DirectoryInfo d = new DirectoryInfo(progvolverDir); //Assuming Test is your Folder

            //FileInfo[] Files = d.GetFiles("*.*"); //Getting Text files
            //string str = "";

            //foreach (FileInfo file in Files)
            //{
            //    str = str + ", " + file.Name;
            //    ToolWindow1Control.printInBrowserConsole("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX: " + str);
            //}

            //string[] signalFileContent = { };
            //string signalFilePath = compiledDirectory + "\\" + "run" + ".lineinfo";

            //FileInfo signalFileInfo = new FileInfo(signalFilePath);

            //if (signalFileInfo.Exists)
            //{
            //    signalFileContent = File.ReadAllLines(compiledDirectory + "\\" + "run" + ".lineinfo");
            //}
            //for (int i = 0; i < signalFileContent.Length; i++)
            //{
            //    ToolWindow1Control.printInBrowserConsole("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX: " + signalFileContent[i]);
            //}

        }


        public void reloadBrowser(object foo)
        {
            theBrowser2.Reload();
        }

        public static void printInBrowserConsole(object o)
        {
            //Object[] showArgs = { "FROM VISUAL STUDIO:\n" + text };
            Object[] showArgs = { o.ToString() };
            JavascriptResponse response = bs.EvaluateScriptAsync("printInConsole", showArgs).Result;
            string result = (string)response.Result;
        }

        /// <summary>
        /// Handles click on the button by displaying a message box.
        /// </summary>
        /// <param name="sender">The event sender.</param>
        /// <param name="e">The event args.</param>

        private void ChromeBrowser_IsBrowserInitializedChanged(object sender, DependencyPropertyChangedEventArgs e)
        {
            theBrowser2.ShowDevTools();
        }

        [SuppressMessage("Microsoft.Globalization", "CA1300:SpecifyMessageBoxOptions", Justification = "Sample code")]
        [SuppressMessage("StyleCop.CSharp.NamingRules", "SA1300:ElementMustBeginWithUpperCaseLetter", Justification = "Default event handler naming pattern")]
        private void button1_Click(object sender, RoutedEventArgs e)
        {
            string solutionPath = this.dte.Solution.FullName;
            MessageBox.Show(
                string.Format(System.Globalization.CultureInfo.CurrentUICulture, "Invoked '{0}'", this.ToString()),
              solutionPath);
            string solutionDir = System.IO.Path.GetDirectoryName(solutionPath);
            string progvolverDir = solutionDir + "/progvolver";
            //codeBlock.Text = "YES!!!!!";
        }

        public int OnAfterOpenProject(IVsHierarchy pHierarchy, int fAdded)
        {
            throw new NotImplementedException();
        }

        public int OnQueryCloseProject(IVsHierarchy pHierarchy, int fRemoving, ref int pfCancel)
        {
            throw new NotImplementedException();
        }

        public int OnBeforeCloseProject(IVsHierarchy pHierarchy, int fRemoved)
        {
            throw new NotImplementedException();
        }

        public int OnAfterLoadProject(IVsHierarchy pStubHierarchy, IVsHierarchy pRealHierarchy)
        {
            throw new NotImplementedException();
        }

        public int OnQueryUnloadProject(IVsHierarchy pRealHierarchy, ref int pfCancel)
        {
            throw new NotImplementedException();
        }

        public int OnBeforeUnloadProject(IVsHierarchy pRealHierarchy, IVsHierarchy pStubHierarchy)
        {
            throw new NotImplementedException();
        }

        public int OnAfterOpenSolution(object pUnkReserved, int fNewSolution)
        {
            throw new NotImplementedException();
        }

        public int OnQueryCloseSolution(object pUnkReserved, ref int pfCancel)
        {
            throw new NotImplementedException();
        }

        public int OnBeforeCloseSolution(object pUnkReserved)
        {
            throw new NotImplementedException();
        }

        public int OnAfterCloseSolution(object pUnkReserved)
        {
            throw new NotImplementedException();
        }

        internal bool projectOpen()
        {
            return dte != null && dte.Solution != null && dte.Solution.Projects != null && dte.Solution.Projects.Count > 0;
        }
    }
}
