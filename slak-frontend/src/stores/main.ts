import { defineStore } from 'pinia';

import { Channel, Message, User } from 'src/components/models';

import messages_1 from './seed/messages/messages_1.json';
import messages_2 from './seed/messages/messages_2.json';
import messages_3 from './seed/messages/messages_3.json';

interface State {
  user?: User;
  publicChannels?: Channel[];
  privateChannels?: Channel[];
  messages: Record<string, Message[]>;
}

export const useMainStore = defineStore('main', {
  state: (): State => ({
    user: {
      id: 1,
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
    },

    publicChannels: [
      { id: 1, title: 'General', unread: true },
      { id: 2, title: 'Random', unread: true },
    ],

    privateChannels: [
      { id: 3, title: 'Secret' },
      { id: 4, title: 'Hidden' },
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
    setReadChannel(channelId: Channel['id']) {
      const allChannels = [
        ...(this.publicChannels || []),
        ...(this.privateChannels || []),
      ];

      const channel = allChannels.find((c) => c.id === channelId);

      if (channel) {
        channel.unread = false;
      }
    },
  },
});
