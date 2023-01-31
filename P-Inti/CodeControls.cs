using System;
using System.Linq;
using System.Diagnostics;
using System.Text.RegularExpressions;
using System.IO;
using static P_Inti.CodeControlJsonResponse;
using System.Collections.Generic;
using Newtonsoft.Json;
using Microsoft.VisualStudio.Text.Editor;
using Microsoft.VisualStudio.Text.Formatting;
using Microsoft.VisualStudio.Text;

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

            MyWindowControl.CurrentBranch = branchName;
            MyWindowControl.CurrentBranchID = branchName;

            MyWindowControl.printInBrowserConsole("Checkout out to new branch " + branchName);
        }

        public static string AddExistingCodeToCodeControl(string text)
        {
            MyWindowControl.printInBrowserConsole("6666 Text is: ");
            MyWindowControl.printInBrowserConsole(text);
            string codeShiftName = MyWindowControl.CurrentCodeControl.Name;
            string codeVariantName = MyWindowControl.CurrentCodeControl.CurrrentActiveBranchName;

            string codeControlText = @"//BEGIN " + codeShiftName + ":" + codeVariantName + "\n"
                + text + @"//END " + codeShiftName + ":" + codeVariantName + "\n";

            MyWindowControl.printInBrowserConsole("6666 Text is now: ");
            MyWindowControl.printInBrowserConsole(codeControlText);
            return codeControlText;
        }

        public static void CheckoutToBranch(string solutionDir,
            string variantIdStr,
            string variantNameStr,
            string codeShiftIdStr)
        {
            string codeControlFilePath = solutionDir.Replace("\"", string.Empty);
            string rootDir = codeControlFilePath + @"\" + "codeShifts";
            string codeControlDir = rootDir + @"\" + codeShiftIdStr;
            string path = codeControlDir + @"\codeShiftContents.json";

            string currentCodeVariantName = MyWindowControl.CurrentCodeControl.CurrrentActiveBranchName;
            MyWindowControl.printInBrowserConsole("currentCodeVariantName \n " + currentCodeVariantName);

            List<int> beginIndexArray = new List<int>();
            List<int> endIndexArray = new List<int>();

            IWpfTextViewLineCollection textViewLines = CodeControlEditorAdornment.view.TextViewLines;
            ITextViewLine activeDocumentContents = textViewLines[0];
            string documentContentsStr = activeDocumentContents.Snapshot.GetText();
            List<string> codeShiftArray = new List<string>();

            int variantPosition = 0;
            string beginString = "//BEGIN " + MyWindowControl.CodeControlInfos[codeShiftIdStr].Name;
            string endString = "//END " + MyWindowControl.CodeControlInfos[codeShiftIdStr].Name;

            for (int index = documentContentsStr.IndexOf(beginString); index > -1; index = documentContentsStr.IndexOf("//BEGIN", index + 1))
            {
                int newLineIndex = documentContentsStr.IndexOf("\n", index + 1);
                string beginSubstring = documentContentsStr.Substring(index, newLineIndex - index);
                string[] codeControlVariantPair = beginSubstring.Split(' ')[1].Trim().Split(':');
                string codeShiftName = codeControlVariantPair[0];

                if (MyWindowControl.CodeControlInfos[codeShiftIdStr].Name == codeShiftName)
                {
                    beginIndexArray.Add(newLineIndex + 1);
                    MyWindowControl.printInBrowserConsole("beginIndexArray \n " + newLineIndex + 1);
                }
            }

            for (int index = documentContentsStr.IndexOf(endString); index > -1; index = documentContentsStr.IndexOf("//END", index + 1))
            {
                int newLineIndex = documentContentsStr.LastIndexOf("\n", index, 40);
                endIndexArray.Add(newLineIndex);
                MyWindowControl.printInBrowserConsole("endIndexArray \n " + endIndexArray);
            }

            // TODO Very error prone code requiring multiple layers of validations.
            CodeControlEditorAdornment.wereLinesUpdated = false;
            CodeControlJsonResponse codeControlJsonResponse;
            BranchInfo branchInfo = null;
            using (StreamReader r = new StreamReader(path))
            {
                string json = r.ReadToEnd();
                codeControlJsonResponse = JsonConvert.DeserializeObject<CodeControlJsonResponse>(json);

                foreach (BranchInfo variantInfo in codeControlJsonResponse.branchInfo)
                {
                    if (variantInfo.codeVariantId == variantIdStr)
                    {
                        branchInfo = variantInfo;
                        break;
                    }
                }
            }

            int codeVariantIndex = 0;
            for (int i = 0; i < beginIndexArray.Count; i++)
            {
                int startIndex = beginIndexArray[i];
                int endIndex = endIndexArray[i];

                ITextBuffer textBuffer = CodeControlEditorAdornment.view.TextBuffer;
                SnapshotSpan span = new SnapshotSpan(CodeControlEditorAdornment.view.TextSnapshot, Span.FromBounds(startIndex, endIndex));

                string contents = branchInfo.codeVariantContents[i].codeVariantFileContents[0];
                MyWindowControl.currentDispatcher.Invoke(new Action(() =>
                {
                    textBuffer.Replace(span, contents);
                }));

            }

            MyWindowControl.printInBrowserConsole("Replacing " + currentCodeVariantName + " with " + variantNameStr);
            documentContentsStr = CodeControlEditorAdornment.view.TextViewLines[0].Snapshot.GetText();

            for (int index = documentContentsStr.IndexOf(currentCodeVariantName); index > -1; index = documentContentsStr.IndexOf(currentCodeVariantName, index + 1))
            {
                ITextBuffer textBuffer = CodeControlEditorAdornment.view.TextBuffer;
                SnapshotSpan span = new SnapshotSpan(CodeControlEditorAdornment.view.TextSnapshot, Span.FromBounds(index, index + currentCodeVariantName.Length));
                MyWindowControl.currentDispatcher.Invoke(new Action(() =>
                {
                    textBuffer.Replace(span, variantNameStr);
                }));
                documentContentsStr = CodeControlEditorAdornment.view.TextViewLines[0].Snapshot.GetText();
            }

            // Save current edited file
            File.WriteAllText(Utils.programCS, documentContentsStr);

            MyWindowControl.printInBrowserConsole("Updating active branch to: " + variantNameStr);
            MyWindowControl.CurrentCodeControl.CurrrentActiveBranchName = variantNameStr;
            MyWindowControl.CurrentCodeControl.CurrentActiveBranchId = variantIdStr;

            CodeControlEditorAdornment.wereLinesUpdated = true;
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

        public static void ParseGitDiff(string solutionDir, string branchName, string id)
        {
            string command = "(git -C " + solutionDir + " diff -p --stat) | findstr '@@ --git'";
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
                    linesChangedString = line.Split(gitChangesSeparator, 2, StringSplitOptions.RemoveEmptyEntries)[0].Trim();
                    string[] resultString =  Regex.Matches(linesChangedString, @"\d+").OfType<Match>().Select(m => m.Value).ToArray();

                    // @@ -13,11 +13,22 @@ namespace GitFlow
                    int lineOfChange = Int32.Parse(resultString[0]) + 2; // TODO Why are we adding two here?
                    int numberOfLinesChanged = Int32.Parse(resultString[3]); // TODO This can cause runtime failures when there is only one line of change https://stackoverflow.com/questions/2529441/how-to-read-the-output-from-git-diff

                    if (numberOfLinesChanged == Int32.Parse(resultString[1]))
                    {
                        numberOfLinesChanged = 0;
                    }

                    CodeControlBranchInfo codeControlBranchInfo = new CodeControlBranchInfo(id, MyWindowControl.CurrentCodeControl.Id, branchName, lineOfChange, lineOfChange + numberOfLinesChanged);
                    MyWindowControl.CurrentCodeControl.CodeControlBranches.Add(id, codeControlBranchInfo);

                    if (MyWindowControl.controlEditorAdornment != null)
                    {
                        MyWindowControl.currentDispatcher.Invoke(new Action(() =>
                        {
                            CodeControlEditorAdornment.CreateEditorVisuals(null);
                        }));
                    }
                }

                MyWindowControl.printInBrowserConsole("Git diff line: " + line);
                gitDiffString += line;
            }
            MyWindowControl.printInBrowserConsole("\n\nGitDiffstring: " + gitDiffString);

            gitDiffProc.WaitForExit();

        }

        public static void InitializeJsonFile(string idStr, string branchIdStr, string codeControlFilePath)
        {
            codeControlFilePath = codeControlFilePath.Replace("\"", string.Empty);
            string rootDir = codeControlFilePath + @"\" + "codeShifts";
            string codeControlDir = rootDir + @"\" + idStr;
            string path = codeControlDir + @"\codeShiftContents.json";
            MyWindowControl.printInBrowserConsole("rootDir: " + rootDir);
            MyWindowControl.printInBrowserConsole("codeControlDir: " + codeControlDir);
            MyWindowControl.printInBrowserConsole("CodeControlFilePath: " + path);

            System.IO.Directory.CreateDirectory(rootDir);
            System.IO.Directory.CreateDirectory(codeControlDir);
            
            if (!File.Exists(path))
            {
                CodeControlJsonResponse root = new CodeControlJsonResponse()
                {
                    projectHashCode = "",
                    branchInfo = new List<BranchInfo>()
                };

                BranchInfo branchInfo = new BranchInfo()
                {
                    codeVariantId = branchIdStr,
                    codeVariantContents = new List<CodeVariantContent>()
                };

                CodeVariantContent codeVariantContent = new CodeVariantContent()
                {
                    filePath = "",
                    codeVariantFileContents = new List<string>()
                };

                branchInfo.codeVariantContents.Add(codeVariantContent);
                root.branchInfo.Add(branchInfo);

                string json = JsonConvert.SerializeObject(root, Formatting.Indented);

                File.WriteAllText(path, json);
            }
        }

        public static void UpdateJson(string variantNameStr, string idStr, string codeShiftIdStr, string solutionDir)
        {
            string codeControlFilePath = solutionDir.Replace("\"", string.Empty);
            string rootDir = codeControlFilePath + @"\" + "codeShifts";
            string codeControlDir = rootDir + @"\" + codeShiftIdStr;
            string path = codeControlDir + @"\codeShiftContents.json";

            IWpfTextViewLineCollection textViewLines = CodeControlEditorAdornment.view.TextViewLines;
            ITextViewLine activeDocumentContents = textViewLines[0];
            string documentContentsStr = activeDocumentContents.Snapshot.GetText();
            List<string> codeShiftArray = new List<string>();

            int variantPosition = 0;
            for (int index = documentContentsStr.IndexOf("//BEGIN"); index > -1; index = documentContentsStr.IndexOf("//BEGIN", index + 1))
            {
                int newLineIndex = documentContentsStr.IndexOf("\n", index + 1);
                string beginSubstring = documentContentsStr.Substring(index, newLineIndex - index);
                string[] codeControlVariantPair = beginSubstring.Split(' ')[1].Trim().Split(':');
                string codeShiftName = codeControlVariantPair[0];
                string codeVariantName = codeControlVariantPair[1];

                if (MyWindowControl.CodeControlInfos[codeShiftIdStr].Name == codeShiftName)
                {
                    // get contents
                    string contents = documentContentsStr.Substring(newLineIndex + 1, documentContentsStr.IndexOf("//END", newLineIndex + 1) - (newLineIndex + 1)).TrimEnd();
                    MyWindowControl.printInBrowserConsole("contents between begin and end are: \n " + contents);
                    codeShiftArray.Add(contents);
                }
            }

            string jsonOutput = "";
            using (StreamReader r = new StreamReader(path))
            {
                string json = r.ReadToEnd();
                MyWindowControl.printInBrowserConsole("json response: \n " + json);
                CodeControlJsonResponse codeControlJsonResponse = JsonConvert.DeserializeObject<CodeControlJsonResponse>(json);

                List<CodeVariantContent> codeVariantContents = new List<CodeVariantContent>();

                foreach(string codeVariantContent in codeShiftArray)
                {
                    CodeVariantContent codeVariant = new CodeVariantContent();
                    codeVariant.codeVariantFileContents = new List<string>();

                    codeVariant.filePath = "";
                    codeVariant.codeVariantFileContents.Add(codeVariantContent);
                    codeVariantContents.Add(codeVariant);
                }

                bool wasBranchFound = false;
                foreach (BranchInfo branchInfo in codeControlJsonResponse.branchInfo)
                {
                    MyWindowControl.printInBrowserConsole("branchId: \n " + branchInfo.codeVariantId);
                    MyWindowControl.printInBrowserConsole("idStr: \n " + idStr);
                    if (branchInfo.codeVariantId == idStr)
                    {
                        wasBranchFound = true;
                        branchInfo.codeVariantContents = codeVariantContents;
                        break;
                    }
                }

                // New branch was created. Create an entry
                if (!wasBranchFound)
                {
                    BranchInfo branchInfo = new BranchInfo()
                    {
                        codeVariantId = idStr,
                        codeVariantContents = codeVariantContents
                    };

                    codeControlJsonResponse.branchInfo.Add(branchInfo);
                }

                jsonOutput = JsonConvert.SerializeObject(codeControlJsonResponse, Formatting.Indented);
            }
            File.WriteAllText(path, jsonOutput);
        }
    }
}
