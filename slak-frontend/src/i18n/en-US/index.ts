export default {
  title: 'Slak',
  not_found: 'Page not found',

  common: {
    and: 'and',
  },

  sidebar: {
    public_channels: 'Public channels',
    private_channels: 'Private channels',
    no_channels: 'No channels yet...',

    channel_actions: {
      leave_channel: 'Leave channel',
      delete_channel: 'Delete channel',
    },

    status: {
      online: 'Online',
      do_not_disturb: 'Do not disturb',
      offline: 'Offline',
    },

    sign_out: 'Sign out',
  },

  channel: {
    members: 'Members of {channelName}',
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
    typing: 'is typing... | are typing...',
  },

  command_line: {
    send: 'Send',
    execute: 'Execute',
  },

  mentions: {
    no_users: 'No users found...',
  },

  sign_up: {
    title: 'Create a Slak account,',
    subtitle: 'or just sign in.',

    action: 'Sign up',

    fields: {
      email: {
        label: 'Email',

        validation: {
          required: 'Email is required',
        },
      },

      nick_name: {
        label: 'Nick name',

        validation: {
          required: 'Nick name is required',
          min: 'Nick name must be at least 3 characters long',
          max: 'Nick name must be at most 30 characters long',
        },
      },

      first_name: {
        label: 'First name',

        validation: {
          required: 'First name is required',
          min: 'First name must be at least 2 characters long',
          max: 'First name must be at most 30 characters long',
        },
      },

      last_name: {
        label: 'Last name',

        validation: {
          required: 'Last name is required',
          min: 'Last name must be at least 2 characters long',
          max: 'Last name must be at most 30 characters long',
        },
      },

      password: {
        label: 'Password',

        validation: {
          required: 'Password is required',
          min: 'Password must be at least 8 characters long',
          max: 'Password must be at most 30 characters long',
        },
      },

      password_repeat: {
        label: 'Repeat password',

        validation: {
          no_match: "Passwords don't match",
        },
      },
    },
  },

  sign_in: {
    title: 'Sign in to Slak,',
    subtitle: 'or create an account.',

    action: 'Sign in',

    fields: {
      email: {
        label: 'Email',

        validation: {
          required: 'Email is required',
        },
      },

      password: {
        label: 'Password',

        validation: {
          required: 'Password is required',
        },
      },
    },
  },
};
