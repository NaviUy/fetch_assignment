import { Suspense } from "react";
import MatchContent from "./match-content";
import Loader from "../components/loader";

export default function MatchPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen flex justify-center items-center"><Loader/></div>}>
      <MatchContent />
    </Suspense>
  );
}
