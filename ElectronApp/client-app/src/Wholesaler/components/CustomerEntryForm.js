import React, { useState, useEffect } from 'react';
import { ImagePlus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import ToggleMenu from './ToggleMenu';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { addCustomer } from '../../Services/ContextStateManagement/Action/action';

const CustomerForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [img, setImg] = useState(null);

  const [formData, setFormData] = useState({
    customer_id: '',
    customer_name: '',
    customer_phno: '',
    customer_city: '',
    customer_password: '',
    customer_image: '',
    image_type: '',
  });

  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (location.state?.customer) {
      setFormData(location.state.customer);
    }
  }, [location.state]);

  useEffect(() => {
    if (img) {
      const objectUrl = URL.createObjectURL(img);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [img]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileimg = (e) => {
    const file = e.target.files[0];
  
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }
  
    setImg(file);
    setFormData((prevState) => ({
      ...prevState,
      customer_image: file,
      image_type: file.type, 
    }));
  };

  const submitData = async () => {
    try {
      console.log("FormData before submit:", formData);
      await addCustomer(formData, navigate);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data.errors || {});
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitData();
    navigate('/customerdetails');
  };

  const handleAddAnother = async () => {
    await submitData();
    setFormData({
      customer_id: '',
      customer_name: '',
      customer_phno: '',
      customer_city: '',
      customer_password: '',
      customer_image: '',
      image_type: '',
    });
    setPreview(null);
    setErrors({});
    navigate('/customerentry');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="h-screen w-screen bg-gray-100">
      <div className=" bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-purple-500 p-4 fixed left-0 right-0 top-0 flex items-center">
          <ToggleMenu />
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6 flex justify-center">
            <div className="relative w-32 mt-20 h-32 border-2 border-gray-300 rounded-lg flex items-center justify-center">
              {preview ? (
                <img
                  src={preview}
                  alt="Customer Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <ImagePlus className="text-gray-400 w-8 h-8" />
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileimg}
              />
            </div>
          </div>

          <div className="space-y-4 p-2">
            <div>
              <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700">Customer Name</label>
              <input
                type="text"
                id="customer_name"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
              {errors.customer_name && <p className="text-red-500 text-sm">{errors.customer_name}</p>}
            </div>

            <div>
              <label htmlFor="customer_phno" className="block text-sm font-medium text-gray-700">Phone No</label>
              <input
                type="tel"
                id="customer_phno"
                name="customer_phno"
                value={formData.customer_phno}
                onChange={handleChange}
                placeholder="Enter phone no"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
              {errors.customer_phno && <p className="text-red-500 text-sm">{errors.customer_phno}</p>}
            </div>

            <div>
              <label htmlFor="customer_city" className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                id="customer_city"
                name="customer_city"
                value={formData.customer_city}
                onChange={handleChange}
                placeholder="Enter address"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
              {errors.customer_city && <p className="text-red-500 text-sm">{errors.customer_city}</p>}
            </div>

            <div className="relative">
              <label htmlFor="customer_password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="customer_password"
                  name="customer_password"
                  value={formData.customer_password}
                  onChange={handleChange}
                  className="mt-1 block w-full pr-10 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                </span>
              </div>
              {errors.customer_password && <p className="text-red-500 text-sm">{errors.customer_password}</p>}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={handleAddAnother}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                + Add Another
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
