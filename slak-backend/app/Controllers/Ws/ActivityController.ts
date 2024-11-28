import { inject } from "@adonisjs/core/build/standalone";
import { ChannelRepositoryContract } from "@ioc:Repositories/ChannelRepository";
import type { WsContextContract } from "@ioc:Ruby184/Socket.IO/WsContext";

import User from "App/Models/User";

import { UserStatus } from "App/Enums/UserStatus";

@inject(["Repositories/ChannelRepository"])
export default class ActivityController {
  constructor(private channelRepository: ChannelRepositoryContract) {}

  public async onConnected({ socket, auth, logger }: WsContextContract) {
    await auth.authenticate();

    // all connections for the same authenticated user will be in the room
    const room = this.channelRepository.getUserRoom(auth.user!);
    const userSockets = await socket.in(room).fetchSockets();

    // this is first connection for given user
    if (userSockets.length === 0) {
      socket.broadcast.emit("user:online", auth.user);
    }

    // add this socket to user room
    socket.join(room);
    // add userId to data shared between Socket.IO servers
    // https://socket.io/docs/v4/server-api/#namespacefetchsockets
    socket.data.userId = auth.user!.id;

    const allSockets = await socket.nsp.except(room).fetchSockets();
    const onlineIds = new Set<number>();

    for (const remoteSocket of allSockets) {
      onlineIds.add(remoteSocket.data.userId);
    }

    const onlineUsers = await User.findMany([...onlineIds]);
    socket.emit("user:list", onlineUsers);
    logger.info("new websocket connection");
  }

  // see https://socket.io/get-started/private-messaging-part-2/#disconnection-handler
  public async onDisconnected(
    { socket, auth, logger }: WsContextContract,
    reason: string
  ) {
    await auth.authenticate();

    const room = this.channelRepository.getUserRoom(auth.user!);
    const userSockets = await socket.in(room).fetchSockets();

    // user is disconnected
    if (userSockets.length === 0) {
      // notify other users
      socket.broadcast.emit("user:offline", auth.user);
    }

    logger.info("websocket disconnected", reason);
  }

  public async changeStatus(
    { socket, auth }: WsContextContract,
    newStatus: UserStatus
  ) {
    const user = auth.user!;

    user.status = newStatus;
    await user.save();

    socket.broadcast.emit("user:status", user);
    return user;
  }
}
