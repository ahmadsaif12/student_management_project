import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const TakeAttendance = () => {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [students, setStudents] = useState([]);
    
    // Form State
    const [formData, setFormData] = useState({
        subject: '',
        session_year: '',
        attendance_date: new Date().toISOString().split('T')[0] // Default to today
    });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Load initial dropdown data (Assuming you have these endpoints)
    useEffect(() => {
        const fetchDropdowns = async () => {
            try {
                const subRes = await axiosInstance.get('accounts/staff-subjects/'); // Customize if needed
                const sessRes = await axiosInstance.get('accounts/sessions/'); 
                setSubjects(subRes.data);
                setSessions(sessRes.data);
            } catch (err) {
                console.error("Error loading dropdowns", err);
            }
        };
        fetchDropdowns();
    }, []);

    // Step 1: Fetch Students for the selected criteria
    const fetchStudentList = async () => {
        if (!formData.subject || !formData.session_year) {
            alert("Please select Subject and Session Year");
            return;
        }
        setLoading(true);
        try {
            const res = await axiosInstance.post('attendance/get-students/', {
                subject: formData.subject,
                session_year: formData.session_year
            });
            // Initialize every student as "Present" (true)
            const initialData = res.data.map(s => ({ ...s, status: true }));
            setStudents(initialData);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load students' });
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Toggle Status
    const toggleStatus = (id) => {
        setStudents(prev => prev.map(s => 
            s.id === id ? { ...s, status: !s.status } : s
        ));
    };

    // Step 3: Save to Backend
    const handleSaveAttendance = async () => {
        try {
            const payload = {
                student_ids: students.map(s => ({ id: s.id, status: s.status })),
                subject_id: formData.subject,
                session_year_id: formData.session_year,
                attendance_date: formData.attendance_date
            };
            await axiosInstance.post('attendance/save/', payload);
            setMessage({ type: 'success', text: 'Attendance Saved Successfully!' });
            setTimeout(() => navigate('/staff-home'), 2000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Error saving records' });
        }
    };

    return (
        <div className="p-6 bg-[#f4f6f9] min-h-screen">
            <h1 className="text-2xl font-semibold mb-6">Take Attendance</h1>

            {/* Selection Form */}
            <div className="bg-white p-6 rounded shadow-sm mb-6 border-t-4 border-blue-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-2">Subject</label>
                        <select 
                            className="w-full border p-2 rounded text-sm"
                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        >
                            <option value="">Select Subject</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.subject_name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Session Year</label>
                        <select 
                            className="w-full border p-2 rounded text-sm"
                            onChange={(e) => setFormData({...formData, session_year: e.target.value})}
                        >
                            <option value="">Select Session</option>
                            {sessions.map(s => <option key={s.id} value={s.id}>{s.session_start_year} - {s.session_end_year}</option>)}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button 
                            onClick={fetchStudentList}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full"
                        >
                            Fetch Students
                        </button>
                    </div>
                </div>
            </div>

            {message.text && (
                <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {/* Attendance Sheet */}
            {students.length > 0 && (
                <div className="bg-white rounded shadow-sm overflow-hidden border-t-4 border-green-500">
                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                        <input 
                            type="date" 
                            className="border p-1 text-sm rounded"
                            value={formData.attendance_date}
                            onChange={(e) => setFormData({...formData, attendance_date: e.target.value})}
                        />
                        <span className="text-xs text-gray-500 italic">Green = Present | Red = Absent</span>
                    </div>
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {students.map(student => (
                            <div 
                                key={student.id} 
                                onClick={() => toggleStatus(student.id)}
                                className={`flex justify-between items-center p-3 border rounded cursor-pointer transition-all ${student.status ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}
                            >
                                <span className="font-medium text-sm">{student.name}</span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold text-white ${student.status ? 'bg-green-500' : 'bg-red-500'}`}>
                                    {student.status ? 'PRESENT' : 'ABSENT'}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-gray-50 border-t">
                        <button 
                            onClick={handleSaveAttendance}
                            className="bg-green-600 text-white px-10 py-2 rounded hover:bg-green-700 font-bold"
                        >
                            Save Attendance
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TakeAttendance;