import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { curriculumService } from '../api/curriculumService';

const ManageSession = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const data = await curriculumService.getSessions();
      setSessions(data);
    } catch (err) {
      console.error("Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        await curriculumService.deleteSession(id);
        setSessions(prev => prev.filter((s) => s.id !== id));
      } catch (err) {
        alert(err.message || "Failed to delete session");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4f6f9] ml-64">
      <div className="p-8 w-full">
        
        {/* NAV BAR */}
        <div className="mb-6 flex justify-between items-center">
          <button 
            onClick={() => navigate('/admin-home')}
            className="bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 px-6 py-2.5 rounded-lg text-xs font-bold tracking-widest transition-all shadow-sm flex items-center gap-2"
          >
            🏠 HOME
          </button>
          
          <button 
            onClick={() => navigate('/add-session')}
            className="bg-[#007bff] text-white px-6 py-2.5 rounded-lg text-xs font-bold tracking-widest hover:bg-blue-600 transition shadow-md flex items-center gap-2"
          >
            ➕ ADD SESSION
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#3c8dbc] p-4">
            <h3 className="text-white font-bold uppercase text-xs tracking-widest">
              Session Database
            </h3>
          </div>
          
          <div className="p-0"> 
            {loading ? (
              <div className="p-20 text-center text-gray-400 font-bold animate-pulse">
                LOADING...
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-[10px] uppercase font-black tracking-widest border-b border-gray-100">
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Start Date</th>
                    <th className="py-4 px-6">End Date</th>
                    <th className="py-4 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sessions.map((session) => (
                    <tr key={session.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-4 px-6 text-sm text-gray-500">#{session.id}</td>
                      <td className="py-4 px-6 font-semibold text-gray-700">{session.session_start_year}</td>
                      <td className="py-4 px-6 font-semibold text-gray-700">{session.session_end_year}</td>
                      <td className="py-4 px-6 text-center">
                        <button 
                          onClick={() => handleDelete(session.id)}
                          className="bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 mx-auto text-xs font-bold"
                        >
                          <i className="fas fa-trash-alt"></i>
                          DELETE
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            
            {!loading && sessions.length === 0 && (
              <div className="py-20 text-center text-gray-400 italic">
                No active sessions found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSession;