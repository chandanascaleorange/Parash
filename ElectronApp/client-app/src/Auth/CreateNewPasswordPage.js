import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResetPassword } from '../Services/ContextStateManagement/Action/action';
import { jwtDecode } from 'jwt-decode';
import { ChevronLeft } from 'lucide-react';

function CreateNewPassword() {
  const [prevsPassword, setPrevsPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(false);
  const navigate = useNavigate();
 



  useEffect(() => {
    const checkPreviousPassword = async () => {
      if (prevsPassword.length > 0) {
        try {
             const token = localStorage.getItem('access_token');
             const decode = jwtDecode(token);
              
          if (prevsPassword===decode.userPsw) {
            setPasswordMatch('Password matches');
          } else {
            setPasswordMatch('Password does not match');
          }
        } catch (error) {
          setPasswordMatch('Error checking password');
        }
      } else {
        setPasswordMatch('');
      }
    };
    checkPreviousPassword();
  }, [prevsPassword]);

  const handleSubmit = async () => {
    setError('');
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const token = localStorage.getItem('access_token');
    const decode = jwtDecode(token);
    const result = await ResetPassword(newPassword,decode.userId,navigate);

    if (result.message === "Password reset successful") {
      if(decode.userId===1){navigate('/');}
      else{ navigate('/userOrdersPage'); }
      
    } else {
      setError(result.message || "An error occurred");
    }
  };
  const handleLeftclick = ()=>{
    const token = localStorage.getItem('access_token');
    const decode = jwtDecode(token);
    if(decode.userId===1){navigate('/');}
    else{ navigate('/userOrdersPage'); }    
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
      <button on onClick={handleLeftclick}>
        <ChevronLeft />
      </button>
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">Create New Password</h2>
        
        {error && <p className="text-red-500 text-center">{error}</p>}
        {passwordMatch && <p className="text-green-500 text-center">{passwordMatch}</p>}
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="old-password">
            Your Password
          </label>
          <input
            className="shadow appearance-none border mb-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="old-password"
            type="password"
            placeholder="Enter your current password"
            value={prevsPassword}
            onChange={(e) => setPrevsPassword(e.target.value)}
          />
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new-password">
            New Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="new-password"
            type="password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
            Confirm Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="confirm-password"
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button 
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleSubmit}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}

export default CreateNewPassword;
