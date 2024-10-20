create table contracts_info
(
    id          int auto_increment
        primary key,
    hash        int          not null,
    name        varchar(255) not null,
    description varchar(255) null,
    constraint contracts_info_pk_2
        unique (hash)
);

create table games
(
    id             int auto_increment
        primary key,
    name           varchar(255) not null,
    description    varchar(255) null,
    token          varchar(255) not null,
    datetime_added double       not null
);

create table configs_info
(
    id          int auto_increment
        primary key,
    hash        int          not null,
    game_id     int          not null,
    name        varchar(255) not null,
    description varchar(255) null,
    `group`     varchar(255) null,
    constraint configs_info_pk_2
        unique (hash),
    constraint configs_info_games_id_fk
        foreign key (game_id) references games (id)
);

create table configs_contracts
(
    id          int auto_increment
        primary key,
    config_id   int not null,
    contract_id int not null,
    constraint configs_contracts_configs_info_id_fk
        foreign key (config_id) references configs_info (id),
    constraint configs_contracts_contracts_info_id_fk
        foreign key (contract_id) references contracts_info (id)
);

create table configs_data
(
    id         int auto_increment
        primary key,
    version_id int not null,
    game_id    int not null,
    config_id  int not null,
    constraint configs_data_configs_info_id_fk
        foreign key (config_id) references configs_info (id),
    constraint configs_data_games_id_fk
        foreign key (game_id) references games (id)
);

create table configs_data_versions
(
    id              int auto_increment
        primary key,
    game_id         int           not null,
    config_id       int           not null,
    data_json       json          not null,
    version         int default 0 not null,
    datetime_update double        not null,
    constraint configs_data_versions_configs_info_id_fk
        foreign key (config_id) references configs_info (id),
    constraint configs_data_versions_games_id_fk
        foreign key (game_id) references games (id)
);

create table members_info
(
    id                       int auto_increment
        primary key,
    contract_id              int          not null,
    field_type               int          not null,
    name                     varchar(255) not null,
    description              varchar(255) null,
    link_contract_hash       int          null,
    first_element_field_type int          null,
    constraint members_info_contracts_info_id_fk
        foreign key (contract_id) references contracts_info (id),
    constraint members_info_contracts_info_id_fk_2
        foreign key (link_contract_hash) references contracts_info (id)
);

create table user_roles
(
    id             int auto_increment
        primary key,
    name           varchar(20) not null,
    datetime_added double      not null
);

create table role_privileges
(
    id                    int                  not null
        primary key,
    can_add_new_game      tinyint(1) default 0 not null,
    can_remove_game       tinyint(1) default 0 not null,
    can_add_new_user      tinyint(1) default 0 not null,
    can_remove_user       tinyint(1) default 0 not null,
    can_switch_role_user  tinyint(1) default 0 not null,
    can_create_new_role   tinyint(1) default 0 not null,
    can_edit_game         tinyint(1) default 0 not null,
    can_edit_configs_game tinyint(1) default 0 not null,
    can_view_all_games    tinyint(1) default 0 not null,
    datetime_update       double               not null,
    constraint role_privileges_user_roles_id_fk
        foreign key (id) references user_roles (id)
);

create table users
(
    id             int auto_increment
        primary key,
    nickname       varchar(20)  not null,
    password       varchar(255) not null,
    role_id        int          null,
    datetime_added double       not null,
    constraint users_user_roles_id_fk
        foreign key (role_id) references user_roles (id)
);

create table users_games
(
    id              int auto_increment
        primary key,
    user_id         int    not null,
    game_id         int    not null,
    datetime_update double not null,
    constraint users_games_games_id_fk
        foreign key (game_id) references games (id),
    constraint users_games_users_id_fk
        foreign key (user_id) references users (id)
);

