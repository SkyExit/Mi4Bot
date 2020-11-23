const tmi = require('tmi.js');
const users = require('./user.json');
const c22 = require('./config.json');
const { identity } = require('lodash');
const fs = require('fs');
const { config } = require('process');
const playerJsonName = 'user.json';

function rNumber(min, max) {
  return Math.floor(
      Math.random() * (max - min) + min
  )
}

const linksDisallowed = ["http://", "https://", ".dk", "test"];


const options = {
  options: {
    debug: true,
  },
connection: {
    cluster: 'aws',
    reconnect: true,
},
identity: {
  username: 'Mi4Bot',
  password: c22.password,
},
channels: ['mi4mis', 'skyexit'],
};

const client = new tmi.client(options);

client.connect();

client.on('connected', (address, port) => {
  client.say('skyexit', 'Hello, Mi4Bot is now Connected');
});



client.on('chat', (channel, user, message, self) => {
  //check if user is Mod
  const chMod = client.mods(channel)
  .then((data) => {
      data.indexOf(user.username)
  }).catch((err) => {
  });

  //check if user is Brodcaster
    var channelName = channel.substring(1, channel.length);
    const chOwn = (channelName = user.username);

    var noPerms = user.username + ", dazu hast du keine Rechte!"

    let params = message.slice(1).split(' ')

  if(user.username != 'mi4bot') {
    if(message.startsWith('&')) {


      //&discord
      if (message === '&discord') {
        client.say(channel, user.username + ', Coming Soon!')

        //&youtube
      } else if (message === '&youtube') {
        client.say(channel, 'Coming Soon!')

        //&blacklist
      } else if (message === '&blacklist') {
        client.say(channel, 'Böse Wörter: ' + linksDisallowed)

        //&help
      } else if (message === '&help') {
        client.say(channel, "&discord - Für einen Discord Server Link!");
        client.say(channel, "&youtube - Für einen Youtube Kanal Link");
        client.say(channel, "&blacklist - Für eine Liste böser Wörter!");
        client.say(channel, "&ping - Um die Uptime dieses Bots zu testen!")

        //&ping
      } else if (message === '&ping') {
        client.ping()
            .then((data) => {
              client.say(channel, "Pong! " + data);
            }).catch((err) => {
        });

        //&gold
      } else if (message === '&gold') {
        const userGold = users[user.username].gold || 0;
        client.say(channel, user.username + ", You have: " + userGold + " Gold!");

        //&gamble
      } else if (message === '&gamble') {
        const userGold = users[user.username].gold || 0;
        const rMoney = rNumber(1, 23);
        users[user.username].gold = (userGold + rMoney);

        fs.writeFile(playerJsonName, JSON.stringify(users, null, 2), function writeJSON(err) {
          if (err) return console.log(err);
        })

        client.say(channel, user.username + ", You got " + rMoney + " Gold!");

      }
    } else {
      return;
    }

    //badWords
  for (let i = 0; i < 4; i++) {
    if(message.indexOf(linksDisallowed[i]) >= 0) {
      client.timeout(channel, user.username, 1, "bad word");
      client.say(channel, user.username + ", du hast ein böses Wort gesagt!");
    }
  }
}});