// DavatarWrapper.tsx
import React, { useEffect, useState } from "react";
import Davatar from "../app/screens/dashboard/components/davatar";

const DavatarWrapper = ({ onLoad }: { onLoad: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onLoad, 10000); // Simulate 10-second load time
    return () => clearTimeout(timer);
  }, [onLoad]);

  return null; // Return nothing as Davatar should not be visible
};

export default DavatarWrapper;
