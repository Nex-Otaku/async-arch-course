create table accounts
(
    id int auto_increment
        primary key,
    public_id varchar(36) not null,
    role varchar(255) not null,
    login varchar(255) not null,
    password_hash varchar(255) not null
);

create table tasks
(
    id int auto_increment
        primary key,
    public_id varchar(36) null,
    assigned_account_id varchar(36) null,
    title text not null,
    status varchar(255) not null
);

create table tokens
(
    id int auto_increment
        primary key,
    token varchar(255) not null,
    account_id int not null
);
