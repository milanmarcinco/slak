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
      // Check if service workers are supported
      if (!('serviceWorker' in navigator)) {
        console.log('Service workers not supported, skipping push notification unsubscribe');
        return;
      }

      // Add timeout to prevent hanging
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Service worker ready timeout')), 3000)
      );

      const registration = await Promise.race([
        navigator.serviceWorker.ready,
        timeout
      ]) as ServiceWorkerRegistration;

      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        console.log('Unsubscribing from push manager...');
        await subscription.unsubscribe();
        
        try {
          console.log('Notifying backend about unsubscribe...');
          await api.post('/web-push/unsubscribe', { subscription });
        } catch (apiErr) {
          console.warn('Failed to notify backend about unsubscribe, but local unsubscribe succeeded:', apiErr);
        }
      } else {
        console.log('No active push subscription found');
      }
    } catch (err) {
      console.error("Couldn't unsubscribe from push notifications", err);
      throw err; // Re-throw to allow caller to handle
    }
  }
}

export default new WebPushService();
