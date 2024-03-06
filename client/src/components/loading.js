import react from "react";
import LoadingImg from "../image/loading spinner.gif";

export function Loading() {
  return (
    <div className="Loading_container">
      <img src={LoadingImg} style={{ width: "50px", height: "50px" }} />
    </div>
  );
}
