using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using UnityEngine;

namespace CFG
{
    public static class CFGApi
    {
        public static Task<List<IConfig>> GetConfigsAsync(CancellationToken token, string game_token)
        {
            return Task.FromResult(new List<IConfig>( ));
        }

        public static Task PushConfigsMeta(CancellationToken token, CFGConfigInfo[] cfg_configs_info, string game_token)
        {
            var json = JsonConvert.SerializeObject(cfg_configs_info, Formatting.Indented);
            
            Debug.Log(json);
            return Task.CompletedTask;
        }
    }
}