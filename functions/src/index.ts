import * as admin from 'firebase-admin';

import { createServer as _createServer } from './cloudvm/create-server';
import { auditCron as _auditCron } from './audits/audit';
import { serverListener as _serverListener } from './cloudvm/server-listener';
import { handlePaddleWebook as _handlePaddleWebook } from './paddle/handle-paddle-webook';

import {
  getStatusProxy as _getStatusProxy,
  getPropsProxy as _getPropsProxy,
  setPropsProxy as _setPropsProxy,
  getLogsProxy as _getLogsProxy,
  restartProxy as _restartProxy,
  getResourcesProxy as _getResourcesProxy,
  getResourcesNewestProxy as _getResourcesNewestProxy,
} from './vm-proxy/proxy';

admin.initializeApp();

export const createServer = _createServer;
export const auditCron = _auditCron;
export const serverListener = _serverListener;
export const handlePaddleWebook = _handlePaddleWebook;

export const getStatusProxy = _getStatusProxy;
export const getPropsProxy = _getPropsProxy;
export const setPropsProxy = _setPropsProxy;
export const getLogsProxy = _getLogsProxy;
export const restartProxy = _restartProxy;
export const getResourcesProxy = _getResourcesProxy;
export const getResourcesNewestProxy = _getResourcesNewestProxy;
