import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const AddResult = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [marksData, setMarksData] = useState({});

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axiosInstance.get('attendance/staff-stats/');
        setSubjects(res.data.chart_data || []);
      } catch (err) {
        setError("Failed to load subjects.");
      }
    };
    fetchSubjects();
  }, []);

  const handleSubjectChange = async (e) => {
    const val = e.target.value;
    setSelectedSubject(val);
    setStudents([]); 
    setError(null);

    if (!val) return;

    setLoading(true);
    try {
      const res = await axiosInstance.get('operations/manage-results/', {
        params: { subject_id: val } 
      });
      setStudents(res.data);
      const initialMarks = {};
      res.data.forEach(std => { initialMarks[std.id] = ""; });
      setMarksData(initialMarks);
    } catch (err) {
      setError("No students found or server error.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.post('operations/manage-results/', {
        subject_id: selectedSubject,
        marks_list: marksData
      });
      alert("Marks saved successfully!");
      navigate('/staff-home');
    } catch (err) {
      alert("Error saving marks.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-4 lg:p-10 lg:ml-72">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
              Grade Students
            </h1>
            <p className="text-slate-500 font-medium italic">Input final examination scores</p>
          </div>
          
          <button 
            onClick={() => navigate('/staff-home')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
          >
            Cancel
          </button>
        </header>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-white">
          
          {/* Subject Selector */}
          <div className="mb-10">
            <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3 block">
              Choose Academic Module
            </label>
            <select 
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
              value={selectedSubject}
              onChange={handleSubjectChange}
            >
              <option value="">-- SELECT SUBJECT --</option>
              {subjects.map((sub, i) => (
                <option key={i} value={sub.id || sub.subject_name}>
                  {sub.subject_name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching Registry...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-rose-50 text-rose-600 rounded-2xl border-2 border-rose-100 text-center font-bold">
              {error}
            </div>
          ) : students.length > 0 ? (
            <form onSubmit={handleSubmit} className="animate-in fade-in duration-500">
              <div className="overflow-hidden rounded-3xl border border-slate-100 shadow-inner bg-slate-50/50">
                <table className="w-full text-left">
                  <thead className="bg-slate-100/50">
                    <tr>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Identification</th>
                      <th className="p-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest w-40">Score (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((std) => (
                      <tr key={std.id} className="group hover:bg-white transition-colors">
                        <td className="p-5 font-bold text-slate-700 uppercase tracking-tight">
                          {std.full_name}
                        </td>
                        <td className="p-5 text-center">
                          <input 
                            type="number" min="0" max="100"
                            placeholder="00"
                            className="w-24 p-3 bg-white border-2 border-slate-200 rounded-xl text-center font-black text-indigo-600 text-lg outline-none focus:border-indigo-500 focus:shadow-lg focus:shadow-indigo-100 transition-all"
                            value={marksData[std.id] || ''}
                            onChange={(e) => setMarksData({...marksData, [std.id]: e.target.value})}
                            required
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button 
                type="submit" 
                disabled={saving}
                className="mt-10 w-full py-5 bg-indigo-600 text-white font-black uppercase text-xs tracking-[0.2em] rounded-3xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0"
              >
                {saving ? 'Syncing Records...' : 'Finalize & Post Results'}
              </button>
            </form>
          ) : (
            selectedSubject && (
              <div className="py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No candidates found for this module.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AddResult;