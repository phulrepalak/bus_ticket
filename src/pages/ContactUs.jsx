import React from "react";
import { useNavigate } from "react-router-dom";

export default function ContactUs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-left text-slate-800">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate("/")} 
          className="mb-6 text-sm font-semibold text-sky-600 hover:underline flex items-center gap-1"
        >
          ← Back to Home
        </button>
        
        <h1 className="text-3xl font-black text-slate-950 mb-2">Contact Us</h1>
        <p className="text-slate-500 mb-8">Have structural queries or urgent requests? Contact GoBus directly.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Customer Support Hotline</h3>
              <p className="text-xl font-black text-blue-900">+91 98765 43210</p>
              <p className="text-xs text-slate-500">Available Monday to Sunday (24/7)</p>
            </div>
            
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Email Queries</h3>
              <p className="text-xl font-black text-blue-900">support@gobus.com</p>
              <p className="text-xs text-slate-500">Expect a response within 12-24 hours.</p>
            </div>
            
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Head Office</h3>
              <p className="text-md font-bold text-slate-700">123 Bus Street, Connaught Place,</p>
              <p className="text-sm text-slate-600">New Delhi, Delhi, India - 110001</p>
            </div>
          </div>

          {/* Quick Info Board / Admin Notice */}
          <div className="bg-blue-900 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl">
            <div>
              <h3 className="text-lg font-black tracking-tight mb-2">For Admin Controls</h3>
              <p className="text-sm opacity-80 leading-relaxed">
                If you are a bus operator seeking to schedule assets, please login via the official admin panel to handle data schemas directly.
              </p>
            </div>
            <div className="border-t border-blue-800 pt-4 mt-6">
              <p className="text-xs opacity-60">GoBus Transport Solutions Pvt. Ltd.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}