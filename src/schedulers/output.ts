import { EventMessage } from '../classes/eventMessage';
import { Config } from '../classes/config';
import { CronJob } from 'cron';
import { DiscordUtils } from '../utils/discordUtils';

export class Output {
  private config : Config;
  private sender : DiscordUtils;
  private cronJob: CronJob;

  public constructor (config : Config, sender : DiscordUtils) {
    this.config = config;
    this.sender = sender;
    this.cronJob = new CronJob(
      config.getCron(), 
      this.compileAndSend, 
      undefined, 
      undefined, 
      "America/New_York", 
      this
    );
    this.cronJob.start()
    console.log(`Starting new Output for ${config.getChannelId()} on interval ${config.getCron()}`);
  }

  private async compileAndSend() {
    let outboundMessage = new EventMessage();
    outboundMessage.setOutboundMessage(this.config.getMessage());
    outboundMessage.setChannelId(this.config.getChannelId());
    this.sender.sendEventMessage(outboundMessage);
    console.log(`Sending message to ${this.config.getChannelId()} at ${new Date()}`);
  }

}