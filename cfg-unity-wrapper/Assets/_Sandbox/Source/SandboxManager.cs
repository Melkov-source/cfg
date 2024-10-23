using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using CFG;
using UnityEditor;
using UnityEngine;
using UnityEngine.Networking;

namespace _Sandbox.Source
{
    /*
     * CFGTable - это атрибут, который можно будет использовать
     * для отображения данных в виде таблицы
     *
     * Испльозвать данный атрибут можно на массивах содержащих обеъкты CFGContract
     */
    
    [CFGConfig]
    public class ItemsConfig
    {
        [CFGMember, CFGTable] public ItemInfo[] Items;
    }
    
    [CFGContract]
    public class ItemInfo
    {
        [CFGMember] public string Name;
        [CFGMember] public string Description;
        [CFGMember] public CFGTexture Icon;
    }
    
    
    
    [CFGConfig(Name = "TestCFG", Description = "Testing cfg...", Group = "Test")]
    public class TestConfig : ICFGConfig
    {
        [CFGMember(Description = "This is simple number")]
        public int Number;

        [CFGMember] public string Text;

        [CFGMember(Name = "Boolean Value")] public bool Flag;

        [CFGMember] public int[] Test2;

        [CFGMember(Name = "Popf Vasya")] public Vasya Popf;

        [CFGMember] public Test Test;

        [CFGMember] public Test[] Container;

        public ICFGConfig GetDefaultConfig()
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
                Test2 = new[]
                {
                    5, 7, 8
                },
                Container = new[]
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
        private string fileUrl = "https://cdn.soft112.com/temp-file-cleaner/00/00/00/CB/000000CBA2/pad_screenshot.png"; // Укажите URL вашего файла
        private string fileName = "pad_screenshot.png"; // Имя файла
        private string localPath;

        private IEnumerator DownloadFile()
        {
            using (UnityWebRequest request = UnityWebRequest.Get(fileUrl))
            {
                var bundleName = "test";
                
                yield return request.SendWebRequest();

                if (request.result != UnityWebRequest.Result.Success)
                {
                    Debug.LogError($"Error downloading file: {request.error}");
                    yield break;
                }

                // Путь для сохранения файла в StreamingAssets
                File.WriteAllBytes(localPath, request.downloadHandler.data);
                Debug.Log($"File downloaded and saved to {localPath}");

                // Создание временного объекта для упаковки в AssetBundle
                GameObject tempObject = new GameObject("MyAsset");
                // Здесь вы можете добавлять компоненты и настраивать объект по необходимости
                // Например, добавление текстуры или другого компонента

                // Упаковка в AssetBundle
                string bundlePath = Path.Combine(Application.temporaryCachePath, bundleName);
                BuildPipeline.BuildAssetBundles(Application.temporaryCachePath, BuildAssetBundleOptions.None, BuildTarget.StandaloneWindows);
                AssetBundleBuild build = new AssetBundleBuild
                {
                    assetBundleName = bundleName,
                    assetNames = new[] { localPath } // Путь к файлу
                };

                // Сохранение AssetBundle в StreamingAssets
                string assetBundlePath = Path.Combine(Application.streamingAssetsPath, bundleName);
                File.Copy(bundlePath, assetBundlePath, true);
                Debug.Log($"AssetBundle created and saved to {assetBundlePath}");

                // Удаление временного объекта
                Destroy(tempObject);
            }
        }
        
        private async void Start()
        {

            await CFGConfig.PushConfigsMeta(destroyCancellationToken, Assembly.GetExecutingAssembly());

            /*localPath = Path.Combine(Application.streamingAssetsPath, fileName);
            StartCoroutine(DownloadFile());*/

            /*var assembly = Assembly.GetExecutingAssembly();

            await CFGConfig.PushConfigsMeta(destroyCancellationToken, assembly);*/

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