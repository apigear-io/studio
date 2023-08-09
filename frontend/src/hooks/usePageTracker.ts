import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const usePageTracker = () => {
  const location = useLocation();
  useEffect(() => {
    console.log("usePageTracker:", location.pathname + location.search);
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);
};

export default usePageTracker;
