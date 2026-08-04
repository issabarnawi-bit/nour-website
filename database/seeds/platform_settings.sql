begin;

insert into public.platform_settings (
  setting_key,
  setting_group,
  value_type,
  value_json,
  label_ar,
  label_en,
  description_ar,
  description_en,
  placeholder_ar,
  placeholder_en,
  validation_rules,
  is_public,
  is_required,
  is_active,
  sort_order
)
values

-- =========================================================
-- GENERAL
-- =========================================================

(
  'general.platform_name',
  'general',
  'text',
  to_jsonb('نور آب'::text),
  'اسم المنصة',
  'Platform name',
  'الاسم الرئيسي للمنصة باللغة العربية.',
  'The main platform name.',
  'نور آب',
  'NourApp',
  '{"minLength":2,"maxLength":120}'::jsonb,
  true,
  true,
  true,
  10
),

(
  'general.platform_name_en',
  'general',
  'text',
  to_jsonb('NourApp'::text),
  'اسم المنصة بالإنجليزية',
  'English platform name',
  'الاسم الإنجليزي المستخدم في الموقع والرسائل.',
  'The English name used across the website and messages.',
  'NourApp',
  'NourApp',
  '{"minLength":2,"maxLength":120}'::jsonb,
  true,
  true,
  true,
  20
),

(
  'general.default_language',
  'general',
  'text',
  to_jsonb('ar'::text),
  'اللغة الافتراضية',
  'Default language',
  'اللغة التي تظهر عند فتح المنصة أول مرة.',
  'The language displayed when the platform is first opened.',
  'ar',
  'ar',
  '{"allowedValues":["ar","en"]}'::jsonb,
  true,
  true,
  true,
  30
),

(
  'general.default_country',
  'general',
  'text',
  to_jsonb('SA'::text),
  'الدولة الافتراضية',
  'Default country',
  'رمز الدولة الافتراضية للمنصة.',
  'The default platform country code.',
  'SA',
  'SA',
  '{"pattern":"^[A-Z]{2}$"}'::jsonb,
  true,
  true,
  true,
  40
),

(
  'general.default_currency',
  'general',
  'text',
  to_jsonb('SAR'::text),
  'العملة الافتراضية',
  'Default currency',
  'رمز العملة الافتراضية المستخدمة في الأسعار.',
  'The default currency code used for prices.',
  'SAR',
  'SAR',
  '{"pattern":"^[A-Z]{3}$"}'::jsonb,
  true,
  true,
  true,
  50
),

(
  'general.timezone',
  'general',
  'text',
  to_jsonb('Asia/Riyadh'::text),
  'المنطقة الزمنية',
  'Timezone',
  'المنطقة الزمنية الافتراضية للمنصة.',
  'The platform default timezone.',
  'Asia/Riyadh',
  'Asia/Riyadh',
  '{"minLength":3,"maxLength":100}'::jsonb,
  false,
  true,
  true,
  60
),

(
  'general.maintenance_mode',
  'general',
  'boolean',
  'false'::jsonb,
  'وضع الصيانة',
  'Maintenance mode',
  'إيقاف الموقع العام مؤقتًا وإظهار رسالة الصيانة.',
  'Temporarily disable the public website and show a maintenance message.',
  null,
  null,
  '{}'::jsonb,
  false,
  true,
  true,
  70
),

-- =========================================================
-- CONTACT
-- =========================================================

(
  'contact.support_email',
  'contact',
  'email',
  to_jsonb('support@nourappglobal.com'::text),
  'بريد الدعم',
  'Support email',
  'البريد المخصص لاستقبال استفسارات العملاء.',
  'The email used to receive customer enquiries.',
  'support@nourappglobal.com',
  'support@nourappglobal.com',
  '{"maxLength":320}'::jsonb,
  true,
  true,
  true,
  100
),

(
  'contact.support_phone',
  'contact',
  'phone',
  to_jsonb('+966567488377'::text),
  'رقم الدعم',
  'Support phone',
  'رقم التواصل الرئيسي لخدمة العملاء.',
  'The main customer support contact number.',
  '+966 56 748 8377',
  '+966 56 748 8377',
  '{"minLength":7,"maxLength":30}'::jsonb,
  true,
  true,
  true,
  110
),

(
  'contact.whatsapp_number',
  'contact',
  'phone',
  to_jsonb('+966567488377'::text),
  'رقم واتساب',
  'WhatsApp number',
  'رقم التواصل المستخدم في زر واتساب.',
  'The contact number used by the WhatsApp button.',
  '+966 56 748 8377',
  '+966 56 748 8377',
  '{"minLength":7,"maxLength":30}'::jsonb,
  true,
  true,
  true,
  120
),

(
  'contact.website_url',
  'contact',
  'url',
  to_jsonb('https://nourappglobal.com'::text),
  'رابط الموقع',
  'Website URL',
  'الرابط الرسمي للموقع.',
  'The official website URL.',
  'https://nourappglobal.com',
  'https://nourappglobal.com',
  '{}'::jsonb,
  true,
  true,
  true,
  130
),

(
  'contact.address_ar',
  'contact',
  'text',
  to_jsonb('المملكة العربية السعودية'::text),
  'العنوان بالعربية',
  'Arabic address',
  'العنوان الذي يظهر في الموقع والتواصل.',
  'The address displayed on the website and contact sections.',
  'المملكة العربية السعودية',
  'Saudi Arabia',
  '{"maxLength":500}'::jsonb,
  true,
  false,
  true,
  140
),

(
  'contact.address_en',
  'contact',
  'text',
  to_jsonb('Saudi Arabia'::text),
  'العنوان بالإنجليزية',
  'English address',
  'العنوان باللغة الإنجليزية.',
  'The address in English.',
  'Saudi Arabia',
  'Saudi Arabia',
  '{"maxLength":500}'::jsonb,
  true,
  false,
  true,
  150
),

-- =========================================================
-- BOOKING
-- =========================================================

(
  'booking.enabled',
  'booking',
  'boolean',
  'true'::jsonb,
  'تفعيل الحجوزات',
  'Enable bookings',
  'السماح للعملاء بإنشاء طلبات حجز.',
  'Allow customers to create booking requests.',
  null,
  null,
  '{}'::jsonb,
  false,
  true,
  true,
  200
),

(
  'booking.minimum_days_before_arrival',
  'booking',
  'number',
  '3'::jsonb,
  'الحد الأدنى قبل الوصول',
  'Minimum days before arrival',
  'أقل عدد أيام مسموح به قبل تاريخ الوصول.',
  'The minimum number of days required before arrival.',
  '3',
  '3',
  '{"min":0,"max":365}'::jsonb,
  false,
  true,
  true,
  210
),

(
  'booking.maximum_guests',
  'booking',
  'number',
  '20'::jsonb,
  'الحد الأعلى للضيوف',
  'Maximum guests',
  'أقصى عدد مسافرين في طلب الحجز الواحد.',
  'The maximum number of travellers in one booking request.',
  '20',
  '20',
  '{"min":1,"max":500}'::jsonb,
  false,
  true,
  true,
  220
),

(
  'booking.auto_confirm',
  'booking',
  'boolean',
  'false'::jsonb,
  'التأكيد التلقائي',
  'Automatic confirmation',
  'تأكيد الحجوزات تلقائيًا دون مراجعة إدارية.',
  'Automatically confirm bookings without admin review.',
  null,
  null,
  '{}'::jsonb,
  false,
  true,
  true,
  230
),

(
  'booking.cancellation_hours',
  'booking',
  'number',
  '48'::jsonb,
  'مهلة الإلغاء',
  'Cancellation window',
  'عدد الساعات المسموح خلالها بإلغاء الحجز.',
  'The number of hours during which a booking may be cancelled.',
  '48',
  '48',
  '{"min":0,"max":2160}'::jsonb,
  false,
  false,
  true,
  240
),

-- =========================================================
-- PAYMENT
-- =========================================================

(
  'payment.enabled',
  'payment',
  'boolean',
  'true'::jsonb,
  'تفعيل الدفع',
  'Enable payments',
  'تفعيل خيارات الدفع داخل المنصة.',
  'Enable payment options across the platform.',
  null,
  null,
  '{}'::jsonb,
  false,
  true,
  true,
  300
),

(
  'payment.allow_partial_payment',
  'payment',
  'boolean',
  'true'::jsonb,
  'السماح بالدفع الجزئي',
  'Allow partial payment',
  'السماح للعميل بدفع جزء من قيمة الحجز.',
  'Allow customers to pay part of the booking total.',
  null,
  null,
  '{}'::jsonb,
  false,
  true,
  true,
  310
),

(
  'payment.minimum_deposit_percentage',
  'payment',
  'number',
  '25'::jsonb,
  'الحد الأدنى للعربون',
  'Minimum deposit percentage',
  'النسبة الدنيا المطلوبة لتأكيد الحجز.',
  'The minimum percentage required to confirm a booking.',
  '25',
  '25',
  '{"min":0,"max":100}'::jsonb,
  false,
  true,
  true,
  320
),

(
  'payment.tax_percentage',
  'payment',
  'number',
  '15'::jsonb,
  'نسبة الضريبة',
  'Tax percentage',
  'نسبة ضريبة القيمة المضافة.',
  'The value-added tax percentage.',
  '15',
  '15',
  '{"min":0,"max":100}'::jsonb,
  true,
  true,
  true,
  330
),

(
  'payment.supported_methods',
  'payment',
  'json',
  '["mada","visa","mastercard","apple_pay","tabby","tamara"]'::jsonb,
  'وسائل الدفع',
  'Supported payment methods',
  'وسائل الدفع المفعلة داخل المنصة.',
  'Payment methods enabled on the platform.',
  null,
  null,
  '{}'::jsonb,
  true,
  true,
  true,
  340
),

-- =========================================================
-- SOCIAL
-- =========================================================

(
  'social.instagram_url',
  'social',
  'url',
  'null'::jsonb,
  'إنستغرام',
  'Instagram',
  'رابط حساب المنصة على إنستغرام.',
  'The platform Instagram account URL.',
  'https://instagram.com/...',
  'https://instagram.com/...',
  '{}'::jsonb,
  true,
  false,
  true,
  400
),

(
  'social.facebook_url',
  'social',
  'url',
  'null'::jsonb,
  'فيسبوك',
  'Facebook',
  'رابط صفحة المنصة على فيسبوك.',
  'The platform Facebook page URL.',
  'https://facebook.com/...',
  'https://facebook.com/...',
  '{}'::jsonb,
  true,
  false,
  true,
  410
),

(
  'social.x_url',
  'social',
  'url',
  'null'::jsonb,
  'منصة X',
  'X platform',
  'رابط حساب المنصة على منصة X.',
  'The platform X account URL.',
  'https://x.com/...',
  'https://x.com/...',
  '{}'::jsonb,
  true,
  false,
  true,
  420
),

(
  'social.youtube_url',
  'social',
  'url',
  'null'::jsonb,
  'يوتيوب',
  'YouTube',
  'رابط قناة المنصة على يوتيوب.',
  'The platform YouTube channel URL.',
  'https://youtube.com/...',
  'https://youtube.com/...',
  '{}'::jsonb,
  true,
  false,
  true,
  430
),

(
  'social.tiktok_url',
  'social',
  'url',
  'null'::jsonb,
  'تيك توك',
  'TikTok',
  'رابط حساب المنصة على تيك توك.',
  'The platform TikTok account URL.',
  'https://tiktok.com/@...',
  'https://tiktok.com/@...',
  '{}'::jsonb,
  true,
  false,
  true,
  440
),

-- =========================================================
-- SEO
-- =========================================================

(
  'seo.default_title_ar',
  'seo',
  'text',
  to_jsonb('نور آب | خدمات وبرامج العمرة'::text),
  'عنوان الموقع بالعربية',
  'Arabic website title',
  'العنوان الافتراضي المستخدم في محركات البحث.',
  'The default Arabic title used by search engines.',
  'نور آب | خدمات وبرامج العمرة',
  'NourApp | Umrah Services',
  '{"maxLength":70}'::jsonb,
  true,
  true,
  true,
  500
),

(
  'seo.default_title_en',
  'seo',
  'text',
  to_jsonb('NourApp | Umrah Services and Programs'::text),
  'عنوان الموقع بالإنجليزية',
  'English website title',
  'العنوان الإنجليزي الافتراضي لمحركات البحث.',
  'The default English title used by search engines.',
  'NourApp | Umrah Services and Programs',
  'NourApp | Umrah Services and Programs',
  '{"maxLength":70}'::jsonb,
  true,
  true,
  true,
  510
),

(
  'seo.default_description_ar',
  'seo',
  'text',
  to_jsonb(
    'منصة رقمية لخدمات وبرامج العمرة تشمل التأشيرات والفنادق والنقل والبرامج المتكاملة.'
    ::text
  ),
  'وصف الموقع بالعربية',
  'Arabic website description',
  'الوصف الافتراضي المستخدم في نتائج البحث.',
  'The default Arabic description used in search results.',
  'اكتب وصفًا مختصرًا للموقع',
  'Enter a short website description',
  '{"maxLength":180}'::jsonb,
  true,
  true,
  true,
  520
),

(
  'seo.default_description_en',
  'seo',
  'text',
  to_jsonb(
    'A digital platform for Umrah services, including visas, hotels, transportation, and complete programs.'
    ::text
  ),
  'وصف الموقع بالإنجليزية',
  'English website description',
  'الوصف الإنجليزي الافتراضي المستخدم في نتائج البحث.',
  'The default English description used in search results.',
  'Enter a short website description',
  'Enter a short website description',
  '{"maxLength":180}'::jsonb,
  true,
  true,
  true,
  530
),

(
  'seo.indexing_enabled',
  'seo',
  'boolean',
  'true'::jsonb,
  'السماح بالأرشفة',
  'Enable indexing',
  'السماح لمحركات البحث بأرشفة الموقع.',
  'Allow search engines to index the website.',
  null,
  null,
  '{}'::jsonb,
  true,
  true,
  true,
  540
)

on conflict (setting_key)
do update set
  setting_group = excluded.setting_group,
  value_type = excluded.value_type,
  label_ar = excluded.label_ar,
  label_en = excluded.label_en,
  description_ar = excluded.description_ar,
  description_en = excluded.description_en,
  placeholder_ar = excluded.placeholder_ar,
  placeholder_en = excluded.placeholder_en,
  validation_rules = excluded.validation_rules,
  is_public = excluded.is_public,
  is_required = excluded.is_required,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();

commit;