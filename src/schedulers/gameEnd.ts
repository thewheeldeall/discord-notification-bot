import { CronJob } from 'cron';
import { DiscordUtils } from '../utils/discordUtils';
import { Config } from '../classes/config';
import { EventMessage } from '../classes/eventMessage';
import { GameStart } from './gameStart';

export class GameEnd {
  private discUtils : DiscordUtils;
  private cronJob: CronJob;
  private config : Config;
  private whenToRun : string = "* * * * * *";

  public constructor (discUtils : DiscordUtils, conf : Config) {
    this.discUtils = discUtils;
    this.config = conf;
    this.cronJob = new CronJob(
      this.whenToRun, 
      this.send, 
      undefined, 
      undefined, 
      "America/New_York", 
      this
    );
    this.cronJob.start()
    console.log(`Starting new GameEnd on interval ${this.whenToRun}`);
  }

  private async send() {
    // Generate new start time and save to DB
    let timeIncrease = (6 * 60 * 60); // 24hrs in seconds
    let previousStartTime = this.config.getStartTime();
    // Check if all answers have been guessed and only continue if so OR if past 24hrs from start time
    let allAnswered = (this.config.getAnswers().length == this.config.getAnswered().length);
    if(!allAnswered && (Math.floor(new Date().getTime() / 1000)) < previousStartTime+timeIncrease) return;
    // set game off
    this.config.setGameRunning(false);
    this.config.setStartTime(previousStartTime + timeIncrease);
    // Thank the players
    let evntMsg : EventMessage = 
      new EventMessage(
        this.config.getGameChannelId(),
        undefined,
        `@ futurerolehere, psych plz make this ty. All targets for this round have been assassinated. Thank you for playing! A new round will begin soon`,
        undefined,);
    this.discUtils.sendEventMessage(evntMsg);
    // Start new GameStart listener
    new GameStart(this.discUtils, this.config);
    // Stop this.cronJob
    this.cronJob.stop();
  }

}