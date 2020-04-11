using System;
using WebSocketSharp;


namespace monitor
{
    public class Reporter
    {
        private WebSocket client;

        public Reporter(string uri)
        {
            client = new WebSocket(uri);
            client.OnOpen += OnOpen;
            client.OnMessage += OnMessage;
            client.OnClose += OnClose;
            client.Connect();
            client.Send("Hello, this is DOTNET");
        }

        private void OnOpen(object sender, EventArgs e)
        {
            Console.WriteLine("WebSocket open!");
        }

        private void OnMessage(object sender, MessageEventArgs e)
        {
            Console.WriteLine($"Received: {e.Data}");
        }

        private void OnClose(object sender, CloseEventArgs e)
        {
            if (client != null)
            {
                ((IDisposable)client).Dispose();
            }
        }
    }
}
