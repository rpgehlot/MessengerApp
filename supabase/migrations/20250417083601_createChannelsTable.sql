drop table if exists channels;
drop table if exists channel_user_mapping;
drop table if exists messages;

create table if not exists channels (
    id serial primary key,
    name varchar(50) not null,
    is_group boolean default false
);

create table if not exists channel_user_mapping (
    id serial,
    user_id integer not null,
    channel_id integer not null,
    constraint fk_channel_user foreign key(user_id) references public.users(id) on delete cascade,
    constraint fk_channel foreign key(channel_id) references public.channels(id) on delete cascade,
    primary key(user_id, channel_id)
);

create table messages(
    entry_id serial primary key,
    message_id integer not null,
    channel_id integer not null,
    sender_id integer not null,
    content text not null,
    created_at timestamp default CURRENT_TIMESTAMP,
    unique(message_id, channel_id),
    constraint fk_msg_user foreign key(sender_id) references public.users(id) on delete set null,
    constraint fk_msg_channel foreign key(channel_id) references public.channels(id) on delete cascade
);


