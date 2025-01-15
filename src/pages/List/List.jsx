import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [editMode, setEditMode] = useState(null); // Track which item is being edited
  const [editedPrice, setEditedPrice] = useState(''); // Track the edited price

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching the food list.");
      }
    } catch (error) {
      console.error("Error fetching the list:", error);
      toast.error("An error occurred.");
    }
  };

  const updatePrice = async (id) => {
    try {
      const response = await axios.post(`${url}/api/food/update-price`, { id, price: editedPrice });
      if (response.data.success) {
        toast.success(response.data.message);
        setEditMode(null); // Exit edit mode
        fetchList(); // Refresh the list
      } else {
        toast.error("Error updating price.");
      }
    } catch (error) {
      console.error("Error updating price:", error);
      toast.error("An error occurred.");
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error("Error removing the food item.");
      }
    } catch (error) {
      console.error("Error removing food item:", error);
      toast.error("An error occurred.");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
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
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item) => (
          <div key={item._id} className='list-table-format'>
            <img src={`${url}/images/${item.image}`} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
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
            <div>
              {editMode === item._id ? (
                <button onClick={() => updatePrice(item._id)}>Save</button>
              ) : (
                <button onClick={() => {
                  setEditMode(item._id);
                  setEditedPrice(item.price); // Set current price for editing
                }}>
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
