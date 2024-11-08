import { boot } from 'quasar/wrappers';
import { SocketManager } from 'src/services/SocketManager';

const io = SocketManager.createManager(process.env.API_URL);

export default boot((params) => {
  SocketManager.boot(params);
});

export { io };
