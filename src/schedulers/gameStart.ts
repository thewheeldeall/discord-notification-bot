import { MessageEmbed } from 'discord.js'
import { CronJob } from 'cron';
import { DiscordUtils } from '../utils/discordUtils';
import { Config } from '../classes/config';
import {v4 as uuidv4} from 'uuid';
import { GameEnd } from './gameEnd';
import { DeadfellazUtils } from '../utils/deadfellazUtils';
import { EventMessage } from '../classes/eventMessage';

export class GameStart {
  private discUtils : DiscordUtils;
  private cronJob: CronJob;
  private config : Config;

  public constructor (discUtils : DiscordUtils, conf : Config) {
    this.discUtils = discUtils;
    this.config = conf;
    // Build cron object
    let nextRun = new Date(this.config.getStartTime() * 1000);
    let now = new Date();
    let nextRunDefault = new Date(now.getTime() + (15 * 1000));
    console.log('nextRun: ' + nextRun);
    console.log('now: ' + now);
    console.log('nextRunDefault: ' + nextRunDefault);

    this.cronJob = new CronJob(
      ((nextRun < now) ? nextRunDefault : nextRun), 
      this.send, 
      undefined, 
      undefined, 
      "America/New_York", 
      this
    );
    this.cronJob.start()
    console.log(`Starting new GameStart at ${((nextRun < now) ? nextRunDefault : nextRun)}`);
  }

  private async send() {
    // Wait for start time to be before now and continue if so
    console.log('sending....')
    let gameActive = (Math.floor(new Date().getTime() / 1000)) > (this.config.getStartTime()- 1000);
    console.log('active?: ' + gameActive)
    if(!gameActive) return;
    //  Set game on
    this.config.setGameRunning(true);
    // Inform users
    let evntMsg : EventMessage = 
      new EventMessage(
        this.config.getGameChannelId(),
        undefined,
        `**Round Start!**\nDead Hunterz Mode: ***Assassination***\nTo play assassination, use the command !target <insert guess here> eg. !target 6969\nThe game ends <t:${Math.floor(6 * 60 * 60) + this.config.getStartTime()}:R>!`,
        undefined,);
    this.discUtils.sendEventMessage(evntMsg);
    // Guess new answers
    let newAnswers : string[] = [];
    let newProjects : string[] = [];
    let newDiscordHintEmbed : MessageEmbed[] = [];
    for(let i = 0; i < this.config.getAnswersToGenerate(); i++) {
      let getNewProjectId = await DeadfellazUtils.getRandomProject();
      let getNewTokenId = await DeadfellazUtils.getRandomTokenId(getNewProjectId);
      newAnswers.push(getNewTokenId.toString());
      newProjects.push(getNewProjectId.toString());
      let newHintImage = await DeadfellazUtils.getImageURLFromProjectIdAndTokenId(getNewProjectId, getNewTokenId)
      let embed = new MessageEmbed()
        .setColor('#FFC800')
        .setImage(newHintImage)
        .setTimestamp();
      newDiscordHintEmbed.push(embed);
    }
    this.config.setAnswered([]);
    this.config.setAnswers(newAnswers);
    this.config.setProjects(newProjects);
    // Guess new game UUID
    let newUuid : string = uuidv4();
    this.config.setGameUuid(newUuid);
    // Write hints to Discord to indicate the game started
    await this.discUtils.sendEmbeds(this.config.getGameChannelId(), newDiscordHintEmbed);
    //  Start new GameEnd listener
    new GameEnd(this.discUtils, this.config);
    // Stop this.cronJob
    this.cronJob.stop();
  }

}