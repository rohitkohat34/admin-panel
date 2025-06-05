import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editedPrice, setEditedPrice] = useState('');
  const [editedDiscount, setEditedDiscount] = useState('');

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching the product list.");
      }
    } catch (error) {
      console.error("Error fetching the list:", error);
      toast.error("An error occurred.");
    }
  };

  const updatePriceAndDiscount = async (id) => {
    const token = localStorage.getItem('authToken');

    try {
      const response = await axios.post(
        `${url}/api/food/update-price`,
        {
          id,
          price: Number(editedPrice),
          discount: Number(editedDiscount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setEditMode(null);
        fetchList();
      } else {
        toast.error("Error updating price and discount.");
      }
    } catch (error) {
      console.error("Error updating price and discount:", error);
      toast.error("An error occurred.");
    }
  };

  const removeFood = async (foodId) => {
    const token = localStorage.getItem('authToken');

    try {
      const response = await axios.post(
        `${url}/api/food/remove`,
        { id: foodId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error("Error removing the product.");
      }
    } catch (error) {
      console.error("Error removing product:", error);
      toast.error("An error occurred.");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>All Product List</p>
      <div className='list-table'>
        <div className='list-table-format title'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Brand</b>
          <b>Price</b>
          <b>Discount</b>
          <b>Final Price</b>
          <b>Action</b>
        </div>

        {list.map((item) => (
          <div key={item._id} className='list-table-format'>
            {/* ✅ Display only the first image */}
            <img
              src={
                item.images && item.images.length > 0
                  ? `${url}/images/${item.images[0]}`
                  : `${url}/images/default.jpg`
              }
              alt={item.name}
              className="product-thumbnail"
            />

            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{item.brand || "N/A"}</p>

            <p>
              {editMode === item._id ? (
                <input
                  type="number"
                  value={editedPrice}
                  onChange={(e) => setEditedPrice(e.target.value)}
                />
              ) : (
                formatCurrency(item.price)
              )}
            </p>

            <p>
              {editMode === item._id ? (
                <input
                  type="number"
                  value={editedDiscount}
                  onChange={(e) => setEditedDiscount(e.target.value)}
                />
              ) : (
                formatCurrency(item.discount)
              )}
            </p>

            <p>{formatCurrency(item.price - item.discount)}</p>

            <div>
              {editMode === item._id ? (
                <button onClick={() => updatePriceAndDiscount(item._id)}>Save</button>
              ) : (
                <button
                  onClick={() => {
                    setEditMode(item._id);
                    setEditedPrice(item.price);
                    setEditedDiscount(item.discount);
                  }}
                >
                  Edit
                </button>
              )}
              <span onClick={() => removeFood(item._id)} className='cursor'>x</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
