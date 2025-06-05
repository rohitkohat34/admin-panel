import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Payment.css';

const Payment = () => {
  const [vendorBalances, setVendorBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/vendorPayments/balances', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setVendorBalances(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching balances', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, []);

  const handlePay = async (payment) => {
    try {
      const token = localStorage.getItem('token');
  
      const res = await axios.post(
        '/api/vendorPayments/create',
        {
          orderId: payment.orderId._id,
          paymentMethod: 'Razorpay',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const { razorpayOrderId, razorpayKey, amount: finalAmount, vendorPaymentId } = res.data;
  
      const options = {
        key: razorpayKey,
        amount: finalAmount * 100,
        currency: 'INR',
        name: 'Vendor Payment',
        description: `Order ID: ${payment.orderId._id}`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          await axios.post(
            '/api/vendorPayments/update-status',
            {
              vendorPaymentId,
              paymentStatus: 'Paid',
              razorpayPaymentId: response.razorpay_payment_id,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          alert('Payment successful!');
          window.location.reload();
        },
        prefill: {
          name: 'Vendor User',
          email: 'vendor@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#3399cc',
        },
      };
  
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error('Razorpay Error:', error);
      alert('Error initiating Razorpay payment');
    }
  };
  

  if (loading) return <div className="loading">Loading balances...</div>;

  return (
    <div className="payment-container">
      <h2 className="payment-title">Pending Vendor Payments</h2>
      {vendorBalances.length === 0 ? (
        <p className="no-payments">No pending payments.</p>
      ) : (
        <div className="card-grid">
        {vendorBalances.map((payment) => (
  <div key={payment._id} className="payment-card">
    <h5>Order ID: {payment.orderId._id}</h5>
    <p>Amount: ₹{payment.amount}</p>
    <p>Status: {payment.paymentStatus}</p>
    <p>Method: {payment.paymentMethod}</p>

    {payment.paymentStatus !== 'Paid' && (
      <button className="pay-button" onClick={() => handlePay(payment)}>
        Pay Now
      </button>
    )}
  </div>
))}

        </div>
      )}
    </div>
  );
};

export default Payment;
