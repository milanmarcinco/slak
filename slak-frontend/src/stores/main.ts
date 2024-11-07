import { defineStore } from 'pinia';

import { Channel, ChannelType, Message } from 'src/components/models';

import messages_1 from './seed/messages/messages_1.json';
import messages_2 from './seed/messages/messages_2.json';
import messages_3 from './seed/messages/messages_3.json';

interface State {
  channels?: Channel[];
  messages: Record<string, Message[]>;

  privacyMode: boolean;
}

export const useMainStore = defineStore('main', {
  state: (): State => ({
    channels: [
      {
        id: 1,
        title: 'General',
        adminId: 1,
        type: ChannelType.Public,
        unread: true,
      },
      {
        id: 2,
        title: 'Random',
        adminId: 1,
        type: ChannelType.Public,
        unread: true,
      },
      {
        id: 3,
        title: 'Secret',
        adminId: 1,
        type: ChannelType.Private,
        invite: true,
      },
      {
        id: 4,
        title: 'Hidden',
        adminId: 2,
        type: ChannelType.Private,
      },
    ],

    messages: {
      1: messages_1 as Message[],
      2: messages_2 as Message[],
      3: messages_3 as Message[],
      4: [],
    },

    privacyMode: false,
  }),

  getters: {},

  actions: {
    signIn() {
      // this.user = {
      //   id: 1,
      //   nickName: 'johndoe',
      //   firstName: 'John',
      //   lastName: 'Doe',
      //   status: UserStatus.Online,
      // };
    },

    signUp() {
      // this.signIn();
    },

    signOut() {
      // this.user = undefined;
    },

    createChannel(title: Channel['title'], type: Channel['type']) {
      const channels = this.channels || [];

      const channel: Channel = {
        id:
          channels.reduce((maxId, channel) => Math.max(maxId, channel.id), 0) +
          1,
        title,
        // adminId: this.user!.id,
        adminId: 1,
        type,
      };

      this.channels = [channel, ...channels];
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
