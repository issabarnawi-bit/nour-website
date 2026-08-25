"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Plus, Save, Trash2, X } from "lucide-react";

import { createClient } from "../../lib/supabase/client";
import { getProgramDepartures } from "./services/program-departures.service";
import {
  archiveDeparturePriceTier,
  createDeparturePriceTier,
  getDeparturePriceTiers,
  updateDeparturePriceTier,
} from "./services/program-departure-pricing.service";

type Props = { programId: string };

type FormState = {
  departureId: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: string;
  currencyCode: string;
  minTravelers: string;
  maxTravelers: string;
  sortOrder: string;
};

const emptyForm: FormState = {
  departureId: "",
  nameAr: "",
  nameEn: "",
  descriptionAr: "",
  descriptionEn: "",
  price: "0",
  currencyCode: "SAR",
  minTravelers: "",
  maxTravelers: "",
  sortOrder: "0",
};

const n = (value: string) => (value.trim() ? Number(value) : null);

export default function ProgramDeparturePricingPage({ programId }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const programQuery = useQuery({
    queryKey: ["admin", "program", programId, "departure-pricing-title"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("id,title_ar,title_en")
        .eq("id", programId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const departuresQuery = useQuery({
    queryKey: ["admin", "program", programId, "departures"],
    queryFn: () => getProgramDepartures(supabase, programId),
  });

  const tiersQuery = useQuery({
    queryKey: ["admin", "program", programId, "departure-price-tiers"],
    queryFn: () => getDeparturePriceTiers(supabase, programId),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!form.departureId) throw new Error("اختر موعد الانطلاق أولاً.");
      const payload = {
        departure_id: form.departureId,
        name_ar: form.nameAr.trim(),
        name_en: form.nameEn.trim(),
        description_ar: form.descriptionAr.trim() || null,
        description_en: form.descriptionEn.trim() || null,
        price: Number(form.price || 0),
        currency_code: (form.currencyCode || "SAR").toUpperCase(),
        min_travelers: n(form.minTravelers),
        max_travelers: n(form.maxTravelers),
        sort_order: Number(form.sortOrder || 0),
        is_active: true,
      };
      if (editingId) return updateDeparturePriceTier(supabase, editingId, payload);
      return createDeparturePriceTier(supabase, programId, payload);
    },
    onSuccess: async () => {
      setEditingId(null);
      setForm(emptyForm);
      await queryClient.invalidateQueries({ queryKey: ["admin", "program", programId, "departure-price-tiers"] });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => archiveDeparturePriceTier(supabase, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "program", programId, "departure-price-tiers"] }),
  });

  const departures = departuresQuery.data ?? [];
  const tiers = tiersQuery.data ?? [];
  const departureLabel = (id: string) => {
    const departure = departures.find((item) => item.id === id);
    if (!departure) return "موعد غير متاح";
    return new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium", timeStyle: "short" }).format(new Date(departure.startAt));
  };

  return (
    <main className="dpp-admin" dir="rtl">
      <header className="dpp-head">
        <div>
          <Link href={`/admin/programs/${programId}`}><ArrowRight size={16}/> العودة للبرنامج</Link>
          <h1>أسعار مواعيد الانطلاق</h1>
          <p>{programQuery.data?.title_ar ?? ""}</p>
        </div>
      </header>

      <section className="dpp-grid">
        <div className="dpp-list">
          <div className="dpp-section-head">
            <div><h2>فئات الأسعار المرتبطة بالمواعيد</h2><small>{tiers.length} فئة</small></div>
            <button onClick={() => { setEditingId(null); setForm(emptyForm); }}><Plus size={16}/> إضافة فئة</button>
          </div>

          {tiersQuery.isLoading ? <p>جارٍ التحميل...</p> : null}
          {!tiersQuery.isLoading && tiers.length === 0 ? <div className="dpp-empty">لا توجد أسعار مرتبطة بمواعيد الانطلاق حتى الآن.</div> : null}

          {tiers.map((tier) => (
            <article key={tier.id}>
              <div>
                <span>{departureLabel(tier.departureId)}</span>
                <strong>{tier.nameAr}</strong>
                <b>{new Intl.NumberFormat("ar-SA", { maximumFractionDigits: 2 }).format(tier.price)} {tier.currencyCode}</b>
              </div>
              <div className="dpp-actions">
                <button onClick={() => {
                  setEditingId(tier.id);
                  setForm({
                    departureId: tier.departureId,
                    nameAr: tier.nameAr,
                    nameEn: tier.nameEn,
                    descriptionAr: tier.descriptionAr,
                    descriptionEn: tier.descriptionEn,
                    price: String(tier.price),
                    currencyCode: tier.currencyCode,
                    minTravelers: tier.minTravelers == null ? "" : String(tier.minTravelers),
                    maxTravelers: tier.maxTravelers == null ? "" : String(tier.maxTravelers),
                    sortOrder: String(tier.sortOrder),
                  });
                }}>تعديل</button>
                <button className="danger" onClick={() => archiveMutation.mutate(tier.id)}><Trash2 size={15}/> حذف</button>
              </div>
            </article>
          ))}
        </div>

        <form className="dpp-form" onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }}>
          <div className="dpp-section-head">
            <h2>{editingId ? "تعديل فئة السعر" : "إضافة فئة سعر"}</h2>
            {editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}><X size={16}/> إلغاء</button> : null}
          </div>

          <label><span>موعد الانطلاق</span><select required value={form.departureId} onChange={(e) => setForm((v) => ({ ...v, departureId: e.target.value }))}><option value="">اختر الموعد</option>{departures.map((departure) => <option key={departure.id} value={departure.id}>{departureLabel(departure.id)} — {departure.seatsAvailable}/{departure.capacityTotal} مقعد</option>)}</select></label>
          <label><span>اسم الفئة بالعربية</span><input required value={form.nameAr} onChange={(e) => setForm((v) => ({ ...v, nameAr: e.target.value }))}/></label>
          <label><span>اسم الفئة بالإنجليزية</span><input required value={form.nameEn} onChange={(e) => setForm((v) => ({ ...v, nameEn: e.target.value }))}/></label>
          <label><span>الوصف بالعربية</span><textarea rows={3} value={form.descriptionAr} onChange={(e) => setForm((v) => ({ ...v, descriptionAr: e.target.value }))}/></label>
          <label><span>الوصف بالإنجليزية</span><textarea rows={3} value={form.descriptionEn} onChange={(e) => setForm((v) => ({ ...v, descriptionEn: e.target.value }))}/></label>
          <div className="dpp-two"><label><span>السعر</span><input required min="0" step="0.01" type="number" value={form.price} onChange={(e) => setForm((v) => ({ ...v, price: e.target.value }))}/></label><label><span>العملة</span><input maxLength={3} value={form.currencyCode} onChange={(e) => setForm((v) => ({ ...v, currencyCode: e.target.value.toUpperCase() }))}/></label></div>
          <div className="dpp-two"><label><span>الحد الأدنى للمسافرين</span><input min="1" type="number" value={form.minTravelers} onChange={(e) => setForm((v) => ({ ...v, minTravelers: e.target.value }))}/></label><label><span>الحد الأعلى للمسافرين</span><input min="1" type="number" value={form.maxTravelers} onChange={(e) => setForm((v) => ({ ...v, maxTravelers: e.target.value }))}/></label></div>
          <label><span>الترتيب</span><input min="0" type="number" value={form.sortOrder} onChange={(e) => setForm((v) => ({ ...v, sortOrder: e.target.value }))}/></label>

          {departures.length === 0 ? <p className="dpp-error">أضف موعد انطلاق أولاً قبل إنشاء سعر مرتبط به.</p> : null}
          {saveMutation.isError ? <p className="dpp-error">{saveMutation.error instanceof Error ? saveMutation.error.message : "تعذر الحفظ"}</p> : null}
          <button className="dpp-save" type="submit" disabled={saveMutation.isPending || departures.length === 0}><Save size={17}/>{saveMutation.isPending ? "جارٍ الحفظ..." : "حفظ فئة السعر"}</button>
        </form>
      </section>

      <style jsx global>{`
        .dpp-admin{padding:28px;max-width:1500px;margin:auto;color:#162a44}.dpp-head a,.dpp-section-head button{display:inline-flex;align-items:center;gap:6px;text-decoration:none;color:#176fe8;font-weight:800}.dpp-head h1{margin:12px 0 4px;font-size:30px}.dpp-head p{margin:0;color:#718198}.dpp-grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(360px,.85fr);gap:18px;margin-top:24px}.dpp-list,.dpp-form{background:#fff;border:1px solid #dce5f0;border-radius:20px;padding:18px;box-shadow:0 14px 40px rgba(20,59,102,.06)}.dpp-section-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px}.dpp-section-head h2{margin:0;font-size:18px}.dpp-section-head small{color:#8090a3}.dpp-section-head button{border:0;background:transparent;cursor:pointer}.dpp-list article{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 0;border-bottom:1px solid #edf2f7}.dpp-list article>div:first-child{display:grid;gap:4px}.dpp-list article span{font-size:11px;color:#718198}.dpp-list article b{color:#176fe8}.dpp-actions{display:flex;gap:6px}.dpp-actions button{border:0;background:#eef5ff;color:#176fe8;border-radius:9px;padding:7px 9px;cursor:pointer}.dpp-actions .danger{display:inline-flex;align-items:center;gap:5px;color:#b42318;background:#fff1f0}.dpp-empty{padding:24px;border:1px dashed #d5deea;border-radius:14px;text-align:center;color:#8090a3}.dpp-form{display:grid;gap:12px;align-content:start}.dpp-form label{display:grid;gap:6px}.dpp-form label>span{font-size:12px;font-weight:800;color:#526981}.dpp-form input,.dpp-form textarea,.dpp-form select{width:100%;border:1px solid #d7e1ec;border-radius:11px;padding:10px 11px;font:inherit;outline:none;background:#fff}.dpp-form input:focus,.dpp-form textarea:focus,.dpp-form select:focus{border-color:#176fe8;box-shadow:0 0 0 3px rgba(23,111,232,.1)}.dpp-two{display:grid;grid-template-columns:1fr 1fr;gap:10px}.dpp-save{display:inline-flex;justify-content:center;align-items:center;gap:7px;border:0;border-radius:12px;padding:11px 16px;background:#176fe8;color:#fff;font-weight:900;cursor:pointer}.dpp-save:disabled{opacity:.55}.dpp-error{color:#b42318;font-size:12px}@media(max-width:900px){.dpp-admin{padding:18px}.dpp-grid{grid-template-columns:1fr}.dpp-list article{align-items:flex-start;flex-direction:column}.dpp-actions{width:100%}.dpp-two{grid-template-columns:1fr}}
      `}</style>
    </main>
  );
}
