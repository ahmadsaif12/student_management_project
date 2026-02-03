import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddSession = () => {
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/curriculum/sessions/', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ 
            session_start_year: startYear, 
            session_end_year: endYear 
        }),
      });

      if (response.ok) {
        setMessage('Session added successfully!');
        setTimeout(() => navigate('/manage-session'), 1500);
      } else {
        setMessage('Failed to add session.');
      }
    } catch (err) {
      setMessage('Error connecting to server.');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4f6f9] ml-64">
      <div className="p-8 w-full">
        <div className="bg-white rounded shadow-md max-w-2xl mx-auto">
          <div className="bg-[#007bff] p-4 rounded-t">
            <h3 className="text-white font-bold uppercase text-sm">Add New Session</h3>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {message && <div className="p-3 bg-blue-100 text-blue-700 rounded text-sm">{message}</div>}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Start Date</label>
              <input 
                type="date" 
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session End Date</label>
              <input 
                type="date" 
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="bg-[#007bff] text-white px-6 py-2 rounded hover:bg-blue-600 transition shadow">
              Save Session
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSession;