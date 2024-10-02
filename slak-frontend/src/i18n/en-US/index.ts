export default {
  title: 'Slak',
  not_found: 'Page not found',

  sidebar: {
    public_channels: 'Public channels',
    private_channels: 'Private channels',
    no_channels: 'No channels yet...',

    channel_actions: {
      leave_channel: 'Leave channel',
      delete_channel: 'Delete channel',
    },

    sign_out: 'Sign out',
  },

  create_channel: {
    title: 'Create a new channel',

    fields: {
      name: {
        label: 'Channel name',

        validation: {
          required: 'Channel name is required',
          min: 'Channel name must be at least 3 characters long',
          max: 'Channel name must be at most 30 characters long',
        },
      },

      type: {
        label: 'Channel visibility',

        validation: {
          required: 'Channel visibility is required',
        },
      },
    },

    submit: 'Create',
    cancel: 'Cancel',
  },

  channel_types: {
    public: 'Public',
    private: 'Private',
  },

  messages: {
    no_messages: 'No messages yet...',
  },

  command_line: {
    send: 'Send',
    execute: 'Execute',
  },

  mentions: {
    no_users: 'No users found...',
  },

  sign_up: {
    action: 'Sign up',
  },

  sign_in: {
    action: 'Sign in',
  },
};
