import express from 'express';
import expressWs from 'express-ws';
import { observer } from './helpers/observer';
import {sendCurse} from './changeCoinsCurse'

const app = express();
const { app: appWithWs, getWss } = expressWs(app);


const router = express.Router();
appWithWs.ws('/', (ws, req)=>{
    const cb = (msg: string) => ws.send(msg);
        observer.subscribe(cb);
        sendCurse();
        console.log('New client connected');

        ws.on('close', function close() {
            observer.unsubscribe(cb);
            console.log('Client disconnected');
        });
})

export default app;