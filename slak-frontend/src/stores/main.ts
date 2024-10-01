import { defineStore } from 'pinia';

import { Channel, ChannelType, Message, User } from 'src/components/models';

import messages_1 from './seed/messages/messages_1.json';
import messages_2 from './seed/messages/messages_2.json';
import messages_3 from './seed/messages/messages_3.json';

interface State {
  user?: User;
  channels?: Channel[];
  messages: Record<string, Message[]>;
}

export const useMainStore = defineStore('main', {
  state: (): State => ({
    user: {
      id: 1,
      nickName: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
    },

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
      },
      {
        id: 4,
        title: 'Hidden',
        adminId: 1,
        type: ChannelType.Private,
      },
    ],

    messages: {
      1: messages_1,
      2: messages_2,
      3: messages_3,
      4: [],
    },
  }),

  getters: {},
  actions: {
    createChannel(title: Channel['title'], type: Channel['type']) {
      const channels = this.channels || [];

      const channel: Channel = {
        id:
          channels.reduce((maxId, channel) => Math.max(maxId, channel.id), 0) +
          1,
        title,
        adminId: this.user!.id,
        type,
      };

      this.channels = [channel, ...channels];
    },

    setReadChannel(channelId: Channel['id']) {
      const channel = (this.channels || []).find((c) => c.id === channelId);

      if (channel) {
        channel.unread = false;
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
  },
});
