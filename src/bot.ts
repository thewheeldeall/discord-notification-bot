import { Client, Message, MessageEmbed } from 'discord.js'
import * as dotenv from 'dotenv'
import path from 'path'
import ready from './hooks/ready'
import { Headhunter } from './games/headhunter'
import { StringUtils } from './utils/stringUtils'
import { EventMessage } from './classes/eventMessage'
import { DeadfellazUtils } from './utils/deadfellazUtils'

dotenv.config({ path: path.resolve('./.env') })
const token = process.env.DSCRD_BOT_TK

console.log('Bot is starting...')

const client = new Client({
  intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_MESSAGE_REACTIONS']
})

ready(client)

client.login(token)

// Start game
let headhunter = new Headhunter(client);
headhunter.loadGame(process.env).then((setup) => {
  let gameChannelId = headhunter.getGameChannelId();
  let gameCommand = headhunter.getGameCommand();
  console.log("Listening for messages in game channel " + gameChannelId + " with command " + gameCommand)

  client.on('messageCreate', async message => {
    if (message == null) return
    if (message.author.id === client.user?.id) return
    if (message.channelId === gameChannelId) {
      // General message cleanup
      let cleanMessage = message.content.trim().toLowerCase();
      let matchedGameCmd = StringUtils.startsWith(cleanMessage, gameCommand);
      let msgWOGameCommand = cleanMessage.replace(`${gameCommand.toLowerCase()}`, "").trim();
      let matchedLeaderboardCmd = StringUtils.startsWith(cleanMessage, "!leaderboard");
      let resendCmd = StringUtils.startsWith(cleanMessage, "!resend");
      console.log("Message received in game channel from " + message.author.username + ": " + cleanMessage)
      console.log("Message: " + msgWOGameCommand)

      // Check for game command
      if (matchedGameCmd && msgWOGameCommand.length > 0) {
        console.log("Message matched game command check")
        let eventMessage = new EventMessage(message.channelId, message.author.id, undefined, cleanMessage);
        headhunter.play(eventMessage).then((state) => {
          (state) ? console.log("Message successfully processed by game") : console.log("Error occurred while processing");
        });
      }
      // Check if leaderboard
      if (matchedLeaderboardCmd) {
        console.log("Message matched leaderboard command check")
        let eventMessage = new EventMessage(message.channelId, message.author.id, undefined, cleanMessage);
        headhunter.leaderboard(eventMessage).then((state) => {
          (state) ? console.log("Message successfully processed by game") : console.log("Error occurred while processing");
        });
      }
      // Check if repopulating the images
      if (resendCmd) {
        if (message.member?.permissions.has("ADMINISTRATOR") || message.author.id === '551865831517061120') {
          if(setup.getConfig() == null) return;
          const tokenIds = setup.getConfig().getAnswers();
          const projectIds = setup.getConfig().getProjects();
          let embeds : MessageEmbed[] = [];
          for(let i = 0; i < setup.getConfig().getAnswersToGenerate(); i++) {

            // let discordHints : MessageEmbed[] = [];
            // let newHintImage = await DeadfellazUtils.getImageURLFromProjectIdAndTokenId(projectIds[i], tokenIds[i])
            // let newDiscordHintEmbed = new MessageEmbed()
            //   .setColor('#FFC800')
            //   .setImage(newHintImage)
            //   .setTimestamp();
            // discordHints.push(newDiscordHintEmbed);
            // setup.getDiscordUtils().sendEmbeds(setup.getConfig().getGameChannelId(), discordHints);

            await DeadfellazUtils.getImageURLFromProjectIdAndTokenId(parseInt(projectIds[i]), parseInt(tokenIds[i])).then((imageURL) => {
              embeds[i] = new MessageEmbed()
                .setColor('#FFC800')
                .setImage(imageURL)
                .setTimestamp();
            });
          }
          await setup.getDiscordUtils().sendEmbeds(setup.getConfig().getGameChannelId(), embeds);
        }
      }
    }
  })
});