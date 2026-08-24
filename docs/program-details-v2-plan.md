# Program Details V2 — Implementation Plan

## Goal
Improve the public program details page as the conversion bridge from discovery (map/program list) to booking, while preserving the current production-backed data model.

## Current production-backed page
The existing public page already renders:
- Hero: cover, country, title, summary, duration, nights, price, featured state.
- Overview: bilingual description and trust messages.
- Hotels: media, city, stars, nights, room type, meal plan, check-in/out, notes and gallery.
- Flights: inclusion policy, airline, airports, dates/times, direct/transit, cabin, baggage and notes.
- Transport: pickup/drop-off, vehicle/service mode, capacity, date/time, duration, inclusion and notes.
- Visa: type, processing, validity, max stay, requirements, inclusion and notes.
- Booking handoff: NourApp deep link with price/duration summary.

## V2 priorities
1. Conversion hierarchy
   - Keep price, duration and booking action easy to find while reading.
   - Make the flight inclusion status visible before the final booking action.
2. Section navigation
   - Improve orientation between Overview, Hotels, Flights, Transport and Visa.
   - Preserve anchors and keyboard navigation.
3. Transparency
   - Clearly distinguish included/not-included service states using existing real data only.
   - Avoid implying availability or inclusions that are not stored in production.
4. Mobile
   - Improve booking CTA visibility and reading order without covering content.
   - Preserve current RTL/LTR behavior.
5. Accessibility
   - Maintain semantic sections, clear labels, focus states and reduced-motion-friendly behavior.

## Safety constraints
- No Supabase writes.
- No database/schema/RLS changes in this UI phase.
- No fabricated itinerary, inclusions, cancellation policy, meeting point, availability or pricing tiers.
- Render only fields supported by production-backed services.
- Keep Arabic and English behavior intact.

## Data-backed additions to implement later
These require approved database/admin fields before public rendering:
- Day-by-day itinerary.
- Explicit package inclusions/exclusions beyond existing service inclusion flags.
- Cancellation/refund policy per program.
- Meeting point and guide details.
- Departure dates and live availability.
- Pricing tiers / room occupancy variants.
- Program FAQs.

## Delivery sequence
1. UI-safe conversion and navigation improvements using current data.
2. Mobile and accessibility verification.
3. Separate database-first design for missing program-detail fields.
4. Admin form support for the new fields.
5. Public rendering only after production schema and content workflow are approved.
