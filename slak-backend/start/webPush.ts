import webPush from "web-push";
import Env from "@ioc:Adonis/Core/Env";

const vapidSubject = Env.get("VAPID_SUBJECT");
const vapidPublicKey = Env.get("VAPID_PUBLIC_KEY");
const vapidPrivateKey = Env.get("VAPID_PRIVATE_KEY");

webPush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
