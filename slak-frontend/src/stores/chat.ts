import { defineStore } from 'pinia';

import {
  Channel,
  ChannelType,
  Message,
  RawMessage,
  SerializedChannel,
  SerializedMessage,
} from 'src/contracts';

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

  getters: {
    getChannel: (state) => (channelId: Channel['id']) =>
      state.channels?.find((c) => c.id === channelId),
  },

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

      const channel = this.getChannel(channelId);
      if (channel) channel.reachedEnd = !response.hasMore;

      return response.hasMore;
    },

    async subscribe(channelId: Channel['id']) {
      channelService.subscribe(channelId);
    },

    async unsubscribe(channelId: Channel['id']) {
      channelService.unsubscribe(channelId);
    },

    async sendMessage(channelId: Channel['id'], message: RawMessage) {
      const newMessage = await channelService
        .subscribedTo(channelId)
        ?.sendMessage(message);

      this.pushMessage(newMessage!);
      this.topChannel(channelId);
    },

    async receiveMessage(message: SerializedMessage) {
      const channel = this.getChannel(message.channelId);
      channel!.unread = true;

      this.pushMessage(message);
      this.topChannel(message.channelId);
    },

    setReadChannel(channelId: Channel['id']) {
      const channel = this.getChannel(channelId);
      channel!.unread = false;
    },

    async joinChannel(channelName: Channel['name'], channelType: ChannelType) {
      const channel = await channelService.joinChannel(
        channelName,
        channelType
      );

      this.channels?.unshift(channel);
      this.subscribe(channel.id);

      return channel;
    },

    async leaveChannel(channelId: Channel['id']) {
      await channelService.subscribedTo(channelId)?.leaveChannel();
      this.deleteChannel(channelId);
    },

    deleteChannel(channelId: Channel['id']) {
      this.channels = this.channels?.filter((c) => c.id !== channelId);

      const newMessages = { ...this.messages };
      delete newMessages[channelId];
      this.messages = newMessages;

      this.unsubscribe(channelId);
    },

    // Helpers

    topChannel(channelId: Channel['id']) {
      const idx = this.channels?.findIndex((c) => c.id === channelId);
      const channel = this.channels?.splice(idx!, 1)[0];
      this.channels?.unshift(channel!);
    },

    pushMessage(message: Message) {
      const channelMessages = this.messages[message.channelId];

      if (channelMessages) channelMessages.push(message);
      else this.messages[message.channelId] = [message];
    },
  },
});
