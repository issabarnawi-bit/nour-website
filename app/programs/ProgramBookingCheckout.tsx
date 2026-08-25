"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, UserRound, Users } from "lucide-react";

import { useLanguage } from "../../src/core/i18n";
import { createClient } from "../../src/lib/supabase/client";
import { createProgramBooking, type BookingTravelerInput, type CreatedBooking } from "../../src/features/bookings/services/public-booking.service";

type PreparedBookingSelection = {
  programId: string;
  departureId: string;
  priceTierId: string;
  travelers: number;
  unitPrice: number;
  totalPrice: number;
  currencyCode: string;
};

const BOOKING_STORAGE_KEY = "nour_booking_selection";

const emptyTraveler = (): BookingTravelerInput => ({ firstName: "", lastName: "" });

export default function ProgramBookingCheckout() {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const supabase = useMemo(() => createClient(), []);
  const [selection, setSelection] = useState<PreparedBookingSelection | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [travelers, setTravelers] = useState<BookingTravelerInput[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<CreatedBooking | null>(null);

  useEffect(() => {
    const readStored = () => {
      try {
        const raw = sessionStorage.getItem(BOOKING_STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as PreparedBookingSelection;
        if (!parsed?.programId || !parsed?.departureId || !parsed?.priceTierId || !parsed?.travelers) return;
        setSelection(parsed);
        setTravelers(Array.from({ length: parsed.travelers }, emptyTraveler));
      } catch {}
    };

    readStored();
    const onPrepared = (event: Event) => {
      const custom = event as CustomEvent<PreparedBookingSelection>;
      const next = custom.detail;
      if (!next) return;
      setSelection(next);
      setCreated(null);
      setError("");
      setTravelers(Array.from({ length: next.travelers }, emptyTraveler));
      setTimeout(() => document.getElementById("booking-checkout")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    };
    window.addEventListener("nour:booking-prepared", onPrepared as EventListener);
    return () => window.removeEventListener("nour:booking-prepared", onPrepared as EventListener);
  }, []);

  if (!selection) return null;

  const updateTraveler = (index: number, key: keyof BookingTravelerInput, value: string) => {
    setTravelers((current) => current.map((traveler, i) => (i === index ? { ...traveler, [key]: value } : traveler)));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!contactName.trim() || (!contactEmail.trim() && !contactPhone.trim())) {
      setError(isArabic ? "أدخل اسم جهة الاتصال والبريد الإلكتروني أو رقم الجوال." : "Enter the contact name and an email or phone number.");
      return;
    }
    if (travelers.some((traveler) => !traveler.firstName.trim() || !traveler.lastName.trim())) {
      setError(isArabic ? "أدخل الاسم الأول واسم العائلة لكل مسافر." : "Enter first and last name for every traveler.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createProgramBooking(supabase, {
        programId: selection.programId,
        departureId: selection.departureId,
        priceTierId: selection.priceTierId,
        travelersCount: selection.travelers,
        contactName: contactName.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        preferredLanguage: isArabic ? "ar" : "en",
        travelers,
      });
      setCreated(result);
      sessionStorage.removeItem(BOOKING_STORAGE_KEY);
    } catch (bookingError: any) {
      const code = String(bookingError?.message ?? "");
      const copy: Record<string, string> = {
        insufficient_seats: isArabic ? "لم تعد المقاعد المطلوبة متاحة. حدّث الصفحة واختر عددًا أقل." : "The requested seats are no longer available. Refresh and choose fewer travelers.",
        departure_not_open: isArabic ? "موعد الانطلاق لم يعد متاحًا للحجز." : "This departure is no longer open for booking.",
        price_tier_not_available: isArabic ? "فئة السعر المختارة لم تعد متاحة." : "The selected price tier is no longer available.",
      };
      setError(copy[code] ?? (isArabic ? "تعذر إنشاء الحجز. يرجى المحاولة مرة أخرى." : "Could not create the booking. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  if (created) {
    return (
      <section id="booking-checkout" className="pbc-wrap" dir={isArabic ? "rtl" : "ltr"}>
        <div className="pbc-success">
          <CheckCircle2 />
          <div>
            <span>{isArabic ? "تم إنشاء الحجز" : "Booking created"}</span>
            <h2>{created.bookingReference}</h2>
            <p>{isArabic ? `تم حجز المقاعد مؤقتًا حتى ${created.reservedUntil ? new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium", timeStyle: "short" }).format(new Date(created.reservedUntil)) : "إتمام الدفع"}.` : `Seats are held until ${created.reservedUntil ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(created.reservedUntil)) : "payment is completed"}.`}</p>
            <strong>{new Intl.NumberFormat(isArabic ? "ar-SA" : "en-US", { maximumFractionDigits: 2 }).format(created.totalAmount)} {created.currencyCode}</strong>
          </div>
        </div>
        <style jsx global>{styles}</style>
      </section>
    );
  }

  return (
    <section id="booking-checkout" className="pbc-wrap" dir={isArabic ? "rtl" : "ltr"}>
      <div className="pbc-container">
        <div className="pbc-head">
          <span>{isArabic ? "بيانات الحجز" : "Booking details"}</span>
          <h2>{isArabic ? "أكمل بياناتك والمسافرين" : "Complete contact and traveler details"}</h2>
          <p>{isArabic ? "سيتم التحقق من التوفر مرة أخرى عند إنشاء الحجز وحجز المقاعد لمدة 30 دقيقة." : "Availability is checked again when the booking is created, and seats are held for 30 minutes."}</p>
        </div>

        <form className="pbc-form" onSubmit={submit}>
          <section>
            <h3><UserRound />{isArabic ? "بيانات التواصل" : "Contact details"}</h3>
            <div className="pbc-fields">
              <label><span>{isArabic ? "الاسم الكامل" : "Full name"}</span><input value={contactName} onChange={(e) => setContactName(e.target.value)} required /></label>
              <label><span>{isArabic ? "البريد الإلكتروني" : "Email"}</span><input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} /></label>
              <label><span>{isArabic ? "رقم الجوال" : "Phone"}</span><input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} /></label>
            </div>
          </section>

          <section>
            <h3><Users />{isArabic ? "بيانات المسافرين" : "Traveler details"}</h3>
            <div className="pbc-travelers">
              {travelers.map((traveler, index) => (
                <article key={index}>
                  <strong>{isArabic ? `المسافر ${index + 1}` : `Traveler ${index + 1}`}</strong>
                  <div className="pbc-fields">
                    <label><span>{isArabic ? "الاسم الأول" : "First name"}</span><input value={traveler.firstName} onChange={(e) => updateTraveler(index, "firstName", e.target.value)} required /></label>
                    <label><span>{isArabic ? "اسم العائلة" : "Last name"}</span><input value={traveler.lastName} onChange={(e) => updateTraveler(index, "lastName", e.target.value)} required /></label>
                    <label><span>{isArabic ? "تاريخ الميلاد" : "Date of birth"}</span><input type="date" value={traveler.dateOfBirth ?? ""} onChange={(e) => updateTraveler(index, "dateOfBirth", e.target.value)} /></label>
                    <label><span>{isArabic ? "رمز الجنسية" : "Nationality code"}</span><input maxLength={3} placeholder="SAU" value={traveler.nationalityCode ?? ""} onChange={(e) => updateTraveler(index, "nationalityCode", e.target.value.toUpperCase())} /></label>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="pbc-summary">
            <div><span>{isArabic ? "عدد المسافرين" : "Travelers"}</span><strong>{selection.travelers}</strong></div>
            <div><span>{isArabic ? "الإجمالي" : "Total"}</span><strong>{new Intl.NumberFormat(isArabic ? "ar-SA" : "en-US", { maximumFractionDigits: 2 }).format(selection.totalPrice)} {selection.currencyCode}</strong></div>
          </aside>

          {error ? <p className="pbc-error">{error}</p> : null}
          <button className="pbc-submit" type="submit" disabled={submitting}>{submitting ? (isArabic ? "جارٍ إنشاء الحجز..." : "Creating booking...") : (isArabic ? "تأكيد وإنشاء الحجز" : "Confirm and create booking")}</button>
        </form>
      </div>
      <style jsx global>{styles}</style>
    </section>
  );
}

const styles = `
.pbc-wrap{padding:42px 0 58px;background:#fff;color:#14253d}.pbc-container{width:min(1160px,calc(100% - 56px));margin:auto}.pbc-head{margin-bottom:20px}.pbc-head>span{color:#176fe8;font-size:11px;font-weight:900}.pbc-head h2{margin:7px 0 8px;font-size:clamp(28px,4vw,40px)}.pbc-head p{margin:0;color:#718198}.pbc-form{display:grid;gap:18px}.pbc-form>section,.pbc-summary{border:1px solid #dce5f0;border-radius:20px;padding:20px;background:#fff;box-shadow:0 14px 45px rgba(20,59,102,.05)}.pbc-form h3{display:flex;align-items:center;gap:8px;margin:0 0 16px}.pbc-form h3 svg{width:18px;color:#176fe8}.pbc-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.pbc-fields label{display:grid;gap:6px}.pbc-fields span{font-size:12px;font-weight:800;color:#526981}.pbc-fields input{min-height:44px;border:1px solid #d7e1ec;border-radius:11px;padding:0 11px;font:inherit;outline:none}.pbc-fields input:focus{border-color:#176fe8;box-shadow:0 0 0 3px rgba(23,111,232,.1)}.pbc-travelers{display:grid;gap:14px}.pbc-travelers article{padding:15px;border:1px solid #edf1f5;border-radius:15px;background:#fbfcfe}.pbc-travelers article>strong{display:block;margin-bottom:12px}.pbc-summary{display:flex;justify-content:space-between;gap:18px}.pbc-summary div{display:grid;gap:4px}.pbc-summary span{color:#718198;font-size:12px}.pbc-summary strong{font-size:20px}.pbc-error{margin:0;padding:12px;border-radius:12px;background:#fff1f0;color:#b42318}.pbc-submit{min-height:48px;border:0;border-radius:13px;background:#176fe8;color:#fff;font-weight:900;cursor:pointer}.pbc-submit:disabled{opacity:.55}.pbc-success{width:min(760px,calc(100% - 32px));margin:auto;display:flex;gap:18px;padding:28px;border:1px solid #cfe8d7;border-radius:22px;background:#f2fbf5}.pbc-success>svg{width:36px;height:36px;color:#16803d;flex:0 0 auto}.pbc-success span{color:#16803d;font-size:12px;font-weight:900}.pbc-success h2{margin:5px 0 7px;font-size:28px}.pbc-success p{color:#587064;line-height:1.7}.pbc-success strong{font-size:22px;color:#176fe8}@media(max-width:760px){.pbc-container{width:min(100% - 24px,1160px)}.pbc-fields{grid-template-columns:1fr}.pbc-summary{flex-direction:column}}
`;
