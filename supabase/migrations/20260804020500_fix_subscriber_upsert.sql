begin;

create or replace function public.subscribe_to_updates(
  p_full_name text default null,
  p_email text default null,
  p_phone text default null,
  p_country_code varchar default null,
  p_preferred_language varchar default 'ar',
  p_preferred_channel public.subscriber_channel default 'email',
  p_consent_given boolean default false,
  p_consent_source text default null,
  p_source_page text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_subscriber_id uuid;
  v_email varchar(320);
  v_phone varchar(30);
  v_country_code varchar(2);
  v_language varchar(5);
begin
  if p_consent_given is not true then
    raise exception 'Explicit consent is required'
      using errcode = '22023';
  end if;

  v_email := lower(nullif(trim(p_email), ''));
  v_phone := nullif(trim(p_phone), '');

  if v_email is null and v_phone is null then
    raise exception 'Email or phone is required'
      using errcode = '22023';
  end if;

  if v_email is not null
     and (
       char_length(v_email) > 320
       or v_email !~
         '^[A-Za-z0-9.!#$%&''*+/=?^_`{|}~-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
     ) then
    raise exception 'Invalid email address'
      using errcode = '22023';
  end if;

  if v_phone is not null
     and char_length(v_phone) not between 7 and 30 then
    raise exception 'Invalid phone number'
      using errcode = '22023';
  end if;

  v_language := case
    when lower(trim(p_preferred_language)) in ('ar', 'en')
      then lower(trim(p_preferred_language))
    else 'ar'
  end;

  v_country_code := case
    when upper(trim(p_country_code)) ~ '^[A-Z]{2}$'
      then upper(trim(p_country_code))
    else null
  end;

  if v_email is not null then
    /*
      يمنع طلبين متزامنين للبريد نفسه من إنشاء سجلين.
    */
    perform pg_advisory_xact_lock(
      hashtextextended(v_email, 0)
    );

    select id
    into v_subscriber_id
    from public.newsletter_subscribers
    where email_normalized = v_email
      and deleted_at is null
    limit 1
    for update;

    if v_subscriber_id is not null then
      update public.newsletter_subscribers
      set
        full_name = coalesce(
          left(nullif(trim(p_full_name), ''), 180),
          full_name
        ),
        email = v_email,
        email_normalized = v_email,
        phone = coalesce(
          left(v_phone, 30),
          phone
        ),
        country_code = coalesce(
          v_country_code,
          country_code
        ),
        preferred_language = v_language,
        preferred_channel = coalesce(
          p_preferred_channel,
          'email'::public.subscriber_channel
        ),
        status = 'active',
        consent_given = true,
        consent_at = now(),
        consent_source = left(
          nullif(trim(p_consent_source), ''),
          160
        ),
        source_page = left(
          nullif(trim(p_source_page), ''),
          1000
        ),
        confirmed_at = coalesce(
          confirmed_at,
          now()
        ),
        unsubscribed_at = null,
        blocked_at = null,
        unsubscribe_token = case
          when status in ('unsubscribed', 'blocked')
            then gen_random_uuid()
          else unsubscribe_token
        end,
        updated_at = now()
      where id = v_subscriber_id;
    else
      insert into public.newsletter_subscribers (
        full_name,
        email,
        email_normalized,
        phone,
        country_code,
        preferred_language,
        preferred_channel,
        status,
        consent_given,
        consent_at,
        consent_source,
        source_page,
        unsubscribe_token,
        confirmed_at
      )
      values (
        left(nullif(trim(p_full_name), ''), 180),
        v_email,
        v_email,
        left(v_phone, 30),
        v_country_code,
        v_language,
        coalesce(
          p_preferred_channel,
          'email'::public.subscriber_channel
        ),
        'active',
        true,
        now(),
        left(
          nullif(trim(p_consent_source), ''),
          160
        ),
        left(
          nullif(trim(p_source_page), ''),
          1000
        ),
        gen_random_uuid(),
        now()
      )
      returning id into v_subscriber_id;
    end if;

  else
    insert into public.newsletter_subscribers (
      full_name,
      phone,
      country_code,
      preferred_language,
      preferred_channel,
      status,
      consent_given,
      consent_at,
      consent_source,
      source_page,
      unsubscribe_token,
      confirmed_at
    )
    values (
      left(nullif(trim(p_full_name), ''), 180),
      left(v_phone, 30),
      v_country_code,
      v_language,
      coalesce(
        p_preferred_channel,
        'whatsapp'::public.subscriber_channel
      ),
      'active',
      true,
      now(),
      left(
        nullif(trim(p_consent_source), ''),
        160
      ),
      left(
        nullif(trim(p_source_page), ''),
        1000
      ),
      gen_random_uuid(),
      now()
    )
    returning id into v_subscriber_id;
  end if;

  return jsonb_build_object(
    'subscriber_id', v_subscriber_id,
    'status', 'active',
    'subscribed', true
  );
end;
$$;

revoke all
on function public.subscribe_to_updates(
  text,
  text,
  text,
  varchar,
  varchar,
  public.subscriber_channel,
  boolean,
  text,
  text
)
from public;

grant execute
on function public.subscribe_to_updates(
  text,
  text,
  text,
  varchar,
  varchar,
  public.subscriber_channel,
  boolean,
  text,
  text
)
to anon, authenticated;

commit;

notify pgrst, 'reload schema';