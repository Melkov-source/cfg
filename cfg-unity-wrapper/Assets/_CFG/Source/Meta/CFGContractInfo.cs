using System;
using System.Runtime.Serialization;

namespace CFG
{
    [AttributeUsage(AttributeTargets.Class)]
    public class CFGContractAttribute : Attribute
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
    
    [DataContract]
    public class CFGContractInfo
    {
        [DataMember] public int Hash;
        [DataMember] public string Name;
        [DataMember] public string Description;
        [DataMember] public CFGMemberInfo[] Members;
    }
}