drop table if exists users;
drop table if exists users_metadata;

create table if not exists users (
    id serial primary key,
    username varchar(50) unique not null,
    password varchar(50) not null,
    email varchar(255) not null,
    created_at timestamp default CURRENT_TIMESTAMP
);

create table if not exists users_metadata (
    id serial primary key,
    user_id integer,
    firstName varchar(30) not null,
    lastName varchar(30) not null,
    avatarUrl varchar(255) default null,
    constraint fk_user foreign key(user_id) references users(id) on delete cascade
);

