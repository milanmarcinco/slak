import { defineStore } from 'pinia';

import { Channel, Message, RawMessage, SerializedChannel } from 'src/contracts';
import { channelService } from 'src/services';

interface State {
  channels?: Channel[];
  channelsLoading: boolean;
  channelsError: boolean;

  messages: Record<SerializedChannel['name'], Message[]>;
}

export const useChatStore = defineStore('chat', {
  state: (): State => ({
    channels: undefined,
    channelsLoading: false,
    channelsError: false,

    messages: {},
  }),

  actions: {
    async loadChannels() {
      this.channelsLoading = true;
      this.channelsError = false;

      try {
        const serializedChannels = await channelService.loadChannels();
        const channels = serializedChannels.map<Channel>((channel) => ({
          ...channel,
        }));

        this.channels = [...channels];

        for (const channel of channels) {
          this.subscribe(channel.id);
        }
      } catch (error) {
        this.channelsError = true;
      } finally {
        this.channelsLoading = false;
      }
    },

    async loadMessages(
      channelId: Channel['id'],
      oldestMessageId?: Message['id']
    ) {
      const response = await channelService.loadMessages(
        channelId,
        oldestMessageId
      );

      const messages = response.messages.toReversed();
      const prevMessages = this.messages[channelId];

      this.messages[channelId] = prevMessages
        ? [...messages, ...prevMessages]
        : messages;

      return response.hasMore;
    },

    async subscribe(channelId: SerializedChannel['id']) {
      channelService.subscribe(channelId);
    },

    async unsubscribe(channelId: SerializedChannel['id']) {
      channelService.unsubscribe(channelId);
      delete this.messages[channelId];
    },

    async sendMessage(channelId: SerializedChannel['id'], message: RawMessage) {
      const newMessage = await channelService
        .subscribedTo(channelId)
        ?.sendMessage(message);

      this.messages[channelId].push(newMessage!);
    },
  },
});
