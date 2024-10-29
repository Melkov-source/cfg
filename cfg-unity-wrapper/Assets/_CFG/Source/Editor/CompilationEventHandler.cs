using System;
using System.Reflection;
using System.Threading;
using UnityEditor;
using UnityEngine;

namespace CFG
{
    [InitializeOnLoad]
    public class CompilationEventHandler
    {
        static CompilationEventHandler()
        {
            AssemblyReloadEvents.beforeAssemblyReload += OnBeforeAssemblyReload; 
            AssemblyReloadEvents.afterAssemblyReload += OnAfterAssemblyReload; 
        }

        private static void OnBeforeAssemblyReload()
        {
            Debug.Log("Перед перекомпиляцией");
        }

        private static void OnAfterAssemblyReload()
        {
            Debug.Log("После перекомпиляции");

            var cts = new CancellationTokenSource();
            
            var assemblies = AppDomain.CurrentDomain.GetAssemblies();

            
            CFGConfig.PushConfigsMeta(cts.Token, assemblies);
        }
    }
}


