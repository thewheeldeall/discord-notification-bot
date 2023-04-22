import { EventMessage } from '../classes/eventMessage';
import { CronJob } from 'cron';
import { DiscordUtils } from '../utils/discordUtils';

export class BufferedOutput {
  private sender : DiscordUtils;
  private buffer : EventMessage[] = [];
  private cronJob: CronJob;
  private whenToRun : string = "* * * * * *";
  private maxBufferSize : number = 7;

  public constructor (sender : DiscordUtils) {
    this.sender = sender;
    this.cronJob = new CronJob(
      this.whenToRun, 
      this.compileAndSendBatch, 
      undefined, 
      undefined, 
      "America/New_York", 
      this
    );
    this.cronJob.start()
    console.log(`Starting new BufferedOutput on interval ${this.whenToRun}`);
  }

  // Accept a new EventMessage and store in the buffer
  public addEventMessage (eventMessage : EventMessage) {
    this.buffer.push(eventMessage);
  }

  private async compileAndSendBatch() {
    if(!this.buffer) return;
    if(this.buffer.length == 0) return;
    let bufferSize = this.buffer.length;
    let finalOutputMessage = "";
    let outboundBufferedObj = new EventMessage();
    for (let i = 0; (i < bufferSize); i++) {
			if(i < this.maxBufferSize) {
        const eventMessage = this.buffer.shift();
        if(!eventMessage) break;
        finalOutputMessage += `${eventMessage.getOutboundMessage()}\n\n`;
        outboundBufferedObj.setChannelId(eventMessage.getChannelId());
      } else break;
    }
    outboundBufferedObj.setOutboundMessage(finalOutputMessage);
    this.sender.sendEventMessage(outboundBufferedObj);
  }

}