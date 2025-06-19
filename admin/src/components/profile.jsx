import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Hello, {user.username} 👋</h1>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Role:</span>{' '}
          <span className={`font-semibold ${user.role === 'admin' ? 'text-red-500' : 'text-blue-500'}`}>
            {user.role}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Profile;
