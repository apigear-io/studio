import ReactGA from "react-ga4";

export default function useTrackAction() {
  const trackAction = (action: string, label = "") => {
    ReactGA.event({
      category: "action",
      action,
      label,
    });
  };
  return trackAction;
}
