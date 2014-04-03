using System.Linq;
using System.Reflection;
using System.Threading;
using log4net;
using NetIrc2;

namespace Icedream.TwitchPlays2048
{
    class Bot
    {
        private readonly IrcClient _irc = new IrcClient();
        private readonly ILog _log;
        private readonly Server _server;

        public Bot(Server server)
        {
            _server = server;

            _log = LogManager.GetLogger("irc");

            _irc.ClientVersion = "TwitchPlays1024Bot/" + Assembly.GetExecutingAssembly().GetName().Version.ToString();
            _irc.Connected += (o, e) =>
            {
                _log.Info("Connected.");
                _irc.LogIn(Properties.Settings.Default.TwitchUsername, Properties.Settings.Default.TwitchUsername, Properties.Settings.Default.TwitchUsername, null, null, Properties.Settings.Default.TwitchPassword);
                _irc.Join("#" + Properties.Settings.Default.TwitchUsername.ToLower());
            };
            _irc.Closed += (o, e) =>
            {
                _log.Error("We got disconnected from IRC, reconnecting in 5 seconds!");
                Thread.Sleep(5000);

                Start();
            };
            _irc.GotJoinChannel += (o, e) => _log.DebugFormat("{0} joined {1}", e.Identity.Nickname, string.Join(", ", e.GetChannelList().Select(c => c.ToString())));
            _irc.GotMessage += (o, e) =>
            {
                _log.DebugFormat("<{0}> {1}", e.Sender.Nickname, e.Message);
                // Ignore private messages
                if (!e.Recipient.StartsWith("#"))
                    return;

                // Parse message and search for fitting words
                Direction? direction = null;
                foreach (var word in e.Message.ToString().Split(' '))
                {
                    switch (word.ToLower())
                    {
                        case "l":
                        case "left":
                        case "<":
                            direction = Direction.Left;
                            break;
                        case "r":
                        case "right":
                        case ">":
                            direction = Direction.Right;
                            break;
                        case "d":
                        case "down":
                        case "v":
                            direction = Direction.Down;
                            break;
                        case "u":
                        case "up":
                        case "^":
                            direction = Direction.Up;
                            break;
                    }
                }

                // Did we get a proper direction? Broadcast to game.
                if (direction.HasValue)
                {
                    _server.BroadcastInput(e.Sender.Nickname, direction.Value);
                }
            };
        }

        public void Start()
        {
            _log.Info("Connecting to Twitch...");
            _irc.Connect("irc.twitch.tv");
        }
    }
}
