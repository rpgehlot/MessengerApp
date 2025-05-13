create type messageStatus as enum('queued','delievered','read');
alter table messages add column status messageStatus not null default 'queued';