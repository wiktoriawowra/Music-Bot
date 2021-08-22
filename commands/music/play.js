const discord = require('discord.js')
const distube = require('distube')

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return
    if(!message.member.voice.channel) return message.reply('Please join a vc before using this cmd')
    const music = args.join(" ")
    if(!music) return message.channel.send('Please provide a song to play')
    Client.distube.play(message, music)
}

module.exports.help = {
    name: 'play',
    aliases: []
}