import { defineStore } from 'pinia';

import {
  Channel,
  ChannelType,
  Message,
  RawMessage,
  SerializedChannel,
  SerializedMessage,
  User,
} from 'src/contracts';

import { channelService } from 'src/services';

interface State {
  channels?: Channel[];
  channelsLoading: boolean;
  channelsError: boolean;

  messages: Record<SerializedChannel['name'], Message[]>;

  typing: Record<SerializedChannel['id'], Record<User['id'], string>>;
  selectedTypingUser?: User;

  privacyMode: boolean;
}

export const useChatStore = defineStore('chat', {
  state: (): State => ({
    channels: undefined,
    channelsLoading: false,
    channelsError: false,

    messages: {},

    typing: {},
    selectedTypingUser: undefined,

    privacyMode: false,
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

        channelService.init();
      } catch (error) {
        this.channelsError = true;
      } finally {
        this.channelsLoading = false;
      }
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

    sendInvite(channelId: Channel['id'], nickName: User['nickName']) {
      channelService.subscribedTo(channelId)?.sendInvite(nickName);
    },

    receiveInvite(channel: SerializedChannel) {
      this.channels?.unshift({
        ...channel,
        invite: true,
      });

      this.subscribe(channel.id);
    },

    sendRevoke(channelId: Channel['id'], nickName: User['nickName']) {
      channelService.subscribedTo(channelId)?.sendRevoke(nickName);
    },

    receiveRevoke(channelId: Channel['id']) {
      this.deleteChannel(channelId);
    },

    async sendMessage(
      channelId: Channel['id'],
      message: RawMessage,
      mentions: User['id'][]
    ) {
      const newMessage = await channelService
        .subscribedTo(channelId)
        ?.sendMessage(message, mentions);

      this.pushMessage(newMessage!);
      this.topChannel(channelId);
    },

    async receiveMessage(message: SerializedMessage) {
      const channel = this.getChannel(message.channelId);
      channel!.unread = true;

      this.pushMessage(message);
      this.topChannel(message.channelId);
    },

    sendKick(channelId: Channel['id'], nickName: User['nickName']) {
      channelService.subscribedTo(channelId)?.sendKick(nickName);
    },

    receiveKick(channelId: Channel['id']) {
      this.deleteChannel(channelId);
    },

    sendTyping(channelId: Channel['id'], content: string | null) {
      channelService.subscribedTo(channelId)?.sendPreview(content);
    },

    receiveTyping(
      channelId: Channel['id'],
      userId: User['id'],
      message: RawMessage | null
    ) {
      if (!message) {
        delete this.typing[channelId]?.[userId];

        if (this.selectedTypingUser?.id === userId) {
          this.selectedTypingUser = undefined;
        }

        return;
      }

      if (!(channelId in this.typing)) {
        this.typing[channelId] = {};
      }

      this.typing[channelId][userId] = message;
    },

    setTypingUser(user: User) {
      this.selectedTypingUser = user;
    },

    clearTypingUser() {
      this.selectedTypingUser = undefined;
    },

    nuke() {
      channelService.nuke();
      this.channels = undefined;
      this.messages = {};
      this.typing = {};
      this.selectedTypingUser = undefined;
    },

    // Helpers

    async subscribe(channelId: Channel['id']) {
      channelService.subscribe(channelId);
    },

    async unsubscribe(channelId: Channel['id']) {
      channelService.unsubscribe(channelId);
    },

    topChannel(channelId: Channel['id']) {
      const idx = this.channels?.findIndex((c) => c.id === channelId);
      const channel = this.channels?.splice(idx!, 1)[0];
      this.channels?.unshift(channel!);
    },

    setReadChannel(channelId: Channel['id']) {
      const channel = this.getChannel(channelId);
      channel!.unread = false;
      channel!.invite = false;
    },

    pushMessage(message: Message) {
      const channelMessages = this.messages[message.channelId];

      if (channelMessages) channelMessages.push(message);
      else this.messages[message.channelId] = [message];
    },

    deleteChannel(channelId: Channel['id']) {
      this.channels = this.channels?.filter((c) => c.id !== channelId);

      const newMessages = { ...this.messages };
      delete newMessages[channelId];
      this.messages = newMessages;

      this.unsubscribe(channelId);
    },

    // ----- ----- ----- -----

    togglePrivacyMode() {
      this.privacyMode = !this.privacyMode;
    },
  },
});
