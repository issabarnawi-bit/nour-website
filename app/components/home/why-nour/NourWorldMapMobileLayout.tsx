"use client";

import type { Language } from "../../../data/home";
import NourWorldMap from "./NourWorldMap";
import NourWorldMapEnhancements from "./NourWorldMapEnhancements";

export default function NourWorldMapMobileLayout({ language }: { language: Language }) {
  return (
    <div className="nr-map-mobile-layout-fix">
      <NourWorldMap language={language} />
      <NourWorldMapEnhancements language={language} />
      <style jsx global>{`
        @media (max-width: 760px) {
          .nr-map-mobile-layout-fix div:has(> .nr-map-focus-journey) {
            height: auto !important;
            min-height: 0 !important;
            padding-top: clamp(235px, 56vw, 320px);
            overflow: visible !important;
          }

          .nr-map-mobile-layout-fix div:has(> .nr-map-focus-journey) > div:first-child {
            position: absolute !important;
            inset: 0 0 auto 0 !important;
            width: 100% !important;
            height: clamp(235px, 56vw, 320px) !important;
          }

          .nr-map-mobile-layout-fix .nr-map-focus-journey {
            position: relative !important;
            inset: auto !important;
            width: auto !important;
            margin: 10px 0 0 !important;
          }
        }

        @media (max-width: 480px) {
          .nr-map-mobile-layout-fix div:has(> .nr-map-focus-journey) {
            padding-top: clamp(215px, 57vw, 270px);
          }

          .nr-map-mobile-layout-fix div:has(> .nr-map-focus-journey) > div:first-child {
            height: clamp(215px, 57vw, 270px) !important;
          }
        }

        @media (max-width: 360px) {
          .nr-map-mobile-layout-fix div:has(> .nr-map-focus-journey) {
            padding-top: 205px;
          }

          .nr-map-mobile-layout-fix div:has(> .nr-map-focus-journey) > div:first-child {
            height: 205px !important;
          }
        }
      `}</style>
    </div>
  );
}
