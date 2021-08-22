const Discord = require("discord.js")
const distube = require('distube')

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;


    if (!message.member.voice.channel) {
        var embed = new Discord.MessageEmbed()
        .setTitle('⛔ Ops...⛔')
        .setDescription('You must be in a voice channel to use this command...')
        .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
        .setColor("#e296ff")
        return message.channel.send(embed)
        }

const queue = Client.distube.getQueue(message)
if (!queue) return message.channel.send(`There is nothing in the queue right now!`)
const volume = parseInt(args[0]) 
if (isNaN(volume)) return message.channel.send(`Please enter a valid number!`)
Client.distube.setVolume(message, volume)

const embed1 = new Discord.MessageEmbed()
.setTitle(`🔉 Volume 🔊`)
.setDescription(`Volume set to ${volume}`)
.setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
.setColor("#e296ff")
message.channel.send(embed1)

}

module.exports.help = {
    name: `volume`,
    aliases: []
};