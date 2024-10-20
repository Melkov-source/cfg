using System;
using System.Runtime.Serialization;

namespace CFG
{
    [AttributeUsage(AttributeTargets.Field)]
    public class CFGMemberAttribute : Attribute
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
    
    [DataContract]
    public class CFGMemberInfo
    {
        [DataMember] public string Name;
        [DataMember] public string Description;
        [DataMember] public CFG_MEMBER_TYPE Type;
        [DataMember] public int LinkContractHash;
    }

    public enum CFG_MEMBER_TYPE
    {
        NONE = 0,
        STRING = 1,
        NUMBER_INTEGER = 2,
        NUMBER = 3,
        ARRAY_OR_LIST = 4,
        DICTIONARY = 5,
        BOOLEAN = 6,
        OBJECT = 7
    }
}