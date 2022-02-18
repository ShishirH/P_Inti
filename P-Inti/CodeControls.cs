using System;
using System.Diagnostics;

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
    }
}
