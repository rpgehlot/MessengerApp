alter table "public"."channel_user_mapping" drop constraint "fk_channel_user";

alter table "public"."messages" drop constraint "fk_msg_user";

alter table "public"."users_metadata" drop constraint "fk_user";

create table "public"."users" (
    "id" uuid not null,
    "username" character varying(50) not null,
    "email" character varying(255) not null,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP
);


alter table "public"."channels" add column "avatar_url" character varying(255) default NULL::character varying;

alter table "public"."channels" add column "channel_description" character varying(200) default NULL::character varying;

alter table "public"."channels" alter column "is_group" set not null;

alter table "public"."messages" alter column "created_at" set default now();

alter table "public"."messages" alter column "created_at" set not null;

alter table "public"."users_metadata" add column "bio" text not null default 'Available'::text;

alter table "public"."users_metadata" alter column "is_online" set not null;

alter table "public"."users_metadata" alter column "user_id" set not null;

CREATE UNIQUE INDEX users_metadata_user_id_key ON public.users_metadata USING btree (user_id);

CREATE UNIQUE INDEX users_metadata_username_key ON public.users_metadata USING btree (username);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."users" add constraint "users_username_key" UNIQUE using index "users_username_key";

alter table "public"."users_metadata" add constraint "users_metadata_user_id_key" UNIQUE using index "users_metadata_user_id_key";

alter table "public"."users_metadata" add constraint "users_metadata_username_key" UNIQUE using index "users_metadata_username_key";

alter table "public"."channel_user_mapping" add constraint "fk_channel_user" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."channel_user_mapping" validate constraint "fk_channel_user";

alter table "public"."messages" add constraint "fk_msg_user" FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "fk_msg_user";

alter table "public"."users_metadata" add constraint "fk_user" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."users_metadata" validate constraint "fk_user";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.checkifcommonchannelexists(user_id1 uuid, user_id2 uuid)
 RETURNS TABLE(channel_id integer)
 LANGUAGE sql
AS $function$
      SELECT channel_id
        FROM channel_user_mapping cu
      LEFT JOIN channels ch on ch.id = cu.channel_id
      WHERE ( cu.user_id=user_id1 or cu.user_id=user_id2 )
      AND ch.is_group = false
      GROUP BY cu.channel_id
        HAVING COUNT(DISTINCT cu.user_id) >= 2;
$function$
;

CREATE OR REPLACE FUNCTION public.checkifcommonchannelexists(user_id1 uuid, user_id2 uuid, isgroup boolean)
 RETURNS TABLE(channel_id integer)
 LANGUAGE sql
AS $function$
      SELECT channel_id
        FROM channel_user_mapping cu
      LEFT JOIN channels ch on ch.id = cu.channel_id
      WHERE ( cu.user_id=user_id1 or cu.user_id=user_id2 )
      AND ch.is_group = isgroup
      GROUP BY cu.channel_id
        HAVING COUNT(DISTINCT cu.user_id) >= 2;
$function$
;

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";


