import {
  Channel,
  Message,
  RawMessage,
  SerializedChannel,
  SerializedMessage,
} from 'src/contracts';

import { api } from 'lib/axios';
import { useChatStore } from 'stores/chat';
import { BootParams, SocketManager } from './SocketManager';

// creating instance of this class automatically connects to given socket.io namespace
// subscribe is called with boot params, so you can use it to dispatch actions for socket events
// you have access to socket.io socket using this.socket
class ChannelSocketManager extends SocketManager {
  public subscribe({ store }: BootParams): void {
    const chatStore = useChatStore(store);

    const channelId = parseInt(this.namespace.split('/').pop()!);

    this.socket.on('message', (message: SerializedMessage) => {
      chatStore.messages[channelId].push(message);
    });
  }

  public sendMessage(message: RawMessage): Promise<SerializedMessage> {
    return this.emitAsync('sendMessage', message);
  }
}

class ChannelService {
  private channels: Map<Channel['id'], ChannelSocketManager> = new Map();

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

    if (!channel) {
      return false;
    }

    // disconnect namespace and remove references to socket
    channel.destroy();
    return this.channels.delete(channelId);
  }

  public subscribedTo(
    channelId: Channel['id']
  ): ChannelSocketManager | undefined {
    return this.channels.get(channelId);
  }
}

export default new ChannelService();
