import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState({ fullName: "", email: "", gender: "" });
  const [originalUser, setOriginalUser] = useState(null); // Backup for cancel
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: token }
        });

        if (res.data.isProfileComplete === false) {
          navigate("/complete-profile");
          return;
        }

        setUser(res.data);
        setOriginalUser(res.data); // Set backup data
        setLoading(false);
      } catch (err) {
        console.error("Profile load error:", err);
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate, token]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setUser(originalUser); // Restore from backup
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      try {
        const res = await axios.put("http://localhost:5000/api/auth/update-profile", user, {
          headers: { Authorization: token }
        });
        
        if (res.status === 200) {
          alert("Profile updated successfully!");
          setOriginalUser(user); // Update backup to new data
          setIsEditing(false);
        }
      } catch (err) {
        console.error("Update failed:", err);
        alert("Failed to update profile");
      }
    }
  };

 if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="h-10 w-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex items-center justify-center p-6 font-sans">
      
      <div className="w-full max-w-5xl grid lg:grid-cols-12 gap-12 items-center">
        
        {/* LEFT SIDE: THE ROUNDED PROFILE COMPONENT */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-[380px] h-[380px] rounded-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col items-center justify-center p-10 text-center relative overflow-hidden">
            {/* Subtle background decoration for the circle */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full opacity-50"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-blue-800 rounded-[2rem] flex items-center justify-center text-4xl font-black text-white mb-6 shadow-xl shadow-indigo-200">
                {user.fullName ? user.fullName[0].toUpperCase() : "U"}
              </div>
              
              <h2 className="text-3xl font-black text-slate-1000 mb-1 tracking-tight">
                {user.fullName || "User"}
              </h2>
              <p className="text-slate-600 text-sm mb-8 font-medium">{user.email}</p>
              
              <div className="w-full space-y-3 px-6">
                <button className="w-full flex items-center justify-center gap-3 py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-bold text-sm transition-all hover:bg-indigo-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Personal Details
                </button>
                <button onClick={() => navigate("/")} className="w-full flex items-center justify-center gap-3 py-3 text-slate-400 rounded-2xl font-bold text-sm transition-all hover:text-slate-600 hover:bg-slate-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  Back to Portal
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: EDITABLE CONTENT AREA */}
        <div className="lg:col-span-7 bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-slate-50">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-800">Settings</h1>
              <p className="text-slate-400 font-medium mt-1">Manage your account identity</p>
            </div>
            {isEditing && (
              <div className="bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100 animate-pulse">
                Editing Mode
              </div>
            )}
          </div>

          <div className="space-y-10">
            {/* FULL NAME */}
            <div className="group transition-all">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1">Full Name</label>
              {isEditing ? (
                <input 
                  type="text" 
                  name="fullName" 
                  value={user.fullName} 
                  onChange={handleChange} 
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none transition-all"
                />
              ) : (
                <p className="text-xl font-bold text-slate-800 px-1">{user.fullName || "Not Specified"}</p>
              )}
            </div>

            {/* EMAIL */}
            <div className="group transition-all">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1">Email Address</label>
              {isEditing ? (
                <input 
                  type="email" 
                  name="email" 
                  value={user.email} 
                  onChange={handleChange} 
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none transition-all"
                />
              ) : (
                <p className="text-xl font-bold text-slate-800 px-1">{user.email}</p>
              )}
            </div>

            {/* GENDER */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block px-1">Gender Identity</label>
              <div className="flex gap-3">
                {["Male", "Female", "Other"].map((g) => (
                  <button 
                    key={g} 
                    type="button" 
                    disabled={!isEditing} 
                    onClick={() => setUser({ ...user, gender: g })}
                    className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all
                      ${user.gender === g 
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                        : 'bg-slate-50 text-slate-400 border border-transparent ' + (isEditing ? 'hover:bg-slate-100 hover:text-slate-600' : 'opacity-50')}`}
                  > {g} </button>
                ))}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="pt-6 flex gap-4">
              <button 
                onClick={handleUpdate} 
                className={`flex-[2] py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all transform active:scale-95 shadow-xl
                ${isEditing 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100' 
                  : 'bg-slate-900 hover:bg-black text-white shadow-slate-200'}`}
              >
                {isEditing ? "Save Configuration" : "Edit Profile Info"}
              </button>
              
              {isEditing && (
                <button onClick={handleCancel} className="w-full text-gray-500 text-xs font-bold hover:text-red-500 transition-colors uppercase tracking-widest">Cancel Editing</button>
              )}
              {!isEditing && (
                <button onClick={() => navigate("/")} className="w-full text-gray-400 text-xs font-bold hover:text-blue-600 transition-colors uppercase tracking-widest">Back to Home</button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;