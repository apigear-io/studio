import { useEffect } from "react";
import { WindowSetTitle } from "../wailsjs/runtime/runtime";

type PageProps = {
  title: string;
  children: React.ReactNode;
};
const Page = (props: PageProps) => {
  useEffect(() => {
    document.title = props.title + " - ApiGear";
    WindowSetTitle(document.title);
  }, [props.title]);
  return props.children;
};

export default Page;
