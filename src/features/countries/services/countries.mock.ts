import type { Country } from "../types";

export const countriesMock: Country[] = [
  {
    id: "saudi-arabia",

    nameAr: "المملكة العربية السعودية",
    nameEn: "Saudi Arabia",

    iso2: "SA",
    iso3: "SAU",

    phoneCode: "+966",

    currencyCode: "SAR",
    currencyNameAr: "الريال السعودي",
    currencyNameEn: "Saudi Riyal",

    timezone: "Asia/Riyadh",

    flagMediaId: null,
    flagUrl: undefined,

    status: "active",
    sortOrder: 1,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];