do $$
declare
  t text;
begin
  foreach t in array array[
    'program_itinerary_days',
    'program_inclusion_items',
    'program_cancellation_rules',
    'program_meeting_points',
    'program_price_tiers',
    'program_faqs'
  ]
  loop
    execute format('alter policy %I on public.%I to authenticated', 'Admins can read ' || replace(t, '_', ' '), t);
    execute format('alter policy %I on public.%I to authenticated', 'Admins can insert ' || replace(t, '_', ' '), t);
    execute format('alter policy %I on public.%I to authenticated', 'Admins can update ' || replace(t, '_', ' '), t);
    execute format('alter policy %I on public.%I to authenticated', 'Admins can delete ' || replace(t, '_', ' '), t);
    execute format('alter policy %I on public.%I to anon, authenticated', 'Public can read ' || replace(t, '_', ' '), t);
  end loop;
end $$;
