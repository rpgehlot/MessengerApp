drop table if exists last_sequence;

create table last_sequence(
    channel_id integer not null primary key,
    last_sequence integer not null,
    constraint fk_msg_channel foreign key(channel_id) references public.channels(id) on delete cascade
);


