using System.Collections.Generic;
using System.Reflection;
using CFG;
using UnityEngine;

namespace _Sandbox.Source
{
    [CFGConfig(Name = "TestCFG", Description = "Testing cfg...", Group = "Test")]
    public class TestConfig : IConfig
    {
        [CFGMember(Description = "This is simple number")]
        public int Number;
        
        [CFGMember] public string Text;
        
        [CFGMember(Name = "Boolean Value")] 
        public bool Flag;

        [CFGMember(Name = "Popf Vasya")] 
        public Vasya Popf;
        
        [CFGMember] public Test Test;
        
        [CFGMember] public Test[] Container;

        public IConfig GetDefaultConfig()
        {
            return new TestConfig
            {
                Number = 10,
                Text = "Hello World",
                Flag = true,
                Popf = new Vasya(),
                Test = new Test
                {
                    Number2 = 5
                },
                Container = new []
                {
                    new Test
                    {
                        Number2 = 10
                    },
                    new Test
                    {
                        Number2 = 12
                    }
                }
            };
        }
    }

    [CFGContract(Name = "TestNew")]
    public class Test
    {
        [CFGMember(Description = "Number 2 for example!")] 
        public int Number2;
    }
    
    [CFGContract(Name = "TestNew")]
    public class Vasya
    {
        [CFGMember(Description = "Number 2 for example!")] 
        public List<Test> TestField;
        [CFGMember(Description = "Number 2 for example!")] 
        public float TestField1;
        [CFGMember(Description = "Number 2 for example!")] 
        public int TestField2;
        [CFGMember(Description = "Number 2 for example!")] 
        public string TestField3;
        [CFGMember(Description = "Number 2 for example!")] 
        public Test TestField4;
        [CFGMember(Description = "Number 2 for example!")] 
        public Test TestField5;
    }
    
    public class SandboxManager : MonoBehaviour
    {
        private async void Start()
        {
            var assembly = Assembly.GetExecutingAssembly();

            await CFGConfig.PushConfigsMeta(destroyCancellationToken, assembly);

            /*await CFGConfig.InitializeAsync(destroyCancellationToken, assembly);

            var config = CFGConfig.Get<TestConfig>();

            var instance = config.Value;

            Debug.Log(instance.Number);
            Debug.Log(instance.Text);
            Debug.Log(instance.Flag);
            Debug.Log(instance.Test.Number2);

            config.On((old_value, new_value) =>
            {
                Debug.Log($"Change config: old - {JsonUtility.ToJson(old_value)}, new - {JsonUtility.ToJson(new_value)}");
            });

            CFGConfig.OnConfigChangedHandle(CFGConfig.Hash(typeof(TestConfig)), new TestConfig
            {
                Number = 555,
                Flag = false,
                Test = null,
                Text = "HUI"
            });*/
        }
    }
}