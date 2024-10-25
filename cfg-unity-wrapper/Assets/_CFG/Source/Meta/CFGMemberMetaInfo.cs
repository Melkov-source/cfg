using System.Runtime.Serialization;

namespace CFG
{
    [DataContract]
    public class CFGMemberMetaInfo
    {
        [DataMember] public string Name;
        [DataMember] public string Description;
        [DataMember] public CFG_MEMBER_TYPE FieldType;
        [DataMember] public CFG_MEMBER_TYPE FirstElementFieldType; // Used only array, list
        [DataMember] public int LinkContractHash;
        [DataMember] public object DefaultValue;
    }
}