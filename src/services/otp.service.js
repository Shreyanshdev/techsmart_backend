import axios from 'axios';

const BASE_URL = process.env.MSG_CENTRAL_BASE_URL || 'https://cpaas.messagecentral.com';
const CUSTOMER_ID = process.env.MSG_CENTRAL_CUSTOMER_ID;
const AUTH_KEY = process.env.MSG_CENTRAL_AUTH_KEY;

// Validate configuration
if (!CUSTOMER_ID || !AUTH_KEY) {
    console.warn("⚠️ Message Central credentials missing! OTP features will fail.");
}

export const otpService = {
    /**
     * Send OTP to a mobile number
     * @param {string} phone - 10 digit mobile number
     * @returns {Promise<{verificationId: string}>}
     */
    sendOtp: async (phone) => {
        try {
            const response = await axios.post(`${BASE_URL}/verification/v3/send`, null, {
                params: {
                    countryCode: '91',
                    mobileNumber: phone,
                    flowType: 'SMS'
                },
                headers: {
                    'authToken': AUTH_KEY
                }
            });

            if (response.data && response.data.responseCode === 200) {
                return {
                    verificationId: response.data.data.verificationId
                };
            } else {
                throw new Error(response.data?.message || 'Failed to send OTP');
            }
        } catch (error) {
            console.error('OTP Send Error:', error.response?.data || error.message);
            throw new Error('Failed to send OTP via Message Central');
        }
    },

    /**
     * Verify OTP
     * @param {string} phone - 10 digit mobile number
     * @param {string} verificationId - ID received from sendOtp
     * @param {string} code - OTP entered by user
     * @returns {Promise<boolean>}
     */
    verifyOtp: async (phone, verificationId, code) => {
        try {
            const response = await axios.get(`${BASE_URL}/verification/v3/validateOtp`, {
                params: {
                    countryCode: '91',
                    mobileNumber: phone,
                    verificationId: verificationId,
                    code: code
                },
                headers: {
                    'authToken': AUTH_KEY
                }
            });

            if (response.data && response.data.responseCode === 200) {
                // response.data.data.verificationStatus === 'VERIFIED'
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('OTP Verify Error:', error.response?.data || error.message);
            return false;
        }
    }
};
