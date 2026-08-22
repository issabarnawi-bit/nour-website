import type { Metadata } from "next";
import ArticlesClient from "./ArticlesClient";

export const metadata: Metadata = {
  title: "مقالات وإرشادات العمرة | NourApp",
  description:
    "مقالات وإرشادات تساعدك على الاستعداد للعمرة وفهم الخدمات واتخاذ قرارات أوضح مع نور آب.",
};

export default function ArticlesPage() {
  return <ArticlesClient />;
}
