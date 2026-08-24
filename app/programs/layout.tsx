"use client";
import type { ReactNode } from "react";
import ProgramDetailsExperience from "./ProgramDetailsExperience";

export default function ProgramsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <ProgramDetailsExperience />
    </>
  );
}
