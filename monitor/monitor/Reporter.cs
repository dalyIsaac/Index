using System;
using System.Text.Json;
using Websocket.Client;
using Application = System.Windows.Forms.Application;

namespace monitor
{
    public class Reporter
    {
        private readonly WebsocketClient client;

        public Reporter(string uri)
        {
            client = new WebsocketClient(new Uri(uri));
            client.MessageReceived.Subscribe(OnMessage);
            client.DisconnectionHappened.Subscribe(OnClose);

            client.Start().Wait();
            Console.WriteLine("Reporter WebSocket has started.");
        }

        private void OnMessage(ResponseMessage msg)
        {
            Console.WriteLine($"Received: {msg}");
        }

        public void SendForegroundItem(ForegroundItem item)
        {
            string json = JsonSerializer.Serialize(item);
            client.Send(json);
        }

        public void OnClose(DisconnectionInfo info)
        {
            if (client != null)
            {
                client.Dispose();
            }
            Console.WriteLine("Socket closed");
            Application.Exit();
        }
    }
}
