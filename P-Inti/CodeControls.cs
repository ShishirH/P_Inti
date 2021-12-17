using System;
using System.Linq;
using System.Diagnostics;
using System.Text.RegularExpressions;

namespace P_Inti
{
    class CodeControls
    {
        public static void InitializeGitRepo(string solutionDir)
        {
            MyWindowControl.printInBrowserConsole("git init " + solutionDir);
            var gitInitProc = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "powershell.exe",
                    Arguments = "git -C " + solutionDir + " init",
                    UseShellExecute = false,
                    RedirectStandardOutput = false,
                    CreateNoWindow = true
                }
            };

            gitInitProc.Start();
            gitInitProc.WaitForExit();
            MyWindowControl.printInBrowserConsole("Created new git repo");
        }

        public static int GetNumberOfBranches(string solutionDir)
        {
            string command = "(git -C " + solutionDir + " branch -a).Count";
            MyWindowControl.printInBrowserConsole(command);

            var gitBranchesProc = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "powershell.exe",
                    Arguments = command,
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    CreateNoWindow = true
                }
            };

            gitBranchesProc.Start();

            if (!gitBranchesProc.StandardOutput.EndOfStream)
            {
                string line = gitBranchesProc.StandardOutput.ReadLine();
                MyWindowControl.printInBrowserConsole("Branches number: " + line);
                return int.Parse(line);
            }

            return -1;
        }

        public static void AddGitChanges(string solutionDir)
        {
            string command = "git -C " + solutionDir + " add .";
            MyWindowControl.printInBrowserConsole(command);

            var gitAddProc = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "powershell.exe",
                    Arguments = command,
                    UseShellExecute = false,
                    RedirectStandardOutput = false,
                    CreateNoWindow = true
                }
            };

            gitAddProc.Start();
            gitAddProc.WaitForExit();
            MyWindowControl.printInBrowserConsole("Added changes");
        }

        public static void CommitGitChanges(string solutionDir)
        {
            string command = "git -C " + solutionDir + " commit -m " + "\"CC\"";
            MyWindowControl.printInBrowserConsole(command);

            var gitCommitProc = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "powershell.exe",
                    Arguments = command,
                    UseShellExecute = false,
                    RedirectStandardOutput = false,
                    CreateNoWindow = true
                }
            };

            gitCommitProc.Start();
            gitCommitProc.WaitForExit();
            MyWindowControl.printInBrowserConsole("Committed changes");
        }

        public static void CreateAndCheckoutGitBranch(string solutionDir, string branchName)
        {
            string command = "git -C " + solutionDir + " checkout -b " + branchName;
            MyWindowControl.printInBrowserConsole(command);

            var gitCheckoutProc = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "powershell.exe",
                    Arguments = command,
                    UseShellExecute = false,
                    RedirectStandardOutput = false,
                    CreateNoWindow = true
                }
            };

            gitCheckoutProc.Start();
            gitCheckoutProc.WaitForExit();

            MyWindowControl.currentBranch = branchName;
            MyWindowControl.currentBranchID = MyWindowControl.gitBranchID[branchName];

            MyWindowControl.printInBrowserConsole("Checkout out to new branch " + branchName);
        }

        public static void CheckoutToBranch(string solutionDir, string branch)
        {
            string command = "git -C " + solutionDir + " checkout " + branch;
            MyWindowControl.printInBrowserConsole(command);

            var gitCheckoutProc = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "powershell.exe",
                    Arguments = command,
                    UseShellExecute = false,
                    RedirectStandardOutput = false,
                    CreateNoWindow = true
                }
            };

            gitCheckoutProc.Start();
            gitCheckoutProc.WaitForExit();

            //MyWindowControl.currentBranch = branch;
            //MyWindowControl.currentBranchID = MyWindowControl.gitBranchID[branch];
        }

        public static void DeleteBranch(string solutionDir, object branch)
        {
            string command = "git -C " + solutionDir + " branch -D " + branch;
            MyWindowControl.printInBrowserConsole(command);

            var gitDeleteBranchProc = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "powershell.exe",
                    Arguments = command,
                    UseShellExecute = false,
                    RedirectStandardOutput = false,
                    CreateNoWindow = true
                }
            };

            gitDeleteBranchProc.Start();
            gitDeleteBranchProc.WaitForExit();
        }

        public static void MergeBranches(string solutionDir, string branchOneStr, string branchTwoStr)
        {
            MyWindowControl.printInBrowserConsole("First branch is: " + branchOneStr);
            MyWindowControl.printInBrowserConsole("Second branch is: " + branchTwoStr);

            // Checkout to a new branch where you merge your changes
            CodeControls.CreateAndCheckoutGitBranch(solutionDir, Utils.generateID());
            CodeControls.MergeBranch(solutionDir, branchTwoStr);
        }

        // Merge the currently active branch and the branch in the argument
        public static void MergeBranch(string solutionDir, string branch)
        {
            string command = "git -C " + solutionDir + " merge " + branch;
            MyWindowControl.printInBrowserConsole(command);

            var gitMergeBranchProc = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "powershell.exe",
                    Arguments = command,
                    UseShellExecute = false,
                    RedirectStandardOutput = false,
                    CreateNoWindow = true
                }
            };

            gitMergeBranchProc.Start();
            gitMergeBranchProc.WaitForExit();

        }

        public static void ParseGitDiff(string solutionDir)
        {
            string command = "-NoExit (git -C " + solutionDir + " diff -p --stat) | findstr '@@ --git'";
            MyWindowControl.printInBrowserConsole(command);

            var gitDiffProc = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "powershell.exe",
                    Arguments = command,
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    CreateNoWindow = true
                }
            };

            gitDiffProc.Start();

            string gitDiffString = "";
            string fileNameString = "";
            string linesChangedString = "";

            string fileName;
            string[] fileNameSeparator = { "b/" };
            string[] gitChangesSeparator = { "@@" };
            while (!gitDiffProc.StandardOutput.EndOfStream)
            {
                string line = gitDiffProc.StandardOutput.ReadLine();

                // Diff of a new file
                if (line.Contains("diff"))
                {
                    fileNameString = line;

                    string[] fileNameArray = fileNameString.Split(fileNameSeparator, 2, StringSplitOptions.RemoveEmptyEntries);
                    MyWindowControl.printInBrowserConsole("fileNameArray[0] " + fileNameArray[0]);
                    MyWindowControl.printInBrowserConsole("fileNameArray[1] " + fileNameArray[1]);
                    fileNameString = fileNameArray[1];
                }
                // Line containing changes for the file
                else if (line.Contains("@@"))
                {
                    string changedLine = line.Split(gitChangesSeparator, 2, StringSplitOptions.RemoveEmptyEntries)[0].Trim();
                    string[] resultString =  Regex.Matches(changedLine, @"\d+").OfType<Match>().Select(m => m.Value).ToArray();

                    // @@ -13,11 +13,22 @@ namespace GitFlow
                    int lineOfChange = Int32.Parse(resultString[0]);
                    int numberOfLinesChanged = Int32.Parse(resultString[3]); // TODO This can cause runtime failures when there is only one line of change https://stackoverflow.com/questions/2529441/how-to-read-the-output-from-git-diff

                    MyWindowControl.codeControlInfos[MyWindowControl.currentBranch].StartLine = lineOfChange;
                    MyWindowControl.codeControlInfos[MyWindowControl.currentBranch].EndLine = lineOfChange + numberOfLinesChanged;

                    if (MyWindowControl.controlEditorAdornment != null)
                    {
                        CodeControlEditorAdornment.CreateVisuals(null);
                    }
                }

                MyWindowControl.printInBrowserConsole("Git diff line: " + line);
                gitDiffString += line;
            }
            MyWindowControl.printInBrowserConsole("\n\nGitDiffstring: " + gitDiffString);

            gitDiffProc.WaitForExit();

        }
    }
}
