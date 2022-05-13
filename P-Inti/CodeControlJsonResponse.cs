using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P_Inti
{
    public class CodeControlJsonResponse
    {
        // Root myDeserializedClass = JsonConvert.DeserializeObject<CodeControlJsonResponse>(myJsonResponse);
        public List<Shift> shifts { get; set; }
        
        public class Shift
        {
            public string id { get; set; }
            public List<string> changes { get; set; }
        }


    }
}
