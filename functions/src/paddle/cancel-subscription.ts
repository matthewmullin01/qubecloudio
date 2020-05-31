import axios from 'axios';

export async function cancelSubscription(subscriptionId: string) {
  try {
    await axios.post('https://vendors.paddle.com/api/2.0/subscription/users_cancel', {
      vendor_id: '102161',
      vendor_auth_code: '025e13773a24964423c4761363ed123e3d216af2ff6f7a8225',
      subscription_id: subscriptionId,
    });
    console.log('Canceled Paddle subscription - ' + subscriptionId);
    return;
  } catch (error) {
    console.error('Failed Canceled Paddle subscription - ' + subscriptionId + JSON.stringify(error));
    throw error;
  }
}
