import React from "react";
import { SkeletonText } from "../components/ui/skeleton.jsx";

const ChatLoading = () => {
  return <SkeletonText noOfLines={3} gap="4" />;
};

export default ChatLoading;
