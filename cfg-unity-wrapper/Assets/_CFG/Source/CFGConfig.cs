using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using UnityEngine;

namespace CFG
{
    public enum CFG_MODE_TYPE
    {
        ONLY_DEFAULT = 0,
        ONLY_START = 1,
        EVERY_CHANGE = 2
    }

    public interface IConfig
    {
        public IConfig GetDefaultConfig();
    }

    public static class CFGConfig
    {
        private static CFGClient _client;
        private static CFGSettings _settings;

        private static Dictionary<int, object> _cfgBsConfigs;
        private static Dictionary<int, MethodInfo> _cfgBsConfigNextMethodCashed;

        public static async Task InitializeAsync(CancellationToken token, params Assembly[] assemblies)
        {
            _settings = Resources.Load<CFGSettings>("CFGSettings");

            ReflectConfigsBehaviours(assemblies);

            if (_settings.CFGMode >= CFG_MODE_TYPE.ONLY_START)
            {
                await FetchAsync(token);
            }

            switch (_settings.CFGMode)
            {
                case CFG_MODE_TYPE.EVERY_CHANGE:
                    _client = new CFGClient
                    (
                        _settings.CFGAddress,
                        _settings.CFGPort,
                        _settings.CFGGameToken
                    );

                    _client.OnChanged += OnConfigChangedHandle;

                    _client.Connect();
                    break;

                case CFG_MODE_TYPE.ONLY_DEFAULT:
                default:
                    Debug.Log("Configs witch default values");
                    break;
            }
        }

        public static async Task PushConfigsMeta(CancellationToken token, params Assembly[] assemblies)
        {
            _settings = Resources.Load<CFGSettings>("CFGSettings");

            var meta_info_configs = new List<CFGConfigInfo>();

            var configs_types = GetAllConfigsTypes(assemblies);

            for (int index_1 = 0, count_1 = configs_types.Count; index_1 < count_1; index_1++)
            {
                CFGContractInfo config_contract = default;

                var config_type = configs_types[index_1];
                var hash = Hash(config_type);

                var cfg_config_attribute = config_type.GetCustomAttribute<CFGConfigAttribute>();

                if (cfg_config_attribute == default)
                {
                    Debug.LogWarning($"CFG Config not found CFGConfigAttribute. Type: {config_type.FullName}");
                    continue;
                }

                var contracts = CreateContractsInfoByType(config_type, cfg_config_attribute);

                var once_contracts = new List<CFGContractInfo>();

                for (int index = 0, count = contracts.Count; index < count; index++)
                {
                    var contract = contracts[index];

                    if (hash.Equals(contract.Hash))
                    {
                        config_contract = contract;

                        continue;
                    }

                    var find_contract = once_contracts.Find(c => c.Hash.Equals(contract.Hash));

                    if (find_contract == default)
                    {
                        once_contracts.Add(contract);
                    }
                }

                if (config_contract == default)
                {
                    throw new Exception($"Not found CFGConfigAttribute on config type: {config_type.FullName}");
                }

                var meta_info_config = new CFGConfigInfo
                {
                    Hash = hash,
                    Name = config_contract.Name,
                    Description = config_contract.Description,
                    Group = cfg_config_attribute.Group,
                    Members = config_contract.Members,
                    Contracts = once_contracts.ToArray()
                };

                meta_info_configs.Add(meta_info_config);
            }

            await CFGApi.PushConfigsMeta
            (
                token,
                meta_info_configs.ToArray(),
                _settings.CFGGameToken
            );
        }
        
        public static async Task FetchAsync(CancellationToken token)
        {
            var configs = await CFGApi.GetConfigsAsync(token, _settings.CFGGameToken);

            for (int index = 0, count = configs.Count; index < count; index++)
            {
                var config = configs[index];

                var type = config.GetType();

                var hash = Hash(type);

                var cfg_bs_config = _cfgBsConfigs[hash];
                var next_method = _cfgBsConfigNextMethodCashed[hash];

                var args = new object[]
                {
                    config
                };

                next_method.Invoke(cfg_bs_config, args);
            }
        }

        public static CFGBehaviourSubject<TConfig> Get<TConfig>() where TConfig : IConfig
        {
            var type = typeof(TConfig);
            var hash = Hash(type);

            if (_cfgBsConfigs.TryGetValue(hash, out var cfg_bs_config))
            {
                return (CFGBehaviourSubject<TConfig>)cfg_bs_config;
            }

            return default;
        }

        private static List<CFGContractInfo> CreateContractsInfoByType(Type cfg_contract_type,
            CFGContractAttribute attribute)
        {
            var contracts = new List<CFGContractInfo>();
            var members = new List<CFGMemberInfo>();

            const BindingFlags BINDING_FLAGS = BindingFlags.Public | BindingFlags.Instance;

            var fields = cfg_contract_type.GetFields(BINDING_FLAGS);

            for (int index = 0, count = fields.Length; index < count; index++)
            {
                var field = fields[index];
                var cfg_member_attribute = field.GetCustomAttribute<CFGMemberAttribute>();

                if (cfg_member_attribute == default)
                {
                    Debug.LogWarning($"CFG Config not found CFGMemberAttribute. Type: {cfg_contract_type.FullName}");
                    continue;
                }

                var member_type = GetMemberType(field.FieldType);

                if (member_type == CFG_MEMBER_TYPE.NONE)
                {
                    throw new Exception($"Not found type for member handel: {field.FieldType.FullName}");
                }

                var meta_info_member = new CFGMemberInfo
                {
                    Name = cfg_member_attribute.Name ?? field.Name,
                    Description = cfg_member_attribute.Description,
                    Type = member_type
                };

                members.Add(meta_info_member);

                if (field.FieldType.IsArray || (field.FieldType.IsGenericType &&
                                                field.FieldType.GetGenericTypeDefinition() == typeof(List<>)))
                {
                    var element_type = field.FieldType.IsArray
                        ? field.FieldType.GetElementType()
                        : field.FieldType.GenericTypeArguments[0];

                    var contract_attribute = element_type?.GetCustomAttribute<CFGContractAttribute>();

                    if (contract_attribute == null)
                    {
                        continue;
                    }

                    var sub_contracts = CreateContractsInfoByType(element_type, contract_attribute);

                    contracts.AddRange(sub_contracts);

                    var element_member_type = GetMemberType(element_type);

                    if (element_member_type == CFG_MEMBER_TYPE.OBJECT)
                    {
                        meta_info_member.LinkContractHash = Hash(element_type);
                    }
                }
                else
                {
                    var cfg_contract_attribute = field.FieldType.GetCustomAttribute<CFGContractAttribute>();

                    if (cfg_contract_attribute == null)
                    {
                        continue;
                    }

                    var meta_info_sub_contract = CreateContractsInfoByType(field.FieldType, cfg_contract_attribute);

                    contracts.AddRange(meta_info_sub_contract);

                    if (member_type == CFG_MEMBER_TYPE.OBJECT)
                    {
                        meta_info_member.LinkContractHash = Hash(field.FieldType);
                    }
                }
            }

            var root_contract = new CFGContractInfo
            {
                Hash = Hash(cfg_contract_type),
                Name = attribute.Name,
                Description = attribute.Description,
                Members = members.ToArray(),
            };

            contracts.Add(root_contract);

            return contracts;
        }

        private static CFG_MEMBER_TYPE GetMemberType(Type type)
        {
            if (type == typeof(string)) return CFG_MEMBER_TYPE.STRING;
            if (type == typeof(int)) return CFG_MEMBER_TYPE.NUMBER_INTEGER;
            if (type == typeof(float)) return CFG_MEMBER_TYPE.NUMBER;
            if (type == typeof(bool)) return CFG_MEMBER_TYPE.BOOLEAN;

            if (type.GetCustomAttribute<CFGContractAttribute>() != default)
                return CFG_MEMBER_TYPE.OBJECT;

            if (type.IsArray || (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(List<>)))
                return CFG_MEMBER_TYPE.ARRAY_OR_LIST;

            return CFG_MEMBER_TYPE.NONE;
        }

        private static List<Type> GetAllConfigsTypes(Assembly[] assemblies)
        {
            var interface_type = typeof(IConfig);

            var all_types = new List<Type>();
            var configs_types = new List<Type>();

            for (int index = 0, count = assemblies.Length; index < count; index++)
            {
                var assembly = assemblies[index];

                var types = assembly.GetTypes();

                all_types.AddRange(types);
            }

            for (int index = 0, count = all_types.Count; index < count; index++)
            {
                var type = all_types[index];

                if (type.GetInterfaces().Contains(interface_type) == false)
                {
                    continue;
                }

                configs_types.Add(type);
            }

            return configs_types;
        }

        private static void ReflectConfigsBehaviours(Assembly[] assemblies)
        {
            _cfgBsConfigs = new Dictionary<int, object>();
            _cfgBsConfigNextMethodCashed = new Dictionary<int, MethodInfo>();

            var all_types = GetAllConfigsTypes(assemblies);


            for (int index = 0, count = all_types.Count; index < count; index++)
            {
                var type = all_types[index];

                var hash = Hash(type);

                var config = (IConfig)Activator.CreateInstance(type);

                var default_config = config.GetDefaultConfig();

                var cfg_bs_generic_type = typeof(CFGBehaviourSubject<>).MakeGenericType(type);

                var behaviour_subject = Activator.CreateInstance(cfg_bs_generic_type, default_config);

                const BindingFlags BINDING_FLAGS = BindingFlags.Default | BindingFlags.Instance | BindingFlags.Public;

                var next_method = cfg_bs_generic_type.GetMethod("Next", BINDING_FLAGS)!;

                _cfgBsConfigNextMethodCashed[hash] = next_method;

                _cfgBsConfigs[hash] = behaviour_subject;
            }
        }

        public static int Hash(Type type)
        {
            var text = type.FullName;

            unchecked
            {
                var hash = 0x811c9dc5;
                const uint PRIME = 0x1000193;

                for (int index = 0, count = text.Length; index < count; ++index)
                {
                    var value = (byte)text[index];

                    hash ^= value;
                    hash *= PRIME;
                }

                return (int)hash;
            }
        }

        private static void OnConfigChangedHandle(int hash, IConfig config)
        {
            if (_cfgBsConfigs.TryGetValue(hash, out var config_behaviour_subject) == false)
            {
                Debug.LogWarning($"Not found config for target hash: {hash}");
                return;
            }

            if (_cfgBsConfigNextMethodCashed.TryGetValue(hash, out var next_method) == false)
            {
                Debug.LogWarning($"Not found next method reflection cashed for target hash: {hash}");
                return;
            }

            var args = new object[]
            {
                config
            };

            next_method.Invoke(config_behaviour_subject, args);
        }
    }
}