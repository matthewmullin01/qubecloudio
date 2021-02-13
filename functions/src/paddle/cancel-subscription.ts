import axios from 'axios';
import * as functions from 'firebase-functions';

export async function cancelSubscription(subscriptionId: string) {
  try {
    await axios.post('https://vendors.paddle.com/api/2.0/subscription/users_cancel', {
      vendor_id: functions.config().paddle.vendor_id,
      vendor_auth_code: functions.config().paddle.vendor_auth_code,
      subscription_id: subscriptionId,
    });
    console.log('Canceled Paddle subscription - ' + subscriptionId);
    return;
  } catch (error) {
    console.error('Failed Canceled Paddle subscription - ' + subscriptionId + JSON.stringify(error));
    throw error;
  }
}
