﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
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
            _log.DebugFormat("{0} typed {1}", issuer, direction);

            var j = JsonConvert.SerializeObject(new { type="input", issuer, direction=(int)direction });
            foreach(var client in _clients)
                try
                {
                    client.Send(j);
                }
                catch(Exception err)
                {
                    _log.WarnFormat("Error while broadcasting input to game: {0}", err.Message);
                }
        }

        public void BroadcastDisconnected()
        {
            var j = JsonConvert.SerializeObject(new { type = "disconnected" });
            foreach (var client in _clients)
                try
                {
                    client.Send(j);
                }
                catch (Exception err)
                {
                    _log.WarnFormat("Error while broadcasting IRC chat disruption to game: {0}", err.Message);
                }
        }

        public void BroadcastConnected()
        {
            var j = JsonConvert.SerializeObject(new { type = "connected" });
            foreach (var client in _clients)
                try
                {
                    client.Send(j);
                }
                catch (Exception err)
                {
                    _log.WarnFormat("Error while broadcasting IRC chat connection to game: {0}", err.Message);
                }
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

            var bot = new Bot(server);
            bot.Start();

            Thread.Sleep(Timeout.Infinite);
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
