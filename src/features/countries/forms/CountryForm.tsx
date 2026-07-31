"use client";

import { useState } from "react";

import Button from "../../../components/ui/Button";
import MediaUploader from "../../../components/ui/media/MediaUploader";
import { useLanguage } from "../../../core/i18n";

type CountryFormValues = {
  nameAr: string;
  nameEn: string;
  iso2: string;
  iso3: string;
  phoneCode: string;
  currencyCode: string;
  currencyNameAr: string;
  currencyNameEn: string;
  timezone: string;
  sortOrder: number;
  isActive: boolean;
  flagFile: File | null;
};

type CountryFormProps = {
  initialValues?: Partial<CountryFormValues>;
  onSubmit: (values: CountryFormValues) => Promise<void>;
  isSubmitting?: boolean;
};

const defaultValues: CountryFormValues = {
  nameAr: "",
  nameEn: "",
  iso2: "",
  iso3: "",
  phoneCode: "",
  currencyCode: "",
  currencyNameAr: "",
  currencyNameEn: "",
  timezone: "",
  sortOrder: 0,
  isActive: true,
  flagFile: null,
};

const timezoneOptions = [
  "Asia/Riyadh",
  "Africa/Lagos",
  "Asia/Karachi",
  "Asia/Dubai",
  "Africa/Cairo",
  "Europe/London",
];

export default function CountryForm({
  initialValues: providedInitialValues,
  onSubmit,
  isSubmitting = false,
}: CountryFormProps) {
  const { language } = useLanguage();

  const [values, setValues] =
    useState<CountryFormValues>({
      ...defaultValues,
      ...providedInitialValues,
      flagFile: null,
    });

  const isArabic = language === "ar";

  function updateValue<
    K extends keyof CountryFormValues,
  >(
    key: K,
    value: CountryFormValues[K],
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
    await onSubmit(values);
  }

  return (
    <form
      className="nr-country-form"
      onSubmit={handleSubmit}
    >
      <MediaUploader
        label={
          isArabic
            ? "علم الدولة"
            : "Country Flag"
        }
        onFileSelect={(file) => {
          updateValue("flagFile", file);
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
                ? "أدخل أسماء الدولة ورموزها الدولية."
                : "Enter the country names and international codes."}
            </p>
          </div>
        </div>

        <div className="nr-country-form-grid">
          <label>
            <span>
              {isArabic
                ? "الاسم بالعربية"
                : "Arabic Name"}
            </span>

            <input
              className="nr-input"
              value={values.nameAr}
              onChange={(event) =>
                updateValue(
                  "nameAr",
                  event.target.value,
                )
              }
              required
            />
          </label>

          <label>
            <span>
              {isArabic
                ? "الاسم بالإنجليزية"
                : "English Name"}
            </span>

            <input
              className="nr-input"
              value={values.nameEn}
              onChange={(event) =>
                updateValue(
                  "nameEn",
                  event.target.value,
                )
              }
              required
            />
          </label>

          <label>
            <span>
              {isArabic
                ? "رمز ISO2"
                : "ISO2 Code"}
            </span>

            <input
              className="nr-input"
              maxLength={2}
              value={values.iso2}
              onChange={(event) =>
                updateValue(
                  "iso2",
                  event.target.value.toUpperCase(),
                )
              }
              placeholder="SA"
              required
            />
          </label>

          <label>
            <span>
              {isArabic
                ? "رمز ISO3"
                : "ISO3 Code"}
            </span>

            <input
              className="nr-input"
              maxLength={3}
              value={values.iso3}
              onChange={(event) =>
                updateValue(
                  "iso3",
                  event.target.value.toUpperCase(),
                )
              }
              placeholder="SAU"
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
                ? "الاتصال والعملة"
                : "Contact and Currency"}
            </h3>

            <p>
              {isArabic
                ? "بيانات الاتصال الرسمية والعملة المحلية."
                : "Official contact details and local currency."}
            </p>
          </div>
        </div>

        <div className="nr-country-form-grid">
          <label>
            <span>
              {isArabic
                ? "مفتاح الاتصال"
                : "Calling Code"}
            </span>

            <input
              className="nr-input"
              value={values.phoneCode}
              onChange={(event) =>
                updateValue(
                  "phoneCode",
                  event.target.value,
                )
              }
              placeholder="+966"
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
                  event.target.value.toUpperCase(),
                )
              }
              placeholder="SAR"
              required
            />
          </label>

          <label>
            <span>
              {isArabic
                ? "اسم العملة بالعربية"
                : "Arabic Currency Name"}
            </span>

            <input
              className="nr-input"
              value={values.currencyNameAr}
              onChange={(event) =>
                updateValue(
                  "currencyNameAr",
                  event.target.value,
                )
              }
              required
            />
          </label>

          <label>
            <span>
              {isArabic
                ? "اسم العملة بالإنجليزية"
                : "English Currency Name"}
            </span>

            <input
              className="nr-input"
              value={values.currencyNameEn}
              onChange={(event) =>
                updateValue(
                  "currencyNameEn",
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
                ? "إعدادات العرض"
                : "Display Settings"}
            </h3>

            <p>
              {isArabic
                ? "المنطقة الزمنية وترتيب وحالة الدولة."
                : "Timezone, display order and country status."}
            </p>
          </div>
        </div>

        <div className="nr-country-form-grid">
          <label>
            <span>
              {isArabic
                ? "المنطقة الزمنية"
                : "Timezone"}
            </span>

            <select
              className="nr-input"
              value={values.timezone}
              onChange={(event) =>
                updateValue(
                  "timezone",
                  event.target.value,
                )
              }
              required
            >
              <option value="">
                {isArabic
                  ? "اختر المنطقة الزمنية"
                  : "Select a timezone"}
              </option>

              {timezoneOptions.map((timezone) => (
                <option
                  key={timezone}
                  value={timezone}
                >
                  {timezone}
                </option>
              ))}
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
              ? "الدولة نشطة ومتاحة للعرض"
              : "Country is active and visible"}
          </span>
        </label>
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
              ? "حفظ الدولة"
              : "Save Country"}
        </Button>
      </div>
    </form>
  );
}

export type { CountryFormValues };