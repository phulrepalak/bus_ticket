import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState({ fullName: "", email: "", gender: "" });
  const [originalUser, setOriginalUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Fetch complete profile datasets on identity mount state
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
        setOriginalUser(res.data); 
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
    setUser(originalUser); 
    setIsEditing(false);
  };

  // Sync profile details mutation state with backend repository
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
          setOriginalUser(user); 
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-3 sm:p-4 md:p-6 antialiased">
      <div className="bg-white rounded-3xl shadow-xl max-w-5xl w-full overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Informational Structural Branding Column */}
        <div className="w-full md:w-1/2 bg-white p-6 sm:p-8 md:p-12 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 mb-3 sm:mb-4 leading-tight">
            Your Journey <br /> 
            <span className="text-blue-600">with GoBus</span>
          </h2>
          <p className="text-xs sm:text-sm md:text-lg text-gray-500 mb-6 sm:mb-8 leading-relaxed">
            Keep your profile details updated to enjoy a personalized travel experience.
          </p>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 w-full hidden sm:block">
            <img 
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1000" 
              alt="GoBus Travel" 
              className="w-full h-48 md:h-64 object-cover"
            />
          </div>
        </div>

        {/* Right Input Form Values Module Area */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center bg-slate-50/50">
          <div className="flex items-center justify-between mb-6 sm:mb-8 gap-2">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Account Details</h3>
            <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
              {isEditing ? "Editing Mode" : "Verified Account"}
            </div>
          </div>

          <div className="space-y-5 sm:space-y-6 w-full">
            <div className="w-full">
              <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
              {isEditing ? (
                <input type="text" name="fullName" value={user.fullName} onChange={handleChange} className="w-full p-3.5 sm:p-4 bg-white border-2 border-blue-400 rounded-xl text-sm sm:text-base text-slate-700 font-semibold focus:outline-none" />
              ) : (
                <div className="w-full p-3.5 sm:p-4 bg-white border border-gray-200 rounded-xl text-sm sm:text-base text-slate-700 font-semibold shadow-sm truncate">{user.fullName || "Not Provided"}</div>
              )}
            </div>

            <div className="w-full">
              <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
              {isEditing ? (
                <input type="email" name="email" value={user.email} onChange={handleChange} className="w-full p-3.5 sm:p-4 bg-white border-2 border-blue-400 rounded-xl text-sm sm:text-base text-slate-700 font-semibold focus:outline-none" />
              ) : (
                <div className="w-full p-3.5 sm:p-4 bg-white border border-gray-200 rounded-xl text-sm sm:text-base text-slate-700 font-semibold shadow-sm truncate">{user.email || "Not Linked"}</div>
              )}
            </div>

            <div className="w-full">
              <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Gender</label>
              <div className="flex gap-2 sm:gap-3 w-full">
                {["Male", "Female", "Other"].map((g) => (
                  <button key={g} type="button" disabled={!isEditing} onClick={() => setUser({ ...user, gender: g })}
                    className={`flex-1 py-2.5 sm:py-3 px-2 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all truncate
                      ${user.gender === g ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-400 border-gray-200 ' + (!isEditing ? 'opacity-60 cursor-not-allowed' : 'hover:border-blue-400')}`}
                  > {g} </button>
                ))}
              </div>
            </div>

            <div className="pt-4 space-y-3 w-full">
              <button type="button" onClick={handleUpdate} className={`w-full font-bold py-3.5 sm:py-4 rounded-xl shadow-lg transition-all text-xs sm:text-sm tracking-wide transform active:scale-98 ${isEditing ? 'bg-green-600 hover:bg-green-700 shadow-green-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'} text-white`}>
                {isEditing ? "Save Profile Changes" : "Update Profile Info"}
              </button>
              {isEditing && (
                <button type="button" onClick={handleCancel} className="w-full text-gray-500 text-[10px] sm:text-xs font-bold hover:text-red-500 transition-colors uppercase tracking-widest block text-center py-1">Cancel Editing</button>
              )}
              {!isEditing && (
                <button type="button" onClick={() => navigate("/")} className="w-full text-gray-400 text-[10px] sm:text-xs font-bold hover:text-blue-600 transition-colors uppercase tracking-widest block text-center py-1">Back to Home</button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;