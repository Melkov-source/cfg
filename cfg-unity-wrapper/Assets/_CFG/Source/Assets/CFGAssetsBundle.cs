using System.Collections.Generic;

namespace CFG
{
    public class CFGAssetsBundle
    {
        private Dictionary<int, ICFGAsset> _assets;

        public CFGAssetsBundle(Dictionary<int, ICFGAsset> assets = default)
        {
            if (assets == default)
            {
                return;
            }
            
            
            _assets = assets;
        }

        public void Add(ICFGAsset asset)
        {
            _assets.Add(asset.Id, asset);
        }

        public void Remove(ICFGAsset asset)
        {
            _assets.Remove(asset.Id);
        }

        public static void Build(CFGAssetsBundle cfgAssetsBundle)
        {
        }
    }
}