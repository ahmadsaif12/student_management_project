import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const TakeAttendance = () => {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [students, setStudents] = useState([]);
    
    const [formData, setFormData] = useState({
        subject: '',
        session_year: '',
        attendance_date: new Date().toISOString().split('T')[0]
    });
    
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // 1. Fetch Dropdowns from the consolidated attendance endpoints
    useEffect(() => {
        const fetchDropdowns = async () => {
            try {
                const [subRes, sessRes] = await Promise.all([
                    axiosInstance.get('attendance/staff-subjects/'),
                    axiosInstance.get('attendance/sessions/')
                ]);
                setSubjects(subRes.data);
                setSessions(sessRes.data);
            } catch (err) {
                console.error("Error loading dropdowns", err);
                setMessage({ type: 'error', text: 'Failed to load initial data.' });
            }
        };
        fetchDropdowns();
    }, []);

    // 2. Fetch Student list based on subject and session
    const fetchStudentList = async () => {
        if (!formData.subject || !formData.session_year) {
            setMessage({ type: 'error', text: 'Select Subject and Session first.' });
            return;
        }
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            // Path matches path('fetch-students/', ...) in urls.py
            const res = await axiosInstance.post('attendance/fetch-students/', {
                subject: formData.subject,
                session_year: formData.session_year
            });
            
            if (res.data.length === 0) {
                setMessage({ type: 'error', text: 'No students found for this selection.' });
            }
            
            const initialData = res.data.map(s => ({ ...s, status: true }));
            setStudents(initialData);
        } catch (err) {
            console.error("Student Fetch Error:", err);
            setMessage({ type: 'error', text: 'Failed to load student list' });
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = (id) => {
        setStudents(prev => prev.map(s => 
            s.id === id ? { ...s, status: !s.status } : s
        ));
    };

    // 3. Save Attendance with debug logging to catch "Critical Error"
    const handleSaveAttendance = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const payload = {
                student_ids: students.map(s => ({ id: s.id, status: s.status })),
                subject_id: formData.subject,
                session_year_id: formData.session_year,
                attendance_date: formData.attendance_date
            };

            // Path matches path('save/', ...) in urls.py
            const response = await axiosInstance.post('attendance/save/', payload);
            
            if (response.status === 201) {
                setMessage({ type: 'success', text: 'Attendance marks secured successfully!' });
                // Small delay to allow the user to see the success message
                setTimeout(() => navigate('/staff-home'), 2000);
            }
        } catch (err) {
            // Log the actual backend error message to the console
            const errorMsg = err.response?.data?.error || 'Critical error while saving records.';
            console.error("Backend Error Detail:", errorMsg);
            setMessage({ type: 'error', text: `Error: ${errorMsg}` });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-10 lg:ml-72 transition-all duration-300">
            <div className="max-w-6xl mx-auto">
                
                {/* Header */}
                <header className="mb-10">
                    <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
                        Attendance Registry
                    </h1>
                    <p className="text-slate-500 font-medium tracking-tight">Mark and monitor daily student presence</p>
                </header>

                {/* Configuration Panel */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-white mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                            <select 
                                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all cursor-pointer"
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                value={formData.subject}
                            >
                                <option value="">Select Subject</option>
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.subject_name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Session</label>
                            <select 
                                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all cursor-pointer"
                                onChange={(e) => setFormData({...formData, session_year: e.target.value})}
                                value={formData.session_year}
                            >
                                <option value="">Select Session</option>
                                {sessions.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.session_start_year} — {s.session_end_year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button 
                                onClick={fetchStudentList}
                                disabled={loading}
                                className="w-full py-4 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-lg hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {loading ? 'Fetching...' : 'Load Student List'}
                            </button>
                        </div>
                    </div>
                </div>

                {message.text && (
                    <div className={`mb-8 p-6 rounded-3xl font-black uppercase text-[10px] tracking-widest border-2 ${
                        message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'
                    }`}>
                        {message.text}
                    </div>
                )}

                {/* Attendance Sheet */}
                {students.length > 0 && (
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="space-y-1 text-center md:text-left">
                                <h2 className="text-sm font-black text-slate-800 uppercase tracking-tighter">Marking Sheet</h2>
                                <p className="text-[10px] text-slate-400 font-bold uppercase italic tracking-wider">Click on a card to toggle status</p>
                            </div>
                            <input 
                                type="date" 
                                className="p-3 bg-white border-2 border-slate-100 rounded-xl font-bold text-slate-700 text-xs outline-none focus:border-indigo-500 shadow-sm"
                                value={formData.attendance_date}
                                onChange={(e) => setFormData({...formData, attendance_date: e.target.value})}
                            />
                        </div>

                        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                            {students.map(student => (
                                <div 
                                    key={student.id} 
                                    onClick={() => toggleStatus(student.id)}
                                    className={`group flex justify-between items-center p-5 rounded-3xl border-2 cursor-pointer transition-all duration-300 active:scale-95 ${
                                        student.status 
                                        ? 'border-emerald-100 bg-emerald-50/30 shadow-sm shadow-emerald-100' 
                                        : 'border-rose-100 bg-rose-50/30 shadow-sm shadow-rose-100'
                                    }`}
                                >
                                    <div className="flex flex-col">
                                        <span className="font-black text-slate-700 text-sm uppercase truncate max-w-[150px]">
                                            {student.name}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">ID: USER_{student.id}</span>
                                    </div>
                                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                                        student.status ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                                    }`}>
                                        {student.status ? 'Present' : 'Absent'}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="p-8 bg-slate-50/50 border-t border-slate-50 text-center">
                            <button 
                                onClick={handleSaveAttendance}
                                disabled={saving}
                                className="px-12 py-4 bg-indigo-600 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-indigo-200 hover:bg-slate-900 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                            >
                                {saving ? 'Submitting Registry...' : 'Commit Attendance Data'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && students.length === 0 && (
                    <div className="py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                         <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white shadow-inner">
                            <i className="fas fa-users text-slate-300 text-xl"></i>
                        </div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Select configuration to load students</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TakeAttendance;