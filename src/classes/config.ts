export class Config {
  // User attributes. Should always be private as updating information will need to be reflected in the db
  private cron?: string;
  private channelId?: string;
  private message?: string;

  // constructor is private. User object sould be created by one of the get or create commands
  public constructor (cron?: string, channelId?: string, message?: string) {
    this.cron = cron;
    this.channelId = channelId;
    this.message = message;
  }

  // Getters
  public getCron () : string {
    return this.cron ? this.cron : "";
  }

  public getChannelId () : string {
    return this.channelId ? this.channelId : "";
  }

  public getMessage () : string {
    return this.message ? this.message : "";
  }

  // Setters
  public setCron (cron: string) {
    this.cron = cron;
  }

  public setChannelId (channelId: string) {
    this.channelId = channelId;
  }

  public setMessage (message: string) {
    this.message = message;
  }

}
