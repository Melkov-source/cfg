using System;
using UnityEngine;
using WebSocketSharp;

namespace CFG
{
    public class CFGClient
    {
        public delegate void OnConfigChanged(int hash, IConfig config);

        public event OnConfigChanged OnChanged;
        
        private readonly WebSocket _webSocket;

        public CFGClient(string ip, int port, string token)
        {
            var host = $"ws://{ip}:{port}/{token}";
            
            _webSocket = new WebSocket(host);
        }
        
        public void Connect()
        {
            _webSocket.OnOpen += OnOpen;
            _webSocket.OnMessage += OnMessage;
            _webSocket.OnClose += OnClose;

            _webSocket.Connect();
        }

        public void Disconnect()
        {
            _webSocket.OnOpen += OnOpen;
            _webSocket.OnMessage += OnMessage;
            _webSocket.OnClose += OnClose;

            _webSocket.Close();
            Debug.Log("Соединение закрыто");
        }

        private void OnOpen(object sender, EventArgs @event)
        {
            Debug.Log("Соединение установлено");
        }
        
        private void OnMessage(object sender, MessageEventArgs @event)
        {
            Debug.Log("Получено сообщение от сервера: " + @event.Data);
        }
        
        private void OnClose(object sender, CloseEventArgs @event)
        {
            Debug.Log("Соединение закрыто");
        }
    }
}