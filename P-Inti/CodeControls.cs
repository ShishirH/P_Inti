using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;

namespace P_Inti
{
    class CodeControls
    {
        public static void InitializeGitRepo(string solutionDir)
        {
            MyWindowControl.printInBrowserConsole("git init " + solutionDir);
            var gitInitProc = new System.Diagnostics.Process
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
        }

        public static int GetNumberOfBranches(string solutionDir)
        {
            string command = "(git -C " + solutionDir + " branch -r).Count";
            MyWindowControl.printInBrowserConsole(command);

            var gitBranchesProc = new System.Diagnostics.Process
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

            var gitAddProc = new System.Diagnostics.Process
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
        }

        public static void CommitGitChanges(string solutionDir)
        {
            string command = "git -C " + solutionDir + " commit -m " + "\"CC\"";
            MyWindowControl.printInBrowserConsole(command);

            var gitCommitProc = new System.Diagnostics.Process
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
        }

        public static void CreateAndCheckoutGitBranch(string solutionDir)
        {
            string command = "git -C " + solutionDir + " checkout -b sample_branch";
            MyWindowControl.printInBrowserConsole(command);

            var gitCheckoutProc = new System.Diagnostics.Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = command,
                    UseShellExecute = false,
                    RedirectStandardOutput = false,
                    CreateNoWindow = true
                }
            };

            gitCheckoutProc.Start();
            gitCheckoutProc.WaitForExit();
        }

        public static void CheckoutToBranch(string solutionDir, string branch)
        {
            string command = "git -C " + solutionDir + " checkout " + branch;
            MyWindowControl.printInBrowserConsole(command);

            var gitCheckoutProc = new System.Diagnostics.Process
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

    }
}
