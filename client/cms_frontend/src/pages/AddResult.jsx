import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const AddResult = () => {
  const navigate = useNavigate();
  
  // Data States
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Form States
  const [selectedSubject, setSelectedSubject] = useState('');
  const [marksData, setMarksData] = useState({}); // Stores { student_id: marks }

  // 1. Fetch available subjects for this staff on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axiosInstance.get('attendance/staff-stats/');
        // Extracting from the chart_data structure we saw in your console logs
        setSubjects(res.data.chart_data || []);
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
        setError("Could not load subjects. Please try again.");
      }
    };
    fetchSubjects();
  }, []);

  // 2. Fetch students when a subject is selected
  const handleSubjectChange = async (e) => {
    const subjectName = e.target.value;
    setSelectedSubject(subjectName);
    setStudents([]); // Reset student list
    setError(null);

    if (!subjectName) return;

    setLoading(true);
    try {
      // Hits the GetStudentsForResults view via query params
      const res = await axiosInstance.get('attendance/fetch-students-results/', {
        params: { subject: subjectName }
      });
      
      setStudents(res.data);
      
      // Initialize marks dictionary with empty strings
      const initialMarks = {};
      res.data.forEach(std => {
        initialMarks[std.id] = "";
      });
      setMarksData(initialMarks);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("No students found for this subject/course.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle mark input changes
  const handleMarkChange = (studentId, value) => {
    setMarksData(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  // 4. Submit all marks to SaveResultAPIView
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.post('attendance/save-result/', {
        subject_id: selectedSubject, // Sending name as the backend expects it
        marks_list: marksData
      });
      alert("✅ All results saved successfully!");
      navigate('/staff-home');
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Failed to save results. Please check your inputs.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-4 lg:p-10 lg:ml-72">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Add Exam Results</h1>
          <p className="text-slate-500 font-medium">Input marks for students enrolled in your assigned subjects.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-6 lg:p-10">
          
          {/* Subject Dropdown */}
          <div className="mb-10 max-w-md">
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-2 tracking-widest">
              Select Subject
            </label>
            <select 
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
              value={selectedSubject}
              onChange={handleSubjectChange}
            >
              <option value="">Choose a subject...</option>
              {subjects.map((sub, index) => (
                <option key={index} value={sub.subject_name}>
                  {sub.subject_name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Conditional Rendering for Student Table */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Fetching Enrollment...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center bg-rose-50 rounded-3xl border border-rose-100">
              <i className="fas fa-exclamation-circle text-rose-500 text-2xl mb-3"></i>
              <p className="text-rose-600 font-bold uppercase text-xs tracking-widest">{error}</p>
            </div>
          ) : students.length > 0 ? (
            <form onSubmit={handleSubmit}>
              <div className="overflow-x-auto rounded-3xl border border-slate-100 mb-8">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Name</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Username / Roll No</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-40">Exam Marks (100)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="p-5 font-bold text-slate-700">{student.full_name}</td>
                        <td className="p-5 text-slate-500 font-medium">{student.username}</td>
                        <td className="p-5">
                          <input 
                            type="number" 
                            min="0" max="100"
                            placeholder="0-100"
                            className="w-full text-center p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl font-black text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-400"
                            value={marksData[student.id] || ''}
                            onChange={(e) => handleMarkChange(student.id, e.target.value)}
                            required
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => navigate('/staff-home')}
                  className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving Data...' : 'Submit All Results'}
                </button>
              </div>
            </form>
          ) : (
            selectedSubject && (
              <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                <i className="fas fa-users-slash text-slate-200 text-4xl mb-4"></i>
                <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest">No Students Enrolled in this Course</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AddResult;