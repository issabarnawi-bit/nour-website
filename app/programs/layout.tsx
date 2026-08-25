"use client";
import type { ReactNode } from "react";
import ProgramDetailsExperience from "./ProgramDetailsExperience";
import ProgramStructuredContent from "./ProgramStructuredContent";
import ProgramDepartures from "./ProgramDepartures";
import ProgramBookingSelector from "./ProgramBookingSelector";

export default function ProgramsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <ProgramDepartures />
      <ProgramBookingSelector />
      <ProgramStructuredContent />
      <ProgramDetailsExperience />
    </>
  );
}
