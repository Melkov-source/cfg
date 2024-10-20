using System;
using System.Runtime.Serialization;

namespace CFG
{
    [AttributeUsage(AttributeTargets.Class)]
    public class CFGConfigAttribute : CFGContractAttribute
    {
        [DataMember] public string Group;
    }
    
    public class CFGConfigInfo : CFGContractInfo
    {
        [DataMember] public string Group;
        [DataMember] public CFGContractInfo[] Contracts;
    }
}