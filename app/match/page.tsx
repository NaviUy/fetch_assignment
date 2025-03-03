import { Suspense } from "react";
import MatchContent from "./match-context";

export default function MatchPage() {
  return (
    <Suspense fallback={<div>Loading match...</div>}>
      <MatchContent />
    </Suspense>
  );
}
