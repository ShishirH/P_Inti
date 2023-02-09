﻿using EnvDTE;
using Microsoft.VisualStudio.Shell;
using Microsoft.VisualStudio.Shell.Interop;
using System;
using System.ComponentModel.Design;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using Task = System.Threading.Tasks.Task;

namespace P_Inti
{
    /// <summary>
    /// Command handler
    /// </summary>
    internal sealed class CodeControlAddExistingCode
    {
        /// <summary>
        /// Command ID.
        /// </summary>
        public const int CommandId = 256;

        /// <summary>
        /// Command menu group (command set GUID).
        /// </summary>
        public static readonly Guid CommandSet = new Guid("426c1930-c84a-4b53-8f37-d2dd9e325f1f");

        /// <summary>
        /// VS Package that provides this command, not null.
        /// </summary>
        private readonly AsyncPackage package;

        /// <summary>
        /// Initializes a new instance of the <see cref="CodeControlAddExistingCode"/> class.
        /// Adds our command handlers for menu (commands must exist in the command table file)
        /// </summary>
        /// <param name="package">Owner package, not null.</param>
        /// <param name="commandService">Command service to add command to, not null.</param>
        private CodeControlAddExistingCode(AsyncPackage package, OleMenuCommandService commandService)
        {
            this.package = package ?? throw new ArgumentNullException(nameof(package));
            commandService = commandService ?? throw new ArgumentNullException(nameof(commandService));

            var menuCommandID = new CommandID(CommandSet, CommandId);
            var menuItem = new MenuCommand(this.Execute, menuCommandID);
            commandService.AddCommand(menuItem);
        }

        /// <summary>
        /// Gets the instance of the command.
        /// </summary>
        public static CodeControlAddExistingCode Instance
        {
            get;
            private set;
        }

        /// <summary>
        /// Gets the service provider from the owner package.
        /// </summary>
        private Microsoft.VisualStudio.Shell.IAsyncServiceProvider ServiceProvider
        {
            get
            {
                return this.package;
            }
        }

        /// <summary>
        /// Initializes the singleton instance of the command.
        /// </summary>
        /// <param name="package">Owner package, not null.</param>
        public static async Task InitializeAsync(AsyncPackage package)
        {
            // Switch to the main thread - the call to AddCommand in CodeControlAddExistingCode's constructor requires
            // the UI thread.
            await ThreadHelper.JoinableTaskFactory.SwitchToMainThreadAsync(package.DisposalToken);

            OleMenuCommandService commandService = await package.GetServiceAsync(typeof(IMenuCommandService)) as OleMenuCommandService;
            Instance = new CodeControlAddExistingCode(package, commandService);
        }

        /// <summary>
        /// This function is the callback used to execute the command when the menu item is clicked.
        /// See the constructor to see how the menu item is associated with this function using
        /// OleMenuCommandService service and MenuCommand class.
        /// </summary>
        /// <param name="sender">Event sender.</param>
        /// <param name="e">Event args.</param>
        private void Execute(object sender, EventArgs e)
        {
            ThreadHelper.ThrowIfNotOnUIThread();

            CodeControlEditorAdornment.wereLinesUpdated = false;
            System.IServiceProvider serviceProvider = package as System.IServiceProvider;
            EnvDTE.DTE dte = (EnvDTE.DTE)serviceProvider.GetService(typeof(EnvDTE.DTE));
            EnvDTE.TextSelection ts = dte.ActiveWindow.Selection as EnvDTE.TextSelection;

            MyWindowControl.printInBrowserConsole("ts.TextRanges.ToString()");
            MyWindowControl.printInBrowserConsole(ts.TextRanges.ToString());

            foreach(TextRange textRange in ts.TextRanges)
            {
                MyWindowControl.printInBrowserConsole(textRange.ToString());
                MyWindowControl.printInBrowserConsole(textRange.StartPoint.Line);
                MyWindowControl.printInBrowserConsole(textRange.EndPoint.Line);
            }

            //string codeControlText = CodeControls.AddExistingCodeToCodeControl(ts.Text);

            //MyWindowControl.printInBrowserConsole("CodeControlText is: ");
            //MyWindowControl.printInBrowserConsole(codeControlText);

            //ts.Text = codeControlText;

            //MyWindowControl.printInBrowserConsole("ts.Text is: ");
            //MyWindowControl.printInBrowserConsole(ts.Text);

            //CodeControlEditorAdornment.wereLinesUpdated = true;
            //CodeControlEditorAdornment.CreateEditorVisuals(null);
        }
    }
}
