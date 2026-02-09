"use client";

import Lottie from "lottie-react";
import animationData from "../util/yoga.json";

const Loading = ({ color = "rgba(0, 0, 0, 0.3)" }: { color: string }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backdropFilter: "blur(6px)",
        backgroundColor: color || "rgba(0, 0, 0, 0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <Lottie
        animationData={animationData}
        loop
        autoplay
        style={{ width: "200px", height: "200px" }}
      />
    </div>
  );
};

export default Loading;
