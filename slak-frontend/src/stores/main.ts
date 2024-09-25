import { defineStore } from 'pinia';

import { Channel, Message, User } from 'src/components/models';

import messages from './seed/messages.json';

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
      1: messages,
      2: messages,
      3: messages,
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
