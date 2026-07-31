"use client";

import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import {
  Table,
  TableHeader,
  TableToolbar,
} from "../../../components/ui/table";
import {
  getAdminTranslations,
  useLanguage,
} from "../../../core/i18n";

import type { Country } from "../types";

type CountriesTableProps = {
  countries: Country[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onEdit: (country: Country) => void;
  onToggleStatus: (country: Country) => void;
  onDelete: (country: Country) => void;
  isStatusUpdating?: boolean;
  isDeleting?: boolean;
};

export default function CountriesTable({
  countries,
  searchValue,
  onSearchChange,
  onEdit,
  onToggleStatus,
  onDelete,
  isStatusUpdating = false,
  isDeleting = false,
}: CountriesTableProps) {
  const { language } = useLanguage();
  const t = getAdminTranslations(language);

  const hasSearchValue = searchValue.trim().length > 0;

  return (
    <>
      <TableHeader
        title={t.countries.tableTitle}
        description={t.countries.tableDescription}
      />

      <TableToolbar
        search={
          <input
            className="nr-input"
            type="search"
            value={searchValue}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder={t.countries.searchPlaceholder}
            aria-label={
              language === "ar"
                ? "البحث عن دولة"
                : "Search for a country"
            }
          />
        }
      />

      <Table>
        <thead>
          <tr>
            <th>
              {language === "ar" ? "الترتيب" : "Order"}
            </th>

            <th>
              {language === "ar" ? "الدولة" : "Country"}
            </th>

            <th>
              {language === "ar" ? "الرمز" : "Code"}
            </th>

            <th>
              {language === "ar" ? "العملة" : "Currency"}
            </th>

            <th>
              {language === "ar"
                ? "المنطقة الزمنية"
                : "Timezone"}
            </th>

            <th>
              {language === "ar" ? "الحالة" : "Status"}
            </th>

            <th>
              {language === "ar"
                ? "الإجراءات"
                : "Actions"}
            </th>
          </tr>
        </thead>

        <tbody>
          {countries.length > 0 ? (
            countries.map((country) => (
              <tr key={country.id}>
                <td>{country.sortOrder}</td>

                <td>
                  <div className="nr-country-name-cell">
                    {country.flagUrl ? (
                      <img
                        className="nr-country-flag"
                        src={country.flagUrl}
                        alt={
                          language === "ar"
                            ? `علم ${country.nameAr}`
                            : `${country.nameEn} flag`
                        }
                      />
                    ) : (
                      <div className="nr-country-flag-placeholder">
                        {country.iso2}
                      </div>
                    )}

                    <div className="nr-country-name-copy">
                      <strong>
                        {language === "ar"
                          ? country.nameAr
                          : country.nameEn}
                      </strong>

                      <small>
                        {language === "ar"
                          ? country.nameEn
                          : country.nameAr}
                      </small>
                    </div>
                  </div>
                </td>

                <td>{country.iso2}</td>
                <td>{country.currencyCode}</td>
                <td>{country.timezone}</td>

                <td>
                  <Badge
                    variant={
                      country.status === "active"
                        ? "success"
                        : "neutral"
                    }
                  >
                    {country.status === "active"
                      ? language === "ar"
                        ? "نشطة"
                        : "Active"
                      : language === "ar"
                        ? "غير نشطة"
                        : "Inactive"}
                  </Badge>
                </td>

                <td>
                  <div className="nr-table-actions">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => onEdit(country)}
                    >
                      {language === "ar"
                        ? "تعديل"
                        : "Edit"}
                    </Button>

                    <Button
                      type="button"
                      variant={
                        country.status === "active"
                          ? "outline"
                          : "primary"
                      }
                      disabled={isStatusUpdating}
                      onClick={() =>
                        onToggleStatus(country)
                      }
                    >
                      {country.status === "active"
                        ? language === "ar"
                          ? "تعطيل"
                          : "Disable"
                        : language === "ar"
                          ? "تفعيل"
                          : "Enable"}
                    </Button>

                    <Button
                      type="button"
                      variant="danger"
                      disabled={isDeleting}
                      onClick={() => onDelete(country)}
                    >
                      {language === "ar"
                        ? "حذف"
                        : "Delete"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>
                <div className="nr-table-empty">
                  {hasSearchValue
                    ? language === "ar"
                      ? "لا توجد دول مطابقة للبحث."
                      : "No countries match your search."
                    : language === "ar"
                      ? "لا توجد دول مضافة حتى الآن."
                      : "No countries have been added yet."}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
}