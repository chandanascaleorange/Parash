import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import ToggleMenu from '../../Retailers/ToggleMenu';

const ContactUs = () => {
  return (
    <div className="bg-gradient-to-l from-purple-500 to-indigo-600 min-h-screen p-8">
         <ToggleMenu />
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-extrabold text-white mb-4">Get in Touch</h1>
        <p className="text-lg text-gray-200 mb-8">
          Choose Life Over Smoke — Quit Today...
        </p>
      </div>

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8">
        
        {/* Address and Contact Info */}
        <div className="bg-white w-full md:w-1/3 rounded-lg shadow-xl p-8 text-center">
          <h2 className="text-3xl font-semibold text-purple-700 mb-6">Our Store</h2>
          <p className="text-gray-600 mb-6">Every Puff is a Step Closer to Disease</p>
          
          <ul className="space-y-4 text-left">
            <li className="flex items-center justify-center text-gray-700">
              <MapPin className="mr-3 text-indigo-600" /> 
              <span className="font-semibold"> Hyderabad, Madhapur</span>
            </li>
            <li className="flex items-center justify-center text-gray-700">
              <Phone className="mr-3 text-indigo-600" /> 
              <span className="font-semibold">+91 123456789</span>
            </li>
            <li className="flex items-center justify-center text-gray-700">
              <Mail className="mr-3 text-indigo-600" /> 
              <span className="font-semibold">support@gutka.com</span>
            </li>
          </ul>
        </div>

        {/* About Our Products */}
        <div className="bg-white w-full md:w-2/3 rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-semibold text-purple-700 mb-6">Be Careful!!</h2>
          <p className="text-gray-600 mb-4">
            Secondhand smoke is dangerous as well, affecting those around smokers. Non-smokers, especially children, are vulnerable to respiratory infections, asthma, and heart diseases due to exposure.
          </p>
          <p className="text-gray-600">
            Smoking causes injurious to health !! Be safe...
          </p>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto mt-16">
        <h2 className="text-3xl font-semibold text-white mb-6 text-center">Find Us</h2>
        <div className="flex justify-center">
          <iframe
            className="w-full h-96 rounded-lg shadow-lg"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345086176!2d144.95592531550484!3d-37.81720957975195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf5776beefdb02ad4!2sChocolate+Lane!5e0!3m2!1sen!2sus!4v1565829321849!5m2!1sen!2sus"
            allowFullScreen
            title="Store Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;