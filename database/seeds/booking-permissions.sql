-- Booking RBAC seed source.
-- Executable migration also applies these permissions idempotently in production.
insert into public.permissions (key,module,action,name_ar,name_en,description_ar,description_en,is_active,sort_order)
values
 ('bookings.view','bookings','view','عرض الحجوزات','View Bookings','عرض الحجوزات وتفاصيلها','View bookings and their details',true,10),
 ('bookings.manage','bookings','manage','إدارة الحجوزات','Manage Bookings','إدارة حالات الحجوزات والتعديلات التشغيلية','Manage booking status and operational updates',true,20)
on conflict (key) do update set
 module=excluded.module, action=excluded.action, name_ar=excluded.name_ar, name_en=excluded.name_en,
 description_ar=excluded.description_ar, description_en=excluded.description_en, is_active=true, deleted_at=null;
