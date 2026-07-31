NourApp Platform — Database Architecture

Document version: 0.1Release: 1.0 — FoundationMilestone: AlphaStatus: Draft for reviewLast updated: 2026-07-24

1. Purpose

This document defines the database architecture for NourApp Platform before any production SQL migrations are written.

It is the primary reference for:

Database naming conventions

Core entities and relationships

Authentication and authorization

Bilingual content

Soft deletion

Media management

Audit logging

Feature flags

Publishing workflow

Future scalability

No production migration should be created unless it follows this document or is accompanied by an approved architecture decision.

2. Architecture Principles

2.1 Database-first planning

The database model must be reviewed before implementation. Features should not introduce isolated tables without defining their relationships, ownership, security rules, and lifecycle.

2.2 UUID primary keys

All main tables use UUID primary keys.

id uuid primary key default gen_random_uuid()

2.3 Soft deletion

Business and content records should not normally be permanently deleted.

deleted_at timestamptz null

A record is considered active when deleted_at is null. For visibility control, use is_active boolean.

2.4 Audit timestamps

Most tables include:

created_at timestamptz
updated_at timestamptz
deleted_at timestamptz null

Tables displayed in a controlled order also include sort_order integer.

2.5 Bilingual content

Visitor-facing content supports Arabic and English from the beginning:

name_ar
name_en
title_ar
title_en
description_ar
description_en

2.6 Centralized media

Images and files are referenced through a centralized media table via media_id uuid.

2.7 Publishing workflow

Editable content supports:

draft
published
archived

Where appropriate, also include published_at and published_by.

2.8 Admin-first content management

Any content expected to change must be managed through the admin dashboard rather than hardcoded.

3. Naming Conventions

Tables

Use lowercase plural snake_case:

admin_profiles
roles
permissions
countries
programs
program_images
media
feature_flags
audit_logs

Columns

Use lowercase snake_case:

created_at
display_name
title_ar
is_active
sort_order

Foreign keys

Use the singular table name followed by _id:

country_id
program_id
media_id
created_by

Indexes

Use idx_<table>_<columns>.

Unique constraints

Use uq_<table>_<columns>.

4. Core Identity and Access Model

Supabase Auth manages authentication identities. Application-specific user data is stored separately.

4.1 admin_profiles

Column

Type

Notes

id

uuid

Same value as the Supabase Auth user ID

full_name

text

Staff display name

email

text

Cached for admin display

avatar_media_id

uuid

Optional media reference

status

text

invited, active, suspended

last_login_at

timestamptz

Optional

created_at

timestamptz

Required

updated_at

timestamptz

Required

deleted_at

timestamptz

Optional

4.2 roles

Initial roles:

super_admin

admin

content_manager

operations_manager

viewer

4.3 permissions

Examples:

countries.read
countries.create
countries.update
countries.publish
countries.delete
programs.read
programs.create
programs.update
programs.publish
users.manage
settings.manage

4.4 admin_profile_roles

Many-to-many relation between staff profiles and roles.

4.5 role_permissions

Many-to-many relation between roles and permissions.

5. Content Management Foundation

5.1 media

Stores uploaded media metadata. Actual files are stored in object storage.

Column

Type

Notes

id

uuid

Primary key

bucket

text

Storage bucket

path

text

Storage path

file_name

text

Original name

mime_type

text

File type

size_bytes

bigint

File size

width

integer

Optional

height

integer

Optional

alt_ar

text

Arabic alt text

alt_en

text

English alt text

uploaded_by

uuid

Admin profile

created_at

timestamptz

Required

updated_at

timestamptz

Required

deleted_at

timestamptz

Optional

5.2 site_settings

Stores global settings as typed key-value records.

Recommended columns:

id
key
value_json
group_key
is_public
updated_by
created_at
updated_at

5.3 feature_flags

Controls completed feature availability.

Initial flags:

world_map
programs
hotels
payments
testimonials
booking
partner_portal
ai_assistant

5.4 homepage_sections

Controls homepage section visibility and order.

6. Countries and Interactive Map

6.1 countries

This table is the source of truth for countries displayed on the NourApp interactive map.

Column

Type

Notes

id

uuid

Primary key

code

text

Unique country code

name_ar

text

Required

name_en

text

Required

slug

text

Unique public slug

title_ar

text

Card title

title_en

text

Card title

description_ar

text

Card description

description_en

text

Card description

flag_media_id

uuid

Optional

map_x

numeric

SVG percentage, 0–100

map_y

numeric

SVG percentage, 0–100

marker_tone

text

blue, gold, etc.

is_destination

boolean

Destination node such as Makkah

is_active

boolean

Admin visibility

publication_status

text

draft, published, archived

sort_order

integer

Display order

published_at

timestamptz

Optional

published_by

uuid

Optional

created_by

uuid

Admin profile

updated_by

uuid

Admin profile

created_at

timestamptz

Required

updated_at

timestamptz

Required

deleted_at

timestamptz

Optional

6.2 Map behavior

The website queries only records where:

publication_status = published
is_active = true
deleted_at is null

No country-specific content should remain hardcoded in the map component.

7. Programs Domain

7.1 program_categories

Examples: Economy, Standard, Premium, Family, Group.

7.2 programs

Initial conceptual fields:

id
country_id
category_id
slug
name_ar
name_en
summary_ar
summary_en
description_ar
description_en
base_price
currency_code
duration_days
duration_nights
is_featured
is_active
publication_status
sort_order
published_at
created_by
updated_by
created_at
updated_at
deleted_at

7.3 program_images

Allows multiple ordered images per program.

7.4 program_inclusions

Stores included services.

7.5 program_exclusions

Stores excluded items.

7.6 program_itinerary_days

Stores day-by-day itinerary content.

7.7 program_country_availability

Supports programs available in multiple source markets.

8. Planned Service Domains

These domains will be detailed before their migrations are written:

hotels

hotel_rooms

transport_services

visa_services

guides

partners

payment_methods

testimonials

frequently_asked_questions

legal_pages

customers

bookings

booking_items

payments

notifications

analytics_events

9. Audit Logging

audit_logs

Recommended columns:

id
actor_id
action
entity_type
entity_id
old_data jsonb
new_data jsonb
ip_address
user_agent
created_at

Audit logs should be immutable for normal administrators.

10. Row Level Security Strategy

All application tables must have Row Level Security enabled.

Anonymous users may read only published, active, non-deleted public records.

Authenticated admins receive access based on active profile, assigned role, and required permission.

Service-role credentials remain server-only and must never be exposed in browser code.

11. Indexing Strategy

Indexes should be added for foreign keys, slugs, publication status, active state, sort order, common search fields, and frequently combined filters.

12. Data Validation Rules

Database constraints should enforce critical rules:

map_x between 0 and 100
map_y between 0 and 100
sort_order >= 0
base_price >= 0
currency_code has three characters

13. Environment Strategy

NourApp Platform should eventually maintain separate environments:

Development

Staging

Production

Migrations must be version-controlled and applied in order.

14. Backup and Recovery

Before production launch, define automated backups, restore testing, media backup, migration rollback, recovery point objective, and recovery time objective.

15. Initial Entity Relationships

Supabase Auth User
        │
        └── admin_profiles
                  │
                  ├── admin_profile_roles ── roles
                  │                              │
                  │                              └── role_permissions ── permissions
                  │
                  ├── countries
                  ├── programs
                  ├── media
                  ├── feature_flags
                  └── audit_logs

countries
    ├── programs
    └── program_country_availability

media
    ├── countries.flag_media_id
    ├── admin_profiles.avatar_media_id
    └── program_images.media_id

16. Decisions Requiring Approval

Before creating the first migration, confirm:

Whether staff members may have more than one role.

Whether Arabic and English are the only languages for Release 1.0.

Whether country map coordinates remain percentage-based.

Whether publishing requires approval by a second administrator.

Whether program prices vary by country.

Whether legal pages require version history.

Whether media may be reused across multiple content records.

17. First Migration Scope

After this document is approved, the first migration should create only:

admin_profiles
roles
permissions
admin_profile_roles
role_permissions
media
site_settings
feature_flags
audit_logs

The countries module should be introduced in the second migration after authentication and permissions are verified.

18. Change Control

Architecture changes should be documented before implementation.

Significant decisions go into:

docs/Decisions.md

Release changes go into:

docs/CHANGELOG.md

