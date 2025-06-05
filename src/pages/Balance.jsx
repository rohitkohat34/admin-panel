import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Balance.css';  // Import the CSS file

const Balance = () => {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/vendorPayments/balances', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setBalances(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching balances', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, []);

  if (loading) return <div className="loading">Loading balances...</div>;

  return (
    <div className="balance-container">
      <h2 className="balance-title">Vendor Payment Balances</h2>
      {balances.length === 0 ? (
        <p className="no-balances">No balances to show.</p>
      ) : (
        <ul className="balance-list">
          {balances.map((payment) => (
            <li key={payment._id} className="balance-item">
              <span className="order-id">Order: {payment.orderId._id}</span>
              <span className="amount">Amount: ₹{payment.amount}</span>
              <span className={`status ${payment.paymentStatus.toLowerCase()}`}>
                Status: {payment.paymentStatus}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Balance;
