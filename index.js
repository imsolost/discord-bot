require('dotenv').config()
const discord = require('discord.js')

const client = new discord.Client()
const IDENTIFIER = process.env.IDENTIFIER

client.login(process.env.BOT_TOKEN)

client.on('ready', () => {
  console.log(`${client.user.tag} has logged in`)
})

const isValidCmd = (message, cmdName) => message.content.toLowerCase().startsWith(IDENTIFIER + cmdName)

const rollDice = () => Math.floor(Math.random() * 100) + 1

const boonBane = (string) => {
  const strArr = [...string]
  let counter = 0

  strArr.forEach(el => {
    if (el === 'a') if ((Math.floor(Math.random() * 8) + 1) >= 5) counter++
    if (el === 'c') if ((Math.floor(Math.random() * 10) +1 >= 5)) counter--
  })

  if (counter > 0) {
    let arr = new Array(counter).fill('<:boon:857759699716669461>')
    return `, and ${arr.join('')}`
  }
  if (counter < 0) {
    let arr = new Array(Math.abs(counter)).fill('<:drawback:857759774929715250>')
    return `, and ${arr.join('')}`
  }
  return ''
}

const rollCommand = (message) => {
  const args = message.content.slice(IDENTIFIER.length).split(/ +/)
  const roll = rollDice()
  if (!args[1]) message.channel.send(`**${roll}** \nYou rolled a ${roll}.`)

  if (args[2] && (args[2].includes('a') || args[2].includes('c'))) {
    if (parseInt(args[1]) >= roll) {
      message.channel.send(`**Success!** \nYou rolled a ${roll}${boonBane(args[2])}.`)
    } else if (parseInt(args[1]) < roll) {
      message.channel.send(`**Failure!** \nYou rolled a ${roll}${boonBane(args[2])}.`)
    }
  } else if (parseInt(args[args.length - 1]) >= roll) {
    message.channel.send(`**Success!** \nYou rolled a ${roll}${boonBane(args[1])}.`)
  } else if (parseInt(args[args.length - 1]) < roll) {
    message.channel.send(`**Failure!** \nYou rolled a ${roll}${boonBane(args[1])}.`)
  } else if (args[1]) {
    message.channel.send(`**${roll}** \nYou rolled a ${roll}${boonBane(args[1])}.`)
  }
}

client.on('message', (message) => {
  if (!message.content.startsWith(IDENTIFIER) || message.author.bot) return

  if (isValidCmd(message, 'r')) {
    rollCommand(message)
  }
})