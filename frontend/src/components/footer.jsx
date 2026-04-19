import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = ({ isAdmin: isAdminProp }) => {
  const [isAdmin, setIsAdmin] = useState(isAdminProp);
  const location = useLocation(); 

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(isAdminProp ?? (role === "admin"));
  }, [isAdminProp, location]);

  // --- Dynamic Links ---
  const adminLinks = [
    { name: 'Home', path: '/' },
    { name: 'Search Buses', path: '/search' },
    { name: 'Add Bus', path: '/admin/add-bus' },
    { name: 'Manage Buses', path: '/admin/manage-buses' },
    { name: 'Profile', path: '/profile' },
  ];

  const userLinks = [
    { name: 'Home', path: '/' },
    { name: 'Search Buses', path: '/search' },
    { name: 'My Bookings', path: '/my-bookings' },
    { name: 'Profile', path: '/profile' },
  ];

  const currentLinks = isAdmin ? adminLinks : userLinks;

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* 1. Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-sky-100 p-1.5 rounded-lg">
                <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                GoBus 
                {isAdmin && <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded uppercase tracking-wider">Admin</span>}
              </h3>
            </div>
            <p className="text-sm leading-relaxed">
              {isAdmin 
                ? "Admin Control Panel: Manage routes, update bus schedules, and monitor system activities efficiently."
                : "Your trusted partner for comfortable and reliable bus travel across India. Book tickets easily with our platform."}
            </p>
          </div>

          {/* 2. Quick Links (Dynamic) */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">
              {isAdmin ? "Management" : "Quick Links"}
            </h4>
            <ul className="space-y-2">
              {currentLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="hover:text-sky-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Support Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/help" className="hover:text-sky-400 transition-colors">Help Center</Link></li>
              <li><Link to="/faq" className="hover:text-sky-400 transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-sky-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/terms" className="hover:text-sky-400 transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* 4. Contact Details */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2">
                <span className="text-sky-400">📍</span> 123 Bus Street, Delhi, India
              </p>
              <p className="flex items-center gap-2">
                <span className="text-sky-400">📞</span> +91 98765 43210
              </p>
              <p className="flex items-center gap-2">
                <span className="text-sky-400">✉️</span> support@gobus.com
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} GoBus. All rights reserved. {isAdmin ? "Admin Portal" : "User Portal"}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;