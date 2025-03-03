import { Suspense } from "react";
import MatchContent from "./match-content";
import Loader from "../components/loader";

export default function Match() {
  return (
    <Suspense fallback={<div><Loader/></div>}>
      <MatchContent />
    </Suspense>
  );
}
