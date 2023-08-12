"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import { useTeamModal } from "@/hooks/use-team-modal";

const SetupPage = () => {
  const onOpen = useTeamModal((state) => state.onOpen);
  const isOpen = useTeamModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
};
 
export default SetupPage;