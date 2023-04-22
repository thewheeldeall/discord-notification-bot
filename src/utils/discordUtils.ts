import { Client, MessageEmbed, MessageEmbedOptions, TextChannel } from 'discord.js'
import { EventMessage } from '../classes/eventMessage';

export class DiscordUtils {
  // User attributes. Should always be private as updating information will need to be reflected in the db
  private discord : Client;

  public constructor (discord : Client) {
    this.discord = discord;
  }

  public async sendEventMessage(eventMessage : EventMessage) {
    const channel = await this.discord.channels.fetch(eventMessage.getChannelId());
    // // Using a type guard to narrow down the correct type
    if (!((channel): channel is TextChannel => channel?.type === 'GUILD_TEXT')(channel)) return
    channel.send(eventMessage.getOutboundMessage());
  }

  public async sendEmbeds(channelId : string, embeds : (MessageEmbed | MessageEmbedOptions)[]) {
    const channel = await this.discord.channels.fetch(channelId);
    // // Using a type guard to narrow down the correct type
    if (!((channel): channel is TextChannel => channel?.type === 'GUILD_TEXT')(channel)) return
    let MessageOptions = {
      embeds: embeds
    }
    return channel.send(MessageOptions);
  }
}