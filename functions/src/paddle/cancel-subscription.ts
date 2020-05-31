import axios from 'axios';

export async function cancelSubscription(subscriptionId: string) {
  try {
    await axios.post('https://vendors.paddle.com/api/2.0/subscription/users_cancel', {
      vendor_id: '102161',
      vendor_auth_code: '***REMOVED***',
      subscription_id: subscriptionId,
    });
    console.log('Canceled Paddle subscription - ' + subscriptionId);
    return;
  } catch (error) {
    console.error('Failed Canceled Paddle subscription - ' + subscriptionId + JSON.stringify(error));
    throw error;
  }
}
