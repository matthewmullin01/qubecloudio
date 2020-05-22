import * as admin from 'firebase-admin';

import { createServer as _createServer } from './cloudvm/create-server';
import { auditCron as _auditCron } from './audits/audit';
import { serverListener as _serverListener } from './cloudvm/server-listener';
import { handlePaddleWebook as _handlePaddleWebook } from './paddle/handle-paddle-webook';

admin.initializeApp();

export const createServer = _createServer;
export const auditCron2 = _auditCron;
export const serverListener = _serverListener;
export const handlePaddleWebook = _handlePaddleWebook;
