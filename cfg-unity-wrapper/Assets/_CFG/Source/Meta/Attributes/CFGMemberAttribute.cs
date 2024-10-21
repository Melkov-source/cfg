using System;

namespace CFG
{
    [AttributeUsage(AttributeTargets.Field)]
    public class CFGMemberAttribute : Attribute
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
}