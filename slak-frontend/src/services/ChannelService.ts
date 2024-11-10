import {
  Channel,
  ChannelType,
  Message,
  RawMessage,
  SerializedChannel,
  SerializedMessage,
  User,
} from 'src/contracts';

import { api } from 'lib/axios';
import { useChatStore } from 'stores/chat';
import { BootParams, SocketManager } from './SocketManager';

class ChannelsSocketManager extends SocketManager {
  public subscribe({ store }: BootParams): void {
    const chatStore = useChatStore(store);

    this.socket.on('channel:invite', (channel: SerializedChannel) => {
      chatStore.receiveInvite(channel);
    });
  }

  public joinChannel(
    channelName: Channel['name'],
    channelType: ChannelType
  ): Promise<SerializedChannel> {
    return this.emitAsync('joinChannel', { channelName, channelType });
  }
}

class ChannelSocketManager extends SocketManager {
  public subscribe({ store }: BootParams): void {
    const chatStore = useChatStore(store);

    const channelId = parseInt(this.namespace.split('/').pop()!);

    this.socket.on('message', (message: SerializedMessage) => {
      chatStore.receiveMessage(message);
    });

    this.socket.on('channel:delete', () => {
      chatStore.deleteChannel(channelId);
    });
  }

  public sendMessage(message: RawMessage): Promise<SerializedMessage> {
    return this.emitAsync('sendMessage', message);
  }

  public leaveChannel(): Promise<void> {
    return this.emitAsync('leaveChannel');
  }

  public sendInvite(nickName: User['nickName']): Promise<void> {
    return this.emitAsync('sendInvite', nickName);
  }
}

class ChannelService {
  private channels: Map<Channel['id'], ChannelSocketManager> = new Map();
  private channelsManager: ChannelsSocketManager | null = null;

  public initChannelsManager() {
    this.channelsManager = new ChannelsSocketManager('/channels');
  }

  public async loadChannels(): Promise<SerializedChannel[]> {
    const channels = await api.get<SerializedChannel[]>('/channels');
    return channels.data;
  }

  public async loadMessages(
    channelId: Channel['id'],
    oldestMessageId?: Message['id']
  ) {
    const messages = await api.get<{
      messages: SerializedMessage[];
      hasMore: boolean;
    }>(`/channels/${channelId}/messages`, {
      params: { cursor: oldestMessageId },
    });

    return messages.data;
  }

  public subscribe(channelId: Channel['id']): ChannelSocketManager {
    if (this.channels.has(channelId)) {
      throw new Error(`User is already joined in channel "${channelId}"`);
    }

    // connect to given channel namespace
    const channel = new ChannelSocketManager(`/channels/${channelId}`);
    this.channels.set(channelId, channel);

    return channel;
  }

  public unsubscribe(channelId: Channel['id']): boolean {
    const channel = this.channels.get(channelId);
    if (!channel) return false;

    // disconnect namespace and remove references to socket
    channel.destroy();
    return this.channels.delete(channelId);
  }

  public subscribedTo(
    channelId: Channel['id']
  ): ChannelSocketManager | undefined {
    return this.channels.get(channelId);
  }

  public async joinChannel(
    channelName: Channel['name'],
    channelType: ChannelType
  ): Promise<SerializedChannel> {
    return this.channelsManager!.joinChannel(channelName, channelType);
  }
}

export default new ChannelService();
