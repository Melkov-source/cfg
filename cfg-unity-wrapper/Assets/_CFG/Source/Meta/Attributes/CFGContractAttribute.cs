using System;

namespace CFG
{
    [AttributeUsage(AttributeTargets.Class)]
    public class CFGContractAttribute : Attribute
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
}