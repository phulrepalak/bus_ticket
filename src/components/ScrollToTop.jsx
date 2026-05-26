import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // page auto-scroll to top on route change
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; 
}