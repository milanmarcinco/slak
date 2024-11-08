import { defineStore } from 'pinia';

import { Channel, Message } from 'src/contracts';

interface State {
  channels?: Channel[];
  messages: Record<string, Message[]>;

  privacyMode: boolean;
}

export const useMainStore = defineStore('main', {
  state: (): State => ({
    channels: [],
    messages: {},

    privacyMode: false,
  }),

  getters: {},

  actions: {
    createChannel(title: Channel['name'], type: Channel['type']) {
      // const channels = this.channels || [];
      title;
      type;

      // const channel: Channel = {
      //   id:
      //     channels.reduce((maxId, channel) => Math.max(maxId, channel.id), 0) +
      //     1,
      //   name: title,
      //   // adminId: this.user!.id,
      //   adminId: 1,
      //   type,
      // };

      // this.channels = [channel, ...channels];
    },

    setReadChannel(channelId: Channel['id']) {
      const channel = (this.channels || []).find((c) => c.id === channelId);

      if (channel) {
        channel.unread = false;
        channel.invite = false;
      }
    },

    leaveChannel(channelId: Channel['id']) {
      this.channels = (this.channels || []).filter(
        (channel) => channel.id !== channelId
      );
    },

    deleteChannel(channelId: Channel['id']) {
      this.leaveChannel(channelId);
    },

    sendMessage(channelId: Channel['id'], content: Message['content']) {
      if (!this.channels) return;
      channelId;
      content;

      // const newMessage: Message = {
      //   id: Math.ceil(Math.random() * 999999),
      //   // author: this.user!,
      //   author: {},
      //   content,
      //   createdAt: new Date().toISOString(),
      // };

      // const messages = this.messages[channelId];
      // const newMessages = [...messages, newMessage];

      // this.messages[channelId] = newMessages;
    },

    togglePrivacyMode() {
      this.privacyMode = !this.privacyMode;
    },
  },
});
