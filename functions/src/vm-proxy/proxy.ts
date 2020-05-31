import * as functions from 'firebase-functions';
import axios from 'axios';

const SERVER_PORT = 4000;

export const getPropsProxy = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const publicIP = req.query.publicIP;
  const props = (await axios.get(`http://${publicIP}:${SERVER_PORT}/props`)).data;
  res.send(props);
});

export const getStatusProxy = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const publicIP = req.query.publicIP;
  const status = (await axios.get(`http://${publicIP}:${SERVER_PORT}/status`)).data;
  res.send(status);
});

export const setPropsProxy = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const publicIP = req.query.publicIP;
  const props: {} = JSON.parse(req.body).props;
  const result = (await axios.post(`http://${publicIP}:${SERVER_PORT}/props`, { data: props })).data;
  res.send(result);
});

export const getLogsProxy = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const publicIP = req.query.publicIP;
  const logs = (await axios.get(`http://${publicIP}:${SERVER_PORT}/logs`)).data;
  res.send(logs);
});

export const restartProxy = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const publicIP = req.query.publicIP;
  const result = (await axios.get(`http://${publicIP}:${SERVER_PORT}/restart`)).data;
  res.send(result);
});

export const getResourcesProxy = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const publicIP = req.query.publicIP;
  const resources = (await axios.get(`http://${publicIP}:${SERVER_PORT}/resources`)).data;
  res.send(resources);
});

export const getResourcesNewestProxy = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const publicIP = req.query.publicIP;
  const resource = (await axios.get(`http://${publicIP}:${SERVER_PORT}/resources/newest`)).data;
  res.send(resource);
});
