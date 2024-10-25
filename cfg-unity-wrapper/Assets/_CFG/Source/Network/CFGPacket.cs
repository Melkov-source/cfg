using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;

namespace CFG
{
    public interface ICFGPacket
    {
        
    }
    
    public class CFGPacket
    {
        public interface IBinaryConverter
        {
            public Type Type { get; }
            public void Write(BinaryWriter writer, object value);
            public object Read(BinaryReader reader);
        }
        
        private static readonly Dictionary<int, Type> _packetTypes = new();
        private static readonly Dictionary<Type, IBinaryConverter> _binaryConverters = new();
        
        public static void RegisterBinaryConverter(IBinaryConverter converter)
        {
            _binaryConverters.Add(converter.Type, converter);
        }
        
        public static void Reflect()
        {
            var interface_type = typeof(ICFGPacket);

            var assembly = Assembly.GetExecutingAssembly();
            var types = assembly.GetTypes();

            for (int index = 0, count = types.Length; index < count; index++)
            {
                var type = types[index];

                if (type.GetInterfaces().Contains(interface_type) == false)
                {
                    continue;
                }
                
                var hash = Hash(type.FullName);
                    
                _packetTypes.Add(hash, type);
            }
        }

        private static int Hash(string text)
        {
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
        
        public static byte[] Write<TPacket>(TPacket packet) where TPacket : ICFGPacket
        {
            var type = typeof(TPacket);
            var fields = type.GetFields(BindingFlags.Instance | BindingFlags.Public);

            var stream = new MemoryStream();

            using (var binary_writer = new BinaryWriter(stream))
            {
                var hash = Hash(type.FullName);
                binary_writer.Write(hash);
                
                foreach (var field in fields)
                {
                    var value = field.GetValue(packet);

                    if (_binaryConverters.TryGetValue(field.FieldType, out var converter) == false)
                    {
                        throw new Exception($"Not found converter for type: {field.FieldType.FullName}");
                    }

                    converter.Write(binary_writer, value);
                }
            }

            return stream.ToArray();
        }

        public static ICFGPacket Read(byte[] data)
        {
            var stream = new MemoryStream(data);
            var binary_reader = new BinaryReader(stream);
            
            var hash = binary_reader.ReadInt32();

            var type = _packetTypes[hash];

            var packet = Activator.CreateInstance(type);
            
            var public_fields = type.GetFields(BindingFlags.Instance | BindingFlags.Public);

            foreach (var field in public_fields)
            {
                if (_binaryConverters.TryGetValue(field.FieldType, out var converter) == false)
                {
                    throw new Exception($"Not found converter for type: {field.FieldType.FullName}");
                }

                var value = converter.Read(binary_reader);

                field.SetValue(packet, value);
            }

            return (ICFGPacket)packet;
        }
    }
}