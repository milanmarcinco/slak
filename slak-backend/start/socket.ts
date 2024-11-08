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
  .disconnected("ActivityController.onDisconnected");

// this is dynamic namespace, in controller methods we can use params.name
Ws.namespace("channels/:channelId")
  // .middleware('channel') // check if user can join given channel
  .on("sendMessage", "MessageController.sendMessage")
  .middleware("auth");