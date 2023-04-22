export class EventMessage {
  // User attributes. Should always be private as updating information will need to be reflected in the db
  private channelId?: string;
  private user?: string;
  private outboundMessage?: string;
  private inboundMessage?: string;
  private wallet?: string;

  // constructor is private. User object sould be created by one of the get or create commands
  public constructor (channelId?: string, user?: string, outboundMessage?: string, inboundMessage?: string, wallet?: string) {
    this.channelId = channelId;
    this.user = user;
    this.outboundMessage = outboundMessage;
    this.inboundMessage = inboundMessage;
    this.wallet = wallet;
  }

  // Getters
  public getChannelId () : string {
    return this.channelId ? this.channelId : "";
  }

  public getUser () : string {
    return this.user ? this.user : "";
  }

  public getOutboundMessage () : string {
    return this.outboundMessage ? this.outboundMessage : "";
  }

  public getInboundMessage () : string {
    return this.inboundMessage ? this.inboundMessage : "";
  }
  
  public getWallet () : string {
    return this.wallet ? this.wallet : "";
  }

  // Setters
  public setChannelId (channelId : string) {
    this.channelId = channelId;
  }

  public setUser (user : string) {
    this.user = user;
  }

  public setOutboundMessage (outboundMessage : string) {
    this.outboundMessage = outboundMessage;
  }

  public setInboundMessage (inboundMessage : string) {
    this.inboundMessage = inboundMessage;
  }

  public setWallet (wallet : string) {
    this.wallet = wallet;
  }

}
