"use client";
import type { ReactNode } from "react";
import ProgramDetailsExperience from "./ProgramDetailsExperience";
import ProgramStructuredContent from "./ProgramStructuredContent";

export default function ProgramsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <ProgramStructuredContent />
      <ProgramDetailsExperience />
    </>
  );
}
