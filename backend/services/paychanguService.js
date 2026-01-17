import axios from "axios";

const PAYCHANGU_SECRET_KEY = process.env.PAYCHANGU_SECRET_KEY;
const PAYCHANGU_BASE_URL = "https://api.paychangu.com";

/**
 * Initialize a payment with PayChangu
 * @param {Object} paymentData - { amount, email, first_name, last_name, callback_url, return_url, tx_ref }
 */
const initializePayment = async (paymentData) => {
  try {
    const response = await axios.post(
      `${PAYCHANGU_BASE_URL}/payment`,
      {
        ...paymentData,
        currency: "MWK", // Assuming Malawi Kwacha since PayChangu is Malawian
      },
      {
        headers: {
          Authorization: `Bearer ${PAYCHANGU_SECRET_KEY}`,
          Accept: "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "PayChangu Initialization Error:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Payment initialization failed",
    );
  }
};

/**
 * Verify a transaction
 * @param {string} tx_ref - Transaction reference
 */
const verifyTransaction = async (tx_ref) => {
  try {
    const response = await axios.get(
      `${PAYCHANGU_BASE_URL}/verify-payment/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${PAYCHANGU_SECRET_KEY}`,
          Accept: "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "PayChangu Verification Error:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Payment verification failed",
    );
  }
};

export { initializePayment, verifyTransaction };
