"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import { getMedia, type MediaItem } from "../media/repositories/media.repository";

type CeoMessageValue = {
  enabled: boolean;
  name_ar: string;
  name_en: string;
  title_ar: string;
  title_en: string;
  message_ar: string;
  message_en: string;
  image_media_id: string | null;
};

const emptyValue: CeoMessageValue = {
  enabled: false,
  name_ar: "",
  name_en: "",
  title_ar: "الرئيس التنفيذي",
  title_en: "Chief Executive Officer",
  message_ar: "",
  message_en: "",
  image_media_id: null,
};

export default function CeoMessagePage() {
  const supabase = useMemo(() => createClient(), []);
  const [value, setValue] = useState<CeoMessageValue>(emptyValue);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string>("");

  async function load() {
    setLoading(true);
    setFeedback("");

    const [{ data, error }, mediaItems] = await Promise.all([
      supabase
        .from("platform_settings")
        .select("value_json")
        .eq("setting_key", "home.ceo_message")
        .single(),
      getMedia(supabase).catch(() => []),
    ]);

    setLoading(false);

    if (error) {
      setFeedback(`تعذر تحميل كلمة الرئيس التنفيذي: ${error.message}`);
      return;
    }

    setValue({ ...emptyValue, ...(data?.value_json as Partial<CeoMessageValue>) });
    setMedia(mediaItems.filter((item) => item.mimeType.startsWith("image/")));
  }

  useEffect(() => {
    void load();
  }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setFeedback("");

    const { error } = await supabase.rpc("update_platform_setting", {
      p_setting_key: "home.ceo_message",
      p_value_json: value,
    });

    setSaving(false);

    if (error) {
      setFeedback(`تعذر حفظ كلمة الرئيس التنفيذي: ${error.message}`);
      return;
    }

    setFeedback("تم حفظ كلمة الرئيس التنفيذي بنجاح.");
  }

  const selectedImage = media.find((item) => item.id === value.image_media_id);

  if (loading) {
    return <section dir="rtl"><p>جارٍ تحميل كلمة الرئيس التنفيذي...</p></section>;
  }

  return (
    <section dir="rtl" style={{ display: "grid", gap: 24 }}>
      <header>
        <h1>كلمة الرئيس التنفيذي</h1>
        <p>إدارة النص والصورة والمسمى الوظيفي بالعربية والإنجليزية، مع إمكانية إظهار القسم أو إخفائه من الموقع.</p>
      </header>

      {feedback && <div className="admin-card" style={{ padding: 16 }}>{feedback}</div>}

      <form className="admin-card" onSubmit={save} style={{ padding: 22, display: "grid", gap: 16, maxWidth: 920 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input
            type="checkbox"
            checked={value.enabled}
            onChange={(e) => setValue({ ...value, enabled: e.target.checked })}
          />
          إظهار قسم كلمة الرئيس التنفيذي في الموقع
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>الاسم بالعربية
            <input required value={value.name_ar} onChange={(e) => setValue({ ...value, name_ar: e.target.value })} />
          </label>
          <label>English name
            <input required dir="ltr" value={value.name_en} onChange={(e) => setValue({ ...value, name_en: e.target.value })} />
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>المسمى الوظيفي
            <input required value={value.title_ar} onChange={(e) => setValue({ ...value, title_ar: e.target.value })} />
          </label>
          <label>Job title
            <input required dir="ltr" value={value.title_en} onChange={(e) => setValue({ ...value, title_en: e.target.value })} />
          </label>
        </div>

        <label>الكلمة بالعربية
          <textarea required rows={8} value={value.message_ar} onChange={(e) => setValue({ ...value, message_ar: e.target.value })} />
        </label>

        <label>English message
          <textarea required dir="ltr" rows={8} value={value.message_en} onChange={(e) => setValue({ ...value, message_en: e.target.value })} />
        </label>

        <label>صورة الرئيس التنفيذي
          <select
            value={value.image_media_id ?? ""}
            onChange={(e) => setValue({ ...value, image_media_id: e.target.value || null })}
          >
            <option value="">بدون صورة</option>
            {media.map((item) => (
              <option key={item.id} value={item.id}>{item.altAr || item.fileName}</option>
            ))}
          </select>
        </label>

        {selectedImage && (
          <img
            src={selectedImage.publicUrl}
            alt={selectedImage.altAr || selectedImage.fileName}
            style={{ width: 220, aspectRatio: "4 / 5", objectFit: "cover", borderRadius: 18 }}
          />
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button className="admin-button" type="submit" disabled={saving}>
            {saving ? "جارٍ الحفظ..." : "حفظ الكلمة"}
          </button>
          <button type="button" disabled={saving} onClick={() => void load()}>
            إعادة تحميل
          </button>
        </div>
      </form>
    </section>
  );
}
