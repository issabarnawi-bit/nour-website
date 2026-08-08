import { queryOptions } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Country } from "../types";
import {
  listCountries,
  listDeletedCountries,
} from "./countries.service";

export const countriesQueryKey = [
  "countries",
] as const;

export const deletedCountriesQueryKey = [
  "countries",
  "deleted",
] as const;

export function countriesQuery(
  supabase: SupabaseClient,
) {
  return queryOptions<Country[]>({
    queryKey: countriesQueryKey,

    queryFn: () =>
      listCountries(supabase),

    staleTime: 0,

    gcTime: 5 * 60 * 1000,

    refetchOnMount: "always",

    refetchOnWindowFocus: true,

    refetchOnReconnect: true,
  });
}

export function deletedCountriesQuery(
  supabase: SupabaseClient,
) {
  return queryOptions<Country[]>({
    queryKey:
      deletedCountriesQueryKey,

    queryFn: () =>
      listDeletedCountries(supabase),

    staleTime: 0,

    gcTime: 5 * 60 * 1000,

    refetchOnMount: "always",

    refetchOnWindowFocus: true,

    refetchOnReconnect: true,
  });
}