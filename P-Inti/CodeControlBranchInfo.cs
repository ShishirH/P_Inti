namespace P_Inti
{
    public class CodeControlBranchInfo
    {
        private string id;
        private string parentId;
        private string branchName;
        private int startLine;
        private int endLine;

        public CodeControlBranchInfo(string id, string parentId, string branchName, int startLine, int endLine)
        {
            Id = id;
            ParentId = parentId;
            BranchName = branchName;
            StartLine = startLine;
            EndLine = endLine;
        }

        public string Id { get => id; set => id = value; }
        public string ParentId { get => parentId; set => parentId = value; }
        public string BranchName { get => branchName; set => branchName = value; }
        public int StartLine { get => startLine; set => startLine = value; }
        public int EndLine { get => endLine; set => endLine = value; }
    }
}