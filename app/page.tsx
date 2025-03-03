import { Suspense } from "react";
import Home from "./home";
import Loader from "./components/loader";

export default function Page() {
  return (
    <Suspense fallback={<div className="h-screen w-screen flex justify-center items-center"><Loader/></div>}>
      <Home />
    </Suspense>
  );
}
