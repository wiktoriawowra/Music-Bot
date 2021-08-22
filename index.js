const config = require('./config.json')
const Discord = require('discord.js')
const Client = new Discord.Client()
const db = require('quick.db')
const fs = require('fs')
Client.commands = new Discord.Collection();
Client.aliases = new Discord.Collection();
const DisTube = require('distube')




Client.distube = new DisTube(Client, { searchSongs: false, emitNewSongOnly: false });

Client.distube

.on("playSong", (message, queue, song) => {
    let playingEmbed = new Discord.MessageEmbed()
    .setColor("#e296ff")
    .setTitle(`🎵 Now Playing 🎵`)
    .setDescription(`[**${song.name} - ${song.formattedDuration}**](${song.url})`)
    .setFooter(`Requested by ${song.user.tag}`)
    message.channel.send(playingEmbed)
})
.on("addSong", (message, queue, song) => {
    let queueEmbed = new Discord.MessageEmbed()
    .setColor("#e296ff")
    .setTitle(`✅ Added to the Queue ✅`)
    .setDescription(`[**${song.name} - ${song.formattedDuration}**](${song.url})`)
    .setFooter(`Requested by ${song.user.tag}`)
    message.channel.send(queueEmbed)
})
.on("playList", (message, queue, playlist, song) => {

    message.channel.send(`Play \`${playlist.name}\` playlist (${playlist.songs.length} songs).\nRequested by: ${song.user}\nNow playing \`${song.name}\` - \`${song.formattedDuration}\``)
})
.on("addList", (message, queue, playlist) => message.channel.send(
    `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue`
))

.on("searchResult", (message, result) => {
    let i = 0;
    message.channel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`);
})

.on("searchCancel", (message) => message.channel.send(`**Searching canceled!**`))
.on("error", (message, e) => {
    console.error(e)
    message.channel.send("An error encountered: " + e);
});



Client.on('ready', () => console.log("Distube is Active"))




fs.readdirSync('./commands/').forEach(dir => {

    fs.readdir(`./commands/${dir}`, (err, files) => {

        if (err) throw err;

        var jsFiles = files.filter(f => f.split(".").pop() === "js");

        if (jsFiles.length <= 0) {
          console.log("Can't find any commands!");
          return;
        }

        
        jsFiles.forEach(file => {

            var fileGet = require(`./commands/${dir}/${file}`);
            console.log(`File ${file} was loaded`)

            try {
                Client.commands.set(fileGet.help.name, fileGet);

                fileGet.help.aliases.forEach(alias => {
                    Client.aliases.set(alias, fileGet.help.name);
                })

            } catch (err) {
                return console.log(err);
            }
        });
    });
});








Client.on("message", async message => {
    if(message.author.Client || message.channel.type === "dm") return;

    let prefixes = await db.fetch(`prefix_${message.guild.id}`);
    if(prefixes == null) {
      prefix = "!"
    } else {
      prefix = prefixes;
    }
 

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1)
    

    let commands = Client.commands.get(cmd.slice(prefix.length)) || Client.commands.get(Client.aliases.get(cmd.slice(prefix.length)));

    if(commands) commands.run(Client, message, args, prefix);



   

})






Client.login(process.env.token);