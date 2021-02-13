import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { IPassthrough } from '../../../src/shared/models/passthrough.model';

export const handlePaddleWebook = functions.https.onRequest(async (req, res) => {
  const body: ISubscriptionCreatedBody = req.body;

  if (body.alert_name === 'subscription_created') {
    return await createServer(req, body, res);
  } else {
    return res.send('Webhook not handled');
  }
});

async function createServer(req: functions.https.Request, body: ISubscriptionCreatedBody, res: functions.Response<any>) {
  const passthrough: IPassthrough = JSON.parse(body.passthrough);

  // firestore.Timestamp passed via paddle are converted to maps so need to change back to TS.
  const millis = passthrough.server.createdTime?.seconds * 1000;
  passthrough.server.createdTime = admin.firestore.Timestamp.fromMillis(millis);

  await admin
    .firestore()
    .doc(`servers/${passthrough.server.uid}`)
    .create({ ...passthrough.server, ...{ paddleSubscriptionId: body.subscription_id } });

  return res.status(200).send('Created');
}

interface ISubscriptionCreatedBody {
  alert_id: string;
  alert_name: 'subscription_payment_success' | 'subscription_created' | '...other paddle webhooks';
  cancel_url: string;
  checkout_id: string;
  currency: string;
  email: string;
  event_time: string;
  linked_subscriptions: string;
  marketing_consent: string;
  next_bill_date: string;
  passthrough: string; // Stringified IPassthrough
  quantity: string;
  source: string;
  status: string;
  subscription_id: string;
  subscription_plan_id: string;
  unit_price: string;
  update_url: string;
  user_id: string;
  p_signature: string;
}
