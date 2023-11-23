export default function useTrackAction() {
  const trackAction = (action: string, label = "") => {
    console.log("track action:", action, label);
  };
  return trackAction;
}
