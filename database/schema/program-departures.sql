-- Source definition: program departures and availability.
-- Executable migration: supabase/migrations/20260825033000_program_departures_availability.sql

-- public.program_departures
-- UUID PK; program FK; start/end/booking deadline; capacity_total; seats_available;
-- status enum: scheduled/open/full/closed/cancelled; bilingual notes;
-- is_active, sort_order, audit timestamps, soft deletion.
-- Constraints keep end >= start, booking_deadline <= start, and seats_available <= capacity_total.
