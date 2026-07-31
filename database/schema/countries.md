# Countries Module

## Purpose

Stores all countries available in the NourApp Platform.

---

# Table

countries

---

# Primary Key

id UUID

---

# Columns

| Column | Type | Required | Notes |
|---------|------|----------|-------|
| id | uuid | ✅ | Primary Key |
| name_ar | text | ✅ | Arabic Name |
| name_en | text | ✅ | English Name |
| iso2 | text | ✅ | ISO 3166-1 Alpha-2 |
| iso3 | text | ✅ | ISO 3166-1 Alpha-3 |
| phone_code | text | ✅ | Country Calling Code |
| currency_code | text | ✅ | ISO Currency |
| currency_name_ar | text | ✅ | Arabic Currency |
| currency_name_en | text | ✅ | English Currency |
| timezone | text | ✅ | Default Timezone |
| flag_media_id | uuid | ❌ | FK → media |
| is_active | boolean | ✅ | Default true |
| sort_order | integer | ✅ | Default 0 |
| created_at | timestamptz | ✅ | UTC |
| updated_at | timestamptz | ✅ | UTC |
| deleted_at | timestamptz | ❌ | Soft Delete |

---

# Indexes

- iso2
- iso3
- is_active
- sort_order

---

# Foreign Keys

flag_media_id
→ media.id

---

# RLS

countries.read

countries.create

countries.update

countries.delete

---

# UI

Admin Countries

Public Country Selector

Interactive Map

Program Availability

---

# Future Relations

Programs

Hotels

Cities

Airports

Visa Rules

Partners

Bookings