using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P_Inti
{
    // Root myDeserializedClass = JsonConvert.DeserializeObject<CodeControlJsonResponse>(myJsonResponse);
    public class CodeControlJsonResponse
    {
        public string projectHashCode { get; set; }
        public List<BranchInfo> branchInfo { get; set; }

    }
    public class BranchInfo
    {
        public string codeVariantId { get; set; }
        public List<CodeVariantContent> codeVariantContents { get; set; }
    }

    public class CodeVariantContent
    {
        public string filePath { get; set; }
        public List<string> codeVariantFileContents { get; set; }
    }
}
