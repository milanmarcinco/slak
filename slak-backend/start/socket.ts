/*
|--------------------------------------------------------------------------
| Websocket events
|--------------------------------------------------------------------------
|
| This file is dedicated for defining websocket namespaces and event handlers.
|
*/

import Ws from "@ioc:Ruby184/Socket.IO/Ws";

Ws.namespace("/")
  .connected("ActivityController.onConnected")
  .disconnected("ActivityController.onDisconnected")
  .on("changeStatus", "ActivityController.changeStatus")
  .on("setNotifSetting", "UserController.setNotifSetting")
  .middleware("auth");

// this is dynamic namespace, in controller methods we can use params.name
Ws.namespace("/channels/:channelId")
  .on("sendMessage", "MessagesController.sendMessage")
  .on("sendPreview", "MessagesController.sendPreview")
  .on("leaveChannel", "ChannelsController.leaveChannel")
  .on("sendInvite", "ChannelsController.sendInvite")
  .on("sendRevoke", "ChannelsController.sendRevoke")
  .on("sendKick", "ChannelsController.sendKick")
  .middleware("auth");

Ws.namespace("/channels")
  .connected("ChannelsController.onConnected")
  .on("joinChannel", "ChannelsController.joinChannel")
  .middleware("auth");
