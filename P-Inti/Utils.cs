using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;
using System.Windows.Media;
using System.Reflection;
using Microsoft.VisualStudio.Text.Editor;
using EnvDTE;
using EnvDTE80;
using Microsoft.VisualStudio.ComponentModelHost;
using Microsoft.VisualStudio.Editor;
using Microsoft.VisualStudio.Shell;
using Microsoft.VisualStudio.TextManager.Interop;
using Microsoft.VisualStudio.Shell.Interop;
using System.Globalization;
using System.Text.RegularExpressions;

namespace P_Inti
{
    class Utils
    {
        public static Dictionary<string, Tuple<Color, Color>> colorsPerType = new Dictionary<string, Tuple<Color, Color>>() {
            { "True", Tuple.Create<Color, Color>(Colors.LightGreen, Colors.DarkGreen) },
            { "False", Tuple.Create<Color, Color>(Colors.Red, Colors.DarkRed) },
            { "Expression", Tuple.Create<Color, Color>(Colors.LightBlue, Colors.DarkBlue) },
            { "Assignment", Tuple.Create<Color, Color>(Colors.Yellow, Colors.Orange) },
        };

        public static Color glyphStrokeColor = Colors.Orange;
        public static Color glyphFillColor = Colors.Yellow;

        private static Random randomGenerator = new Random();

        public static String generateID()
        {
            Random rnd = new Random();
            return DateTime.Now.ToString("dd_MMMM_yyyy___HH_mm_ss_fff", CultureInfo.InvariantCulture) + "___" + Guid.NewGuid().ToString() + "___" + rnd.Next(0, 10000);
        }

        public static Project GetActiveProject()
        {
            DTE dte = Package.GetGlobalService(typeof(SDTE)) as DTE;
            return GetActiveProject(dte);
        }

        public static Project GetActiveProject(DTE dte)
        {
            Project activeProject = null;
            Array activeSolutionProjects = dte.ActiveSolutionProjects as Array;
            if (activeSolutionProjects != null && activeSolutionProjects.Length > 0)
            {
                activeProject = activeSolutionProjects.GetValue(0) as Project;
            }
            return activeProject;
        }

        public static Brush ramdonBrush()
        {
            Brush brush = Brushes.Transparent;
            Type brushesType = typeof(Brushes);
            PropertyInfo[] properties = brushesType.GetProperties();
            int random = randomGenerator.Next(properties.Length);
            brush = (Brush)properties[random].GetValue(null, null);
            return brush;
        }

        public static IVsTextView GetActiveView()
        {
            var textManager = (IVsTextManager)ServiceProvider.GlobalProvider.GetService(typeof(SVsTextManager));
            textManager.GetActiveView(1, null, out IVsTextView textViewCurrent);
            return textViewCurrent;
        }

        public static IWpfTextView GetWpfView(IVsTextView iVsTextView)
        {
            var componentModel = (IComponentModel)ServiceProvider.GlobalProvider.GetService(typeof(SComponentModel));
            var editor = componentModel.GetService<IVsEditorAdaptersFactoryService>();
            return editor.GetWpfTextView(iVsTextView);
        }

        public static IVsEditorAdaptersFactoryService GetEditor(IVsTextView iVsTextView)
        {
            var componentModel = (IComponentModel)ServiceProvider.GlobalProvider.GetService(typeof(SComponentModel));
            IVsEditorAdaptersFactoryService editor = componentModel.GetService<IVsEditorAdaptersFactoryService>();
            return editor;
        }

        public static IWpfTextView GetWpfView()
        {
            var textManager = (IVsTextManager)ServiceProvider.GlobalProvider.GetService(typeof(SVsTextManager));
            var componentModel = (IComponentModel)ServiceProvider.GlobalProvider.GetService(typeof(SComponentModel));
            var editor = componentModel.GetService<IVsEditorAdaptersFactoryService>();
            textManager.GetActiveView(1, null, out IVsTextView textViewCurrent);
            if (textViewCurrent != null)
            {
                return editor.GetWpfTextView(textViewCurrent);
            }
            return null;
        }

        public static Microsoft.VisualStudio.TextManager.Interop.IVsTextView GetIVsTextView(string filePath, DTE dte)
        {

            Microsoft.VisualStudio.OLE.Interop.IServiceProvider sp = (Microsoft.VisualStudio.OLE.Interop.IServiceProvider)dte;
            ServiceProvider serviceProvider = new ServiceProvider(sp);

            Microsoft.VisualStudio.Shell.Interop.IVsUIHierarchy uiHierarchy;
            uint itemID;
            Microsoft.VisualStudio.Shell.Interop.IVsWindowFrame windowFrame;

            IVsTextView result = null;

            if (Microsoft.VisualStudio.Shell.VsShellUtilities.IsDocumentOpen(serviceProvider, filePath, Guid.Empty, out uiHierarchy, out itemID, out windowFrame))
            {
                // Get the IVsTextView from the windowFrame.
                result = Microsoft.VisualStudio.Shell.VsShellUtilities.GetTextView(windowFrame);
            }

            return result;
        }

        public static void parseRGBColor(string colorStr, out int r, out int g, out int b)
        {
            r = g = b = 0;
            Regex regex = new Regex(@"rgb\((?<r>\d{1,3}),(?<g>\d{1,3}),(?<b>\d{1,3})\)");
            Match match = regex.Match(colorStr);
            if (match.Success)
            {
                r = int.Parse(match.Groups["r"].Value);
                g = int.Parse(match.Groups["g"].Value);
                b = int.Parse(match.Groups["b"].Value);
            }
        }

        public static List<int> AllIndexesOf(string str, string value)
        {
            if (String.IsNullOrEmpty(value))
                throw new ArgumentException("the string to find may not be empty", "value");
            List<int> indexes = new List<int>();
            for (int index = 0; ; index += value.Length)
            {
                index = str.IndexOf(value, index);
                if (index == -1)
                    return indexes;
                indexes.Add(index);
            }
        }


    }
}
