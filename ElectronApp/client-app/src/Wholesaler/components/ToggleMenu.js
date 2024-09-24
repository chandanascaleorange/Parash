import React, { useState } from 'react';
import { X, User } from 'lucide-react';
import SidebarMenu from './ProfilePage'; 

const ToggleMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="p-2 bg-white rounded-full shadow-md"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <User className='text-black' size={24} />}
      </button>

      {isOpen && (
        <div className="fixed inset-y-0 left-0 z-40 w-64 md:w-1/2 bg-white shadow-lg transition-transform duration-300 ease-in-out transform translate-x-0">
          <SidebarMenu onClose={toggleMenu} />
        </div>
      )}
    </div>
  );
};

export default ToggleMenu;

