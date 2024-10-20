using UnityEngine;

namespace CFG
{
    [CreateAssetMenu(menuName = "CFG/Settings", fileName = "CFGSettings")]
    public class CFGSettings : ScriptableObject
    {
        [field: SerializeField] public string CFGAddress { get; private set; } = "127.0.0.1";
        [field: SerializeField] public int CFGPort { get; private set; } = 7777;
        [field: SerializeField] public string CFGGameToken { get; private set; } = "";
        [field: SerializeField] public CFG_MODE_TYPE CFGMode { get; private set; } = CFG_MODE_TYPE.ONLY_START;
    }
}