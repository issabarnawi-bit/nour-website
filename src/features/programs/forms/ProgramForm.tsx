"use client";

import { useState } from "react";

import Button from "../../../components/ui/Button";
import MediaUploader from "../../../components/ui/media/MediaUploader";
import { useLanguage } from "../../../core/i18n";

import type {
  ProgramFormValues,
  ProgramStatus,
} from "../types";

type CountryOption = {
  id: string;
  nameAr: string;
  nameEn: string;
};

type ProgramFormProps = {
  initialValues?: Partial<ProgramFormValues>;
  countries?: CountryOption[];
  onSubmit: (values: ProgramFormValues) => Promise<void>;
  isSubmitting?: boolean;
};

const defaultValues: ProgramFormValues = {
  titleAr: "",
  titleEn: "",
  slug: "",
  summaryAr: "",
  summaryEn: "",
  descriptionAr: "",
  descriptionEn: "",
  countryId: "",
  durationDays: 1,
  durationNights: 0,
  basePrice: 0,
  currencyCode: "SAR",
  status: "draft",
  isFeatured: false,
  isActive: true,
  sortOrder: 0,
  coverFile: null,
};

export default function ProgramForm({
  initialValues,
  countries = [],
  onSubmit,
  isSubmitting = false,
}: ProgramFormProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const [values, setValues] =
    useState<ProgramFormValues>({
      ...defaultValues,
      ...initialValues,
      coverFile: null,
    });

  function updateValue<K extends keyof ProgramFormValues>(
    key: K,
    value: ProgramFormValues[K],
  ) {
    setValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    await onSubmit({
      ...values,
      titleAr: values.titleAr.trim(),
      titleEn: values.titleEn.trim(),
      slug: values.slug.trim(),
      summaryAr: values.summaryAr.trim(),
      summaryEn: values.summaryEn.trim(),
      descriptionAr: values.descriptionAr.trim(),
      descriptionEn: values.descriptionEn.trim(),
      currencyCode: values.currencyCode.trim().toUpperCase(),
    });
  }

  return (
    <form
      className="nr-country-form"
      onSubmit={handleSubmit}
    >
      <MediaUploader
        label={
          isArabic
            ? "صورة غلاف البرنامج"
            : "Program Cover Image"
        }
        onFileSelect={(file) => {
          updateValue("coverFile", file);
        }}
      />

      <section className="nr-country-form-section">
        <div className="nr-country-form-section-heading">
          <span>01</span>

          <div>
            <h3>
              {isArabic
                ? "المعلومات الأساسية"
                : "Basic Information"}
            </h3>

            <p>
              {isArabic
                ? "أدخل عنوان البرنامج والرابط المختصر."
                : "Enter the program title and slug."}
            </p>
          </div>
        </div>

        <div className="nr-country-form-grid">
          <label>
            <span>
              {isArabic
                ? "العنوان بالعربية"
                : "Arabic Title"}
            </span>

            <input
              className="nr-input"
              value={values.titleAr}
              onChange={(event) =>
                updateValue(
                  "titleAr",
                  event.target.value,
                )
              }
              required
            />
          </label>

          <label>
            <span>
              {isArabic
                ? "العنوان بالإنجليزية"
                : "English Title"}
            </span>

            <input
              className="nr-input"
              value={values.titleEn}
              onChange={(event) =>
                updateValue(
                  "titleEn",
                  event.target.value,
                )
              }
              required
            />
          </label>

          <label>
            <span>
              {isArabic
                ? "الرابط المختصر"
                : "Slug"}
            </span>

            <input
              className="nr-input"
              value={values.slug}
              onChange={(event) =>
                updateValue(
                  "slug",
                  event.target.value
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, ""),
                )
              }
              placeholder="ramadan-umrah"
              required
            />
          </label>
        </div>
      </section>

      <section className="nr-country-form-section">
  <div className="nr-country-form-section-heading">
    <span>02</span>

    <div>
      <h3>
        {isArabic
          ? "المحتوى والوصف"
          : "Content and Description"}
      </h3>

      <p>
        {isArabic
          ? "أضف ملخصًا قصيرًا ووصفًا تفصيليًا للبرنامج."
          : "Add a short summary and a detailed program description."}
      </p>
    </div>
  </div>

  <div className="nr-country-form-grid">
    <label>
      <span>
        {isArabic
          ? "الملخص بالعربية"
          : "Arabic Summary"}
      </span>

      <textarea
        className="nr-input"
        rows={4}
        value={values.summaryAr}
        onChange={(event) =>
          updateValue(
            "summaryAr",
            event.target.value,
          )
        }
        required
      />
    </label>

    <label>
      <span>
        {isArabic
          ? "الملخص بالإنجليزية"
          : "English Summary"}
      </span>

      <textarea
        className="nr-input"
        rows={4}
        value={values.summaryEn}
        onChange={(event) =>
          updateValue(
            "summaryEn",
            event.target.value,
          )
        }
        required
      />
    </label>

    <label>
      <span>
        {isArabic
          ? "الوصف بالعربية"
          : "Arabic Description"}
      </span>

      <textarea
        className="nr-input"
        rows={7}
        value={values.descriptionAr}
        onChange={(event) =>
          updateValue(
            "descriptionAr",
            event.target.value,
          )
        }
        required
      />
    </label>

    <label>
      <span>
        {isArabic
          ? "الوصف بالإنجليزية"
          : "English Description"}
      </span>

      <textarea
        className="nr-input"
        rows={7}
        value={values.descriptionEn}
        onChange={(event) =>
          updateValue(
            "descriptionEn",
            event.target.value,
          )
        }
        required
      />
    </label>
  </div>
</section>

<section className="nr-country-form-section">
  <div className="nr-country-form-section-heading">
    <span>03</span>

    <div>
      <h3>
        {isArabic
          ? "تفاصيل البرنامج"
          : "Program Details"}
      </h3>

      <p>
        {isArabic
          ? "حدد الدولة والمدة والسعر الأساسي."
          : "Select the country, duration and base price."}
      </p>
    </div>
  </div>

  <div className="nr-country-form-grid">
    <label>
      <span>
        {isArabic ? "الدولة" : "Country"}
      </span>

      <select
        className="nr-input"
        value={values.countryId}
        onChange={(event) =>
          updateValue(
            "countryId",
            event.target.value,
          )
        }
        required
      >
        <option value="">
          {isArabic
            ? "اختر الدولة"
            : "Select a country"}
        </option>

        {countries.map((country) => (
          <option
            key={country.id}
            value={country.id}
          >
            {isArabic
              ? country.nameAr
              : country.nameEn}
          </option>
        ))}
      </select>
    </label>

    <label>
      <span>
        {isArabic
          ? "عدد الأيام"
          : "Duration in Days"}
      </span>

      <input
        className="nr-input"
        type="number"
        min={1}
        value={values.durationDays}
        onChange={(event) =>
          updateValue(
            "durationDays",
            Number(event.target.value),
          )
        }
        required
      />
    </label>

    <label>
      <span>
        {isArabic
          ? "عدد الليالي"
          : "Duration in Nights"}
      </span>

      <input
        className="nr-input"
        type="number"
        min={0}
        value={values.durationNights}
        onChange={(event) =>
          updateValue(
            "durationNights",
            Number(event.target.value),
          )
        }
        required
      />
    </label>

    <label>
      <span>
        {isArabic
          ? "السعر الأساسي"
          : "Base Price"}
      </span>

      <input
        className="nr-input"
        type="number"
        min={0}
        step="0.01"
        value={values.basePrice}
        onChange={(event) =>
          updateValue(
            "basePrice",
            Number(event.target.value),
          )
        }
        required
      />
    </label>

    <label>
      <span>
        {isArabic
          ? "رمز العملة"
          : "Currency Code"}
      </span>

      <input
        className="nr-input"
        maxLength={3}
        value={values.currencyCode}
        onChange={(event) =>
          updateValue(
            "currencyCode",
            event.target.value
              .toUpperCase()
              .replace(/[^A-Z]/g, "")
              .slice(0, 3),
          )
        }
        placeholder="SAR"
        required
      />
    </label>
  </div>
</section>

<section className="nr-country-form-section">
  <div className="nr-country-form-section-heading">
    <span>04</span>

    <div>
      <h3>
        {isArabic
          ? "إعدادات النشر"
          : "Publishing Settings"}
      </h3>

      <p>
        {isArabic
          ? "حدد حالة البرنامج وظهوره داخل المنصة."
          : "Control the program status and visibility."}
      </p>
    </div>
  </div>

  <div className="nr-country-form-grid">
    <label>
      <span>
        {isArabic
          ? "حالة البرنامج"
          : "Program Status"}
      </span>

      <select
        className="nr-input"
        value={values.status}
        onChange={(event) =>
          updateValue(
            "status",
            event.target.value as ProgramStatus,
          )
        }
        required
      >
        <option value="draft">
          {isArabic ? "مسودة" : "Draft"}
        </option>

        <option value="published">
          {isArabic ? "منشور" : "Published"}
        </option>

        <option value="inactive">
          {isArabic ? "غير نشط" : "Inactive"}
        </option>
      </select>
    </label>

    <label>
      <span>
        {isArabic
          ? "ترتيب الظهور"
          : "Display Order"}
      </span>

      <input
        className="nr-input"
        type="number"
        min={0}
        value={values.sortOrder}
        onChange={(event) =>
          updateValue(
            "sortOrder",
            Number(event.target.value),
          )
        }
        required
      />
    </label>
  </div>

  <div className="nr-program-form-options">
    <label className="nr-country-form-checkbox">
      <input
        type="checkbox"
        checked={values.isActive}
        onChange={(event) =>
          updateValue(
            "isActive",
            event.target.checked,
          )
        }
      />

      <span>
        {isArabic
          ? "البرنامج نشط ومتاح للعرض"
          : "Program is active and visible"}
      </span>
    </label>

    <label className="nr-country-form-checkbox">
      <input
        type="checkbox"
        checked={values.isFeatured}
        onChange={(event) =>
          updateValue(
            "isFeatured",
            event.target.checked,
          )
        }
      />

      <span>
        {isArabic
          ? "برنامج مميز"
          : "Featured Program"}
      </span>
    </label>
  </div>
</section>

      <div className="nr-country-form-actions">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? isArabic
              ? "جارٍ الحفظ..."
              : "Saving..."
            : isArabic
              ? "حفظ البرنامج"
              : "Save Program"}
        </Button>
      </div>
    </form>
  );
}