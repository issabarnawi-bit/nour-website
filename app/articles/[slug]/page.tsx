import type { Metadata } from "next";
import ArticleDetailsClient from "./ArticleDetailsClient";

type Props={params:Promise<{slug:string}>};

type SeoRow={title_ar:string;title_en:string;excerpt_ar:string|null;excerpt_en:string|null;seo_title_ar:string|null;seo_title_en:string|null;seo_description_ar:string|null;seo_description_en:string|null;cover_media_id:string|null};

async function getArticleForMetadata(slug:string):Promise<SeoRow|null>{
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;if(!url||!key)return null;
 const query=new URLSearchParams({select:"title_ar,title_en,excerpt_ar,excerpt_en,seo_title_ar,seo_title_en,seo_description_ar,seo_description_en,cover_media_id",slug:`eq.${slug}`,status:"eq.published",is_active:"eq.true",deleted_at:"is.null",limit:"1"});
 try{const res=await fetch(`${url}/rest/v1/articles?${query.toString()}`,{headers:{apikey:key,Authorization:`Bearer ${key}`},next:{revalidate:300}});if(!res.ok)return null;const rows=await res.json() as SeoRow[];return rows[0]??null}catch{return null}
}

export async function generateMetadata({params}:Props):Promise<Metadata>{const{slug}=await params;const article=await getArticleForMetadata(decodeURIComponent(slug));if(!article)return{title:"المقال | NourApp"};const title=article.seo_title_ar||article.title_ar||article.seo_title_en||article.title_en;const description=article.seo_description_ar||article.excerpt_ar||article.seo_description_en||article.excerpt_en||undefined;return{title:`${title} | NourApp`,description,openGraph:{title,description,type:"article"},alternates:{canonical:`/articles/${slug}`}}}

export default function ArticlePage(){return <ArticleDetailsClient/>}
