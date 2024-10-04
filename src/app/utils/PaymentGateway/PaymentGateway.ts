/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import config from '../../config';

export const initiatePayment = async (paymentData: any) => {
  try {
    const response = await axios.post(config.payment_url as string, {
      store_id: config.store_id,
      signature_key: config.signature_key,
      tran_id: paymentData.transactionId,
      success_url: `https://cook-nest-backend.vercel.app/api/v1/user/confirmation?transactionId=${paymentData.transactionId}&status=success`,
      fail_url: `https://cook-nest-backend.vercel.app/api/v1/user/confirmation?status=failed`,
      cancel_url: 'https://cook-nest-client.vercel.app',
      amount: '150',
      currency: 'BDT',
      desc: 'Premium Membership Payment',
      cus_name: paymentData.custormerName,
      cus_email: paymentData.customerEmail,
      cus_add1: 'N/A',
      cus_add2: 'N/A',
      cus_city: 'N/A',
      cus_state: 'N/A',
      cus_postcode: 'N/A',
      cus_country: 'N/A',
      cus_phone: 'N/A',
      type: 'json',
    });

    return response.data;
  } catch (err) {
    throw new Error('Payment initialization failed!');
  }
};

export const verifyPayment = async (tnxId: string) => {
  try {
    const response = await axios.get(
      config.payment_verification_url as string,
      {
        params: {
          store_id: config.store_id,
          signature_key: config.signature_key,
          type: 'json',
          request_id: tnxId,
        },
      },
    );

    return response.data;
  } catch (err) {
    throw new Error('Payment validation failed!');
  }
};
