alter table if exists public.users_metadata rename column firstName to first_name;
alter table if exists public.users_metadata rename column lastName to last_name;
alter table if exists public.users_metadata rename column avatarUrl to avatar_url;
alter table if exists public.users_metadata rename column online to is_online;
