import React, { useState } from 'react'; 
import './Add.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = ({ url }) => {
  const [images, setImages] = useState([]);  // Changed to an array to hold multiple images
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    category: "AC",
    brand: ""  // Added brand field
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onImageChange = (event) => {
    setImages(event.target.files);  // Set multiple selected images
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('authToken');  // Adjust the key based on your local storage key

    if (!token) {
      toast.error('You are not logged in. Please log in to add a product.');
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("discount", Number(data.discount));
    formData.append("category", data.category);
    formData.append("brand", data.brand); // Append brand

    // Append each selected image
    Array.from(images).forEach(image => {
      formData.append("images", image);
    });

    try {
      const response = await axios.post(`${url}/api/food/add`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,  // Include the token in the Authorization header
        },
      });

      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          discount: "",
          category: "AC",
          brand: "" // Reset brand field
        });
        setImages([]); // Clear selected images
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('An error occurred while adding the product.');
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Images</p>
          <label htmlFor="images">
            <img src={images.length ? URL.createObjectURL(images[0]) : assets.upload_area} alt="" />
          </label>
          <input onChange={onImageChange} type="file" id="images" hidden multiple required />
          <div>
            {Array.from(images).map((image, index) => (
              <img key={index} src={URL.createObjectURL(image)} alt={`preview-${index}`} style={{ width: '100px', margin: '10px' }} />
            ))}
          </div>
        </div>

        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input onChange={onChangeHandler} value={data.name} type="text" name="name" placeholder="Type Here" />
        </div>

        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder="Write Content Here" required></textarea>
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select onChange={onChangeHandler} name="category">
              <option value="Air-Conditioner">Air-Conditioner</option>
              <option value="Washing Machine">Washing Machine</option>
              <option value="Deep Freezer">Deep Freezer</option>
              <option value="Refrigerator">Refrigerator</option>
              <option value="Geyser">Geyser</option>
              <option value="Air Cooler">Air Cooler</option>
              <option value="Water Purifier">Water Purifier</option>
              <option value="TV">TV</option>
            </select>
          </div>

          <div className="add-brand flex-col">
            <p>Brand</p>
            <select onChange={onChangeHandler} name="brand">
              <option value="">Select Brand</option>
              <option value="Godrej">Godrej</option>
              <option value="LG">LG</option>
              <option value="Whirlpool">Whirlpool</option>
              <option value="Haier">Haier</option>
              <option value="Panasonic">Panasonic</option>
              <option value="Aquaguard">Aquaguard</option>
              <option value="Kent">Kent</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product Price</p>
            <input onChange={onChangeHandler} value={data.price} type="number" name="price" placeholder="₹0" />
          </div>

          <div className="add-price flex-col">
            <p>Discount Price</p>
            <input onChange={onChangeHandler} value={data.discount} type="number" name="discount" placeholder="₹0" />
          </div>
        </div>

        <button type="submit" className="add-btn">ADD</button>
      </form>
    </div>
  );
};

export default Add;
