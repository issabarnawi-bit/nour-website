grant select on table
  public.program_itinerary_days,
  public.program_inclusion_items,
  public.program_cancellation_rules,
  public.program_meeting_points,
  public.program_price_tiers,
  public.program_faqs
to anon;

grant select, insert, update, delete on table
  public.program_itinerary_days,
  public.program_inclusion_items,
  public.program_cancellation_rules,
  public.program_meeting_points,
  public.program_price_tiers,
  public.program_faqs
to authenticated;

grant select, insert, update, delete on table
  public.program_itinerary_days,
  public.program_inclusion_items,
  public.program_cancellation_rules,
  public.program_meeting_points,
  public.program_price_tiers,
  public.program_faqs
to service_role;
