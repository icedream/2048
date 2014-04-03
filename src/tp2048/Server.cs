using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Windows.Documents;
using Alchemy;
using Alchemy.Classes;
using log4net;
using log4net.Appender;
using log4net.Config;
using log4net.Core;
using log4net.Layout;
using log4net.Repository.Hierarchy;
using Newtonsoft.Json;

namespace Icedream.TwitchPlays2048
{
    class Server
    {
        private readonly ILog _log;

        private readonly WebSocketServer _server;
        private readonly List<UserContext> _clients = new List<UserContext>();

        public Server()
        {
            _log = LogManager.GetLogger("GameConnector");
            _server = new WebSocketServer(19661, IPAddress.Loopback)
            {
                OnConnect = ctx =>
                {
                    _log.InfoFormat("Game client connected: {0}", ctx.ClientAddress);
                    _clients.Add(ctx);
                },
                OnDisconnect = ctx => 
                {
                    _log.InfoFormat("Game client disconnected: {0}", ctx.ClientAddress);
                    _clients.RemoveAll(c => ctx.ClientAddress == c.ClientAddress);
                }
            };
        }

        public void Start()
        {
            _log.InfoFormat("Game connector ready.");
            _server.Start();
        }

        public void BroadcastInput(string issuer, Direction direction)
        {
            var j = JsonConvert.SerializeObject(new { issuer, direction=(int)direction });
            _log.DebugFormat("{0} typed {1}", issuer, direction);
            foreach(var client in _clients)
                client.Send(j);
        }

        static void Main()
        {
            var appender = new ColoredConsoleAppender
            {
                Threshold = Level.All,
                Layout = new PatternLayout("[%d{HH:mm:ss}] <%logger> %level: %message%newline"),
            };
            appender.AddMapping(new ColoredConsoleAppender.LevelColors { Level = Level.Debug, ForeColor = ColoredConsoleAppender.Colors.White });
            appender.AddMapping(new ColoredConsoleAppender.LevelColors { Level = Level.Info, ForeColor = ColoredConsoleAppender.Colors.White | ColoredConsoleAppender.Colors.HighIntensity });
            appender.AddMapping(new ColoredConsoleAppender.LevelColors { Level = Level.Warn, ForeColor = ColoredConsoleAppender.Colors.Yellow | ColoredConsoleAppender.Colors.HighIntensity });
            appender.AddMapping(new ColoredConsoleAppender.LevelColors { Level = Level.Error, ForeColor = ColoredConsoleAppender.Colors.Red | ColoredConsoleAppender.Colors.HighIntensity });
            appender.AddMapping(new ColoredConsoleAppender.LevelColors { Level = Level.Fatal, ForeColor = ColoredConsoleAppender.Colors.White | ColoredConsoleAppender.Colors.HighIntensity, BackColor = ColoredConsoleAppender.Colors.Red });
            appender.ActivateOptions();
            BasicConfigurator.Configure(appender);

            var server = new Server();
            server.Start();

            var random = new Random();
            while (true)
            {
                var username = new String(
                    Enumerable.Repeat("abcdefghijklmnopqrstuvwxyz0123456789_", random.Next(4, 24))
                    .Select(s => s[random.Next(s.Length)])
                    .ToArray()
                    );
                server.BroadcastInput(username, (Direction)Math.Min(3, random.Next(0, 4)));
                Thread.Sleep(TimeSpan.FromMilliseconds(random.Next(30, 300)));
            }
        }
    }

    enum Direction
    {
        Up = 0,
        Right = 1,
        Down = 2,
        Left = 3
    }
}
