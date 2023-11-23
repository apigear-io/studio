import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const usePageTracker = () => {
  const location = useLocation();
  useEffect(() => {
    console.log("track page:", location.pathname + location.search);
  }, [location]);
};

export default usePageTracker;
