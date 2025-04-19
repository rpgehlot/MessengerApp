
alter table if exists public.users_metadata drop constraint if exists fk_user;
alter table if exists public.users_metadata alter column user_id type uuid USING (uuid_generate_v4());
;
alter table if exists public.users_metadata add constraint fk_user foreign key(user_id) references auth.users(id) on delete cascade;


alter table if exists public.channel_user_mapping drop constraint if exists fk_channel_user;
alter table if exists public.channel_user_mapping alter column user_id type uuid USING (uuid_generate_v4());
alter table if exists public.channel_user_mapping add constraint fk_channel_user foreign key(user_id) references auth.users(id) on delete cascade;


alter table if exists public.messages drop constraint if exists fk_msg_user;
alter table if exists public.messages alter column sender_id type uuid USING (uuid_generate_v4());
alter table if exists public.messages add constraint fk_msg_user foreign key(sender_id) references auth.users(id) on delete cascade;
