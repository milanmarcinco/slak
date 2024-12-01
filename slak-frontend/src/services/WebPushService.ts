import { api } from 'boot/axios';

class WebPushService {
  async subscribe() {
    try {
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        const vapidPublicKey = (
          await api.get<string>('/web-push/vapid-public-key')
        ).data;

        subscription = await registration.pushManager.subscribe({
          applicationServerKey: vapidPublicKey,
          userVisibleOnly: true,
        });
      }

      await api.post('/web-push/subscribe', { subscription });
    } catch (err) {
      console.error("Couldn't subscribe to push notifications", err);
    }
  }

  async unsubscribe() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        await api.post('/web-push/unsubscribe', { subscription });
      }
    } catch (err) {
      console.error("Couldn't unsubscribe from push notifications", err);
    }
  }
}

export default new WebPushService();
