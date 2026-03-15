-- ================================================================
-- UrbanPulse — Complete Supabase Database Schema
-- ================================================================
-- Run this file in the Supabase SQL Editor on a fresh project.
-- Requires PostGIS extension to be enabled (default on Supabase).
-- ================================================================

-- ─── 1. Extensions ──────────────────────────────────────

create extension if not exists postgis;
create extension if not exists pg_trgm;

-- ─── 2. Helper Functions ────────────────────────────────

-- Check if the current authenticated user is an admin
create or replace function is_admin()
returns boolean language sql security definer stable as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- ─── 3. Enums ───────────────────────────────────────────

create type pulse_category   as enum ('emergency', 'skill', 'item');
create type pulse_urgency    as enum ('low', 'medium', 'high', 'critical');
create type pulse_status     as enum ('active', 'resolved', 'expired');

create type resource_type   as enum ('item', 'skill');
create type resource_status  as enum ('available', 'lent_out', 'unavailable');

create type interaction_status   as enum ('pending', 'accepted', 'declined', 'completed', 'cancelled');
create type interaction_feedback as enum ('positive', 'neutral', 'negative');

create type notification_type as enum (
  'hero_alert',
  'pulse_confirmed',
  'message',
  'interaction_request',
  'weather_alert',
  'system'
);

create type report_reason as enum ('spam', 'harassment', 'misinformation', 'inappropriate', 'other');
create type report_status as enum ('pending', 'reviewed', 'dismissed');

create type pet_report_type   as enum ('lost', 'found');
create type pet_species       as enum ('dog', 'cat', 'bird', 'other');
create type pet_report_status as enum ('active', 'resolved');

-- ─── 4. Tables (dependency order) ───────────────────────

-- User profile, created automatically by trigger on auth.users insert
create table profiles (
  id                      uuid primary key references auth.users(id) on delete cascade,
  created_at              timestamptz default now() not null,
  updated_at              timestamptz default now() not null,
  username                text unique not null,
  full_name               text,
  bio                     text,
  avatar_url              text,
  location                geography(Point, 4326),
  neighborhood            text,
  -- ⚠️ Stored in km, but PostGIS ST_DWithin expects meters — multiply by 1000 in queries
  neighborhood_radius_km  float default 0.5 not null,
  skill_tags              text[] default '{}' not null,
  trust_score             float default 0 not null,
  successful_interactions  int default 0 not null,
  is_verified_neighbor    boolean default false not null,
  is_admin                boolean default false not null,
  quiet_hours_start       time,
  quiet_hours_end         time,
  is_available            boolean default true not null
);

-- Community pulse: an alert, request, or offer
create table pulses (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null,
  author_id       uuid not null references profiles(id) on delete cascade,
  title           text not null,
  description     text not null,
  category        pulse_category not null,
  urgency         pulse_urgency not null,
  status          pulse_status default 'active' not null,
  location        geography(Point, 4326) not null,
  radius_meters   int default 500 not null,
  confirm_count   int default 0 not null,
  is_verified     boolean default false not null,
  is_pinned       boolean default false not null,
  expires_at      timestamptz
);

-- One row per user confirming a pulse (upvote)
create table pulse_confirmations (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now() not null,
  pulse_id    uuid not null references pulses(id) on delete cascade,
  user_id     uuid not null references profiles(id) on delete cascade,
  unique (pulse_id, user_id)
);

-- Lendable item or offered skill
create table resources (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz default now() not null,
  updated_at   timestamptz default now() not null,
  owner_id     uuid not null references profiles(id) on delete cascade,
  type         resource_type not null,
  name         text not null,
  description  text,
  tags         text[] default '{}' not null,
  status       resource_status default 'available' not null,
  location     geography(Point, 4326)
);

-- Borrow / help interaction between two users for a resource
create table interactions (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null,
  resource_id     uuid not null references resources(id) on delete cascade,
  requester_id    uuid not null references profiles(id) on delete cascade,
  provider_id     uuid not null references profiles(id) on delete cascade,
  status          interaction_status default 'pending' not null,
  feedback        interaction_feedback,
  feedback_note   text,
  completed_at    timestamptz
);

-- Private conversation, optionally linked to a pulse or resource
create table conversations (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz default now() not null,
  updated_at   timestamptz default now() not null,
  pulse_id     uuid references pulses(id) on delete set null,
  resource_id  uuid references resources(id) on delete set null
);

-- Membership / unread tracking for conversations
create table conversation_members (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references conversations(id) on delete cascade,
  user_id          uuid not null references profiles(id) on delete cascade,
  joined_at        timestamptz default now() not null,
  last_read_at     timestamptz,
  unique (conversation_id, user_id)
);

-- Individual chat message
create table messages (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz default now() not null,
  conversation_id  uuid not null references conversations(id) on delete cascade,
  sender_id        uuid not null references profiles(id) on delete cascade,
  content          text not null
);

-- In-app notification
create table notifications (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now() not null,
  user_id     uuid not null references profiles(id) on delete cascade,
  type        notification_type not null,
  title       text not null,
  body        text not null,
  is_read     boolean default false not null,
  read_at     timestamptz,
  action_url  text,
  metadata    jsonb
);

-- Lost / found pet report
create table pets (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz default now() not null,
  updated_at   timestamptz default now() not null,
  reporter_id  uuid not null references profiles(id) on delete cascade,
  type         pet_report_type not null,
  species      pet_species not null,
  breed        text,
  color        text not null,
  name         text,
  description  text not null,
  photo_url    text,
  ai_tags      text[] default '{}' not null,
  location     geography(Point, 4326) not null,
  status       pet_report_status default 'active' not null,
  resolved_at  timestamptz
);

-- AI-generated match between a lost report and a found report
create table pet_matches (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz default now() not null,
  lost_report_id   uuid not null references pets(id) on delete cascade,
  found_report_id  uuid not null references pets(id) on delete cascade,
  confidence_score int not null check (confidence_score between 0 and 100),
  matched_traits   text[] default '{}' not null
);

-- User-submitted content report for moderation
create table reports (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz default now() not null,
  reporter_id     uuid not null references profiles(id) on delete cascade,
  target_type     text not null check (target_type in ('pulse', 'user', 'message')),
  target_id       uuid not null,
  reason          report_reason not null,
  description     text,
  status          report_status default 'pending' not null,
  resolved_by     uuid references profiles(id) on delete set null,
  resolved_at     timestamptz,
  resolution_note text
);

-- ─── 5. Indexes ─────────────────────────────────────────

-- Geography (GiST) indexes for PostGIS radius queries
create index idx_profiles_location       on profiles       using gist(location);
create index idx_pulses_location         on pulses         using gist(location);
create index idx_resources_location      on resources      using gist(location);
create index idx_pets_location           on pets           using gist(location);

-- GIN indexes on text[] array columns for containment/overlap queries
create index idx_profiles_skill_tags     on profiles       using gin(skill_tags);
create index idx_resources_tags          on resources      using gin(tags);
create index idx_pets_ai_tags            on pets           using gin(ai_tags);
create index idx_pet_matches_traits      on pet_matches    using gin(matched_traits);

-- Ordering indexes on created_at
create index idx_pulses_created_at       on pulses         (created_at desc);
create index idx_messages_created_at     on messages       (created_at desc);
create index idx_notifications_created   on notifications  (created_at desc);
create index idx_pets_created_at         on pets           (created_at desc);
create index idx_reports_created_at      on reports        (created_at desc);
create index idx_interactions_created    on interactions    (created_at desc);

-- Status filtering indexes
create index idx_pulses_status           on pulses         (status);
create index idx_resources_status        on resources      (status);
create index idx_resources_type          on resources      (type);
create index idx_interactions_status     on interactions    (status);
create index idx_pets_status             on pets           (status);
create index idx_reports_status          on reports        (status);
create index idx_notifications_is_read   on notifications  (is_read) where not is_read;

-- Foreign key join indexes
create index idx_pulses_author           on pulses               (author_id);
create index idx_pulse_conf_pulse        on pulse_confirmations  (pulse_id);
create index idx_pulse_conf_user         on pulse_confirmations  (user_id);
create index idx_resources_owner         on resources            (owner_id);
create index idx_interactions_resource   on interactions         (resource_id);
create index idx_interactions_requester  on interactions         (requester_id);
create index idx_interactions_provider   on interactions         (provider_id);
create index idx_conv_members_conv       on conversation_members (conversation_id);
create index idx_conv_members_user       on conversation_members (user_id);
create index idx_messages_conversation   on messages             (conversation_id);
create index idx_messages_sender         on messages             (sender_id);
create index idx_notifications_user      on notifications        (user_id);
create index idx_pets_reporter           on pets                 (reporter_id);
create index idx_pet_matches_lost        on pet_matches          (lost_report_id);
create index idx_pet_matches_found       on pet_matches          (found_report_id);
create index idx_reports_reporter        on reports              (reporter_id);

-- ─── 6. Triggers & Trigger Functions ────────────────────

-- 6a. Auto-create profile on auth.users insert
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  _username text;
  _full_name text;
begin
  _username  := new.raw_user_meta_data->>'username';
  _full_name := new.raw_user_meta_data->>'full_name';

  -- Fallback: derive username from email (take part before @)
  if _username is null or _username = '' then
    _username := split_part(new.email, '@', 1);
  end if;

  -- Ensure uniqueness by appending random suffix if needed
  while exists (select 1 from public.profiles where username = _username) loop
    _username := _username || '_' || substr(gen_random_uuid()::text, 1, 4);
  end loop;

  insert into public.profiles (id, username, full_name)
  values (new.id, _username, _full_name);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- 6b. Auto-verify pulse when confirmation count reaches threshold
create or replace function handle_pulse_confirmation()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  _new_count int;
begin
  update public.pulses
    set confirm_count = confirm_count + 1,
        updated_at    = now()
    where id = new.pulse_id
    returning confirm_count into _new_count;

  if _new_count >= 3 then
    update public.pulses
      set is_verified = true,
          updated_at  = now()
      where id = new.pulse_id and not is_verified;
  end if;

  return new;
end;
$$;

create trigger on_pulse_confirmed
  after insert on pulse_confirmations
  for each row execute function handle_pulse_confirmation();

-- 6c. Recalculate trust score when interaction completes
create or replace function handle_interaction_completed()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  _total       int;
  _positive    int;
  _negative    int;
  _score       float;
begin
  -- Only fire when status changes to 'completed'
  if new.status <> 'completed' or old.status = 'completed' then
    return new;
  end if;

  -- Count completed interactions where this user was the provider
  select
    count(*),
    count(*) filter (where feedback = 'positive'),
    count(*) filter (where feedback = 'negative')
  into _total, _positive, _negative
  from public.interactions
  where provider_id = new.provider_id
    and status = 'completed';

  -- Simple trust formula: base 50 + weighted feedback (max 100)
  _score := least(100, greatest(0,
    50.0
    + (_positive * 10.0)
    - (_negative * 15.0)
  ));

  update public.profiles
    set trust_score            = _score,
        successful_interactions = _total,
        is_verified_neighbor   = (_total >= 3),
        updated_at             = now()
    where id = new.provider_id;

  return new;
end;
$$;

create trigger on_interaction_completed
  after update on interactions
  for each row execute function handle_interaction_completed();

-- 6d. Auto-update updated_at columns on row changes
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at      before update on profiles      for each row execute function set_updated_at();
create trigger trg_pulses_updated_at        before update on pulses        for each row execute function set_updated_at();
create trigger trg_resources_updated_at     before update on resources     for each row execute function set_updated_at();
create trigger trg_interactions_updated_at  before update on interactions  for each row execute function set_updated_at();
create trigger trg_conversations_updated_at before update on conversations for each row execute function set_updated_at();
create trigger trg_pets_updated_at          before update on pets          for each row execute function set_updated_at();

-- ─── 7. Row Level Security ──────────────────────────────

-- Enable RLS on every table
alter table profiles              enable row level security;
alter table pulses                enable row level security;
alter table pulse_confirmations   enable row level security;
alter table resources             enable row level security;
alter table interactions          enable row level security;
alter table conversations         enable row level security;
alter table conversation_members  enable row level security;
alter table messages              enable row level security;
alter table notifications         enable row level security;
alter table pets                  enable row level security;
alter table pet_matches           enable row level security;
alter table reports               enable row level security;

-- ── profiles ──

create policy "Profiles: anyone can view"
  on profiles for select
  using (true);

create policy "Profiles: owner can update own"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Profiles: owner can delete own"
  on profiles for delete
  using (auth.uid() = id);

-- No direct INSERT policy — handled by the on_auth_user_created trigger

-- ── pulses ──

create policy "Pulses: anyone can view"
  on pulses for select
  using (true);

create policy "Pulses: authenticated users can create own"
  on pulses for insert
  with check (auth.uid() = author_id);

create policy "Pulses: author or admin can update"
  on pulses for update
  using (auth.uid() = author_id or is_admin())
  with check (auth.uid() = author_id or is_admin());

create policy "Pulses: author or admin can delete"
  on pulses for delete
  using (auth.uid() = author_id or is_admin());

-- ── pulse_confirmations ──

create policy "Pulse confirmations: anyone can view"
  on pulse_confirmations for select
  using (true);

create policy "Pulse confirmations: authenticated can insert"
  on pulse_confirmations for insert
  with check (auth.uid() = user_id);

create policy "Pulse confirmations: user can delete own"
  on pulse_confirmations for delete
  using (auth.uid() = user_id);

-- ── resources ──

create policy "Resources: anyone can view"
  on resources for select
  using (true);

create policy "Resources: authenticated can create own"
  on resources for insert
  with check (auth.uid() = owner_id);

create policy "Resources: owner can update"
  on resources for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Resources: owner can delete"
  on resources for delete
  using (auth.uid() = owner_id);

-- ── interactions ──

create policy "Interactions: parties can view"
  on interactions for select
  using (auth.uid() = requester_id or auth.uid() = provider_id);

create policy "Interactions: authenticated can create"
  on interactions for insert
  with check (auth.uid() = requester_id);

create policy "Interactions: parties can update own side"
  on interactions for update
  using (auth.uid() = requester_id or auth.uid() = provider_id)
  with check (auth.uid() = requester_id or auth.uid() = provider_id);

-- ── conversations ──

create policy "Conversations: members can view"
  on conversations for select
  using (
    exists (
      select 1 from conversation_members
      where conversation_members.conversation_id = conversations.id
        and conversation_members.user_id = auth.uid()
    )
  );

create policy "Conversations: authenticated can create"
  on conversations for insert
  with check (auth.role() = 'authenticated');

-- ── conversation_members ──

create policy "Conversation members: members can view"
  on conversation_members for select
  using (
    exists (
      select 1 from conversation_members cm
      where cm.conversation_id = conversation_members.conversation_id
        and cm.user_id = auth.uid()
    )
  );

create policy "Conversation members: authenticated can insert"
  on conversation_members for insert
  with check (auth.role() = 'authenticated');

create policy "Conversation members: user can update own"
  on conversation_members for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── messages ──

create policy "Messages: members can view"
  on messages for select
  using (
    exists (
      select 1 from conversation_members
      where conversation_members.conversation_id = messages.conversation_id
        and conversation_members.user_id = auth.uid()
    )
  );

create policy "Messages: members can send"
  on messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from conversation_members
      where conversation_members.conversation_id = messages.conversation_id
        and conversation_members.user_id = auth.uid()
    )
  );

-- ── notifications ──

create policy "Notifications: user can view own"
  on notifications for select
  using (auth.uid() = user_id);

create policy "Notifications: user can update own"
  on notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Server-side inserts use security definer functions; no direct INSERT policy

-- ── pets ──

create policy "Pets: anyone can view"
  on pets for select
  using (true);

create policy "Pets: authenticated can create own"
  on pets for insert
  with check (auth.uid() = reporter_id);

create policy "Pets: reporter can update own"
  on pets for update
  using (auth.uid() = reporter_id)
  with check (auth.uid() = reporter_id);

create policy "Pets: reporter can delete own"
  on pets for delete
  using (auth.uid() = reporter_id);

-- ── pet_matches ──

create policy "Pet matches: anyone can view"
  on pet_matches for select
  using (true);

-- Inserts handled by server-side AI functions (security definer)

-- ── reports ──

create policy "Reports: authenticated can create"
  on reports for insert
  with check (auth.uid() = reporter_id);

create policy "Reports: admins can view"
  on reports for select
  using (is_admin());

create policy "Reports: admins can update"
  on reports for update
  using (is_admin())
  with check (is_admin());

-- No DELETE on reports — audit trail preserved

-- ─── 8. Security Definer Functions for Server-Side Inserts ──

-- Insert a notification (called from API routes / triggers, bypasses RLS)
create or replace function create_notification(
  _user_id    uuid,
  _type       notification_type,
  _title      text,
  _body       text,
  _action_url text default null,
  _metadata   jsonb default null
)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  _id uuid;
begin
  insert into public.notifications (user_id, type, title, body, action_url, metadata)
  values (_user_id, _type, _title, _body, _action_url, _metadata)
  returning id into _id;
  return _id;
end;
$$;

-- Insert a pet match (called from AI matching API route, bypasses RLS)
create or replace function create_pet_match(
  _lost_report_id   uuid,
  _found_report_id  uuid,
  _confidence_score int,
  _matched_traits   text[] default '{}'
)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  _id uuid;
begin
  insert into public.pet_matches (lost_report_id, found_report_id, confidence_score, matched_traits)
  values (_lost_report_id, _found_report_id, _confidence_score, _matched_traits)
  returning id into _id;
  return _id;
end;
$$;

-- ================================================================
-- REALTIME: Enable in Supabase Dashboard → Database → Replication
-- ================================================================
-- Tables that need Realtime enabled:
--   pulses           (feed live updates)
--   messages         (chat)
--   notifications    (hero alerts, message badges)
-- ================================================================
