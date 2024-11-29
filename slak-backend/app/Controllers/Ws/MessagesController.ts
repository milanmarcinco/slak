import type { WsContextContract } from "@ioc:Ruby184/Socket.IO/WsContext";
import type { MessageRepositoryContract } from "@ioc:Repositories/MessageRepository";
import { inject } from "@adonisjs/core/build/standalone";

// inject repository from container to controller constructor
// we do so because we can extract database specific storage to another class
// and also to prevent big controller methods doing everything
// controler method just gets data (validates it) and calls repository
// also we can then test standalone repository without controller
// implementation is bind into container inside providers/AppProvider.ts
@inject(["Repositories/MessageRepository"])
export default class MessageController {
  constructor(private messageRepository: MessageRepositoryContract) {}

  public async sendMessage(
    { params, socket, auth }: WsContextContract,
    content: string,
    mentions: number[]
  ) {
    const message = await this.messageRepository.create(
      auth.user!.id,
      params.channelId,
      content,
      mentions
    );

    // broadcast message to other users in channel
    socket.broadcast.emit("message", message);

    // return message to sender
    return message;
  }

  public async sendPreview(
    { socket, auth }: WsContextContract,
    content: string
  ) {
    const user = auth.user!;
    socket.broadcast.emit("message:preview", user.id, content);
    return content;
  }
}
