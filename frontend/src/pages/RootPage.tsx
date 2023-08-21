import { Outlet } from "react-router-dom";
import usePageTracker from "../hooks/usePageTracker";

export default function RootPage() {
  usePageTracker();
  return <Outlet />;
}
