/*
|--------------------------------------------------------------------------
| AdonisJs Server
|--------------------------------------------------------------------------
|
| The contents in this file is meant to bootstrap the AdonisJs application
| and start the HTTP server to accept incoming connections. You must avoid
| making this file dirty and instead make use of `lifecycle hooks` provided
| by AdonisJs service providers for custom code.
|
*/

import { Ignitor } from "@adonisjs/core/build/standalone";
import { readFileSync } from "fs";
import { createServer } from "https";
import { join } from "path";
import "reflect-metadata";
import sourceMapSupport from "source-map-support";

sourceMapSupport.install({ handleUncaughtExceptions: false });

const privateKey = readFileSync(join(__dirname + "/ssl/localhost.key"), "utf8");
const certificate = readFileSync(join(__dirname + "/ssl/localhost.crt"), "utf8");
const credentials = { key: privateKey, cert: certificate };

new Ignitor(__dirname)
  .httpServer()
  .start((handle) => createServer(credentials, handle));
