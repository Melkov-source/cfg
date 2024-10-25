using System.Runtime.Serialization;

namespace CFG
{
    public class CFGConfigMetaInfo : CFGContractMetaInfo
    {
        [DataMember] public string Group;
        [DataMember] public CFGContractMetaInfo[] Contracts;
    }
}