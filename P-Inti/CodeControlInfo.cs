using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;

namespace P_Inti
{
    public class CodeControlInfo
    {
        private string id;
        private string name;
        private Color saturatedColor;
        private Color unsaturatedColor;
        private string currrentActiveBranchName;
        private string currentActiveBranchId;
        private Dictionary<string, CodeControlBranchInfo> codeControlBranches = new Dictionary<string, CodeControlBranchInfo>();

        public CodeControlInfo(string id, Color saturatedColor, Color unsaturatedColor, string currrentActiveBranchName, string currentActiveBranchId, Dictionary<string, CodeControlBranchInfo> codeControlBranches)
        {
            Id = id;
            SaturatedColor = saturatedColor;
            UnsaturatedColor = unsaturatedColor;
            CurrrentActiveBranchName = currrentActiveBranchName;
            CurrentActiveBranchId = currentActiveBranchId;
            CodeControlBranches = codeControlBranches;
        }

        public CodeControlInfo(string id, Color saturatedColor, Color unsaturatedColor, string currrentActiveBranchName, string currentActiveBranchId)
        {
            Id = id;
            SaturatedColor = saturatedColor;
            UnsaturatedColor = unsaturatedColor;
            CurrrentActiveBranchName = currrentActiveBranchName;
            CurrentActiveBranchId = currentActiveBranchId;
        }

        public Color SaturatedColor { get => saturatedColor; set => saturatedColor = value; }
        public Color UnsaturatedColor { get => unsaturatedColor; set => unsaturatedColor = value; }
        public string Id { get => id; set => id = value; }
        public string Name { get => name; set => name = value; }
        public string CurrrentActiveBranchName { get => currrentActiveBranchName; set => currrentActiveBranchName = value; }
        public string CurrentActiveBranchId { get => currentActiveBranchId; set => currentActiveBranchId = value; }
        public Dictionary<string, CodeControlBranchInfo> CodeControlBranches { get => codeControlBranches; set => codeControlBranches = value; }
    }
}
