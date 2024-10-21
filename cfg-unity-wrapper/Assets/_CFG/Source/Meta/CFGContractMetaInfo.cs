using System.Runtime.Serialization;

namespace CFG
{
    [DataContract]
    public class CFGContractMetaInfo
    {
        [DataMember] public int Hash;
        [DataMember] public string Name;
        [DataMember] public string Description;
        [DataMember] public CFGMemberMetaInfo[] Members;
    }
}