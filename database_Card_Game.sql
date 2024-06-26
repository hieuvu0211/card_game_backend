create database CardGame;
use CardGame;
drop table if exists Skins;
drop table if exists Skin_Groups;
drop table if exists Players;
drop table if exists Match_Participants;
drop table if exists Matches;
drop table if exists Deposit_History;
drop table if exists Skin_User;

#1
create table Players (
    player_id int primary key auto_increment,
    username nvarchar(255) not null unique,
    password nvarchar(255) not null,
    score int default 0,
    elo int default 0,
    currentSkin int default 0,
    recharge_rank int default 0
);

#2
create table Skin_Groups (
    skin_group_id int primary key auto_increment,
    skin_group_name nvarchar(255) not null
);

#3
create table Skins (
    skin_id int primary key auto_increment,
    skin_name nvarchar(255) not null,
    skin_price int default 0,
    skin_group_id int not null,
    foreign key(skin_group_id) references Skin_Groups(skin_group_id)
);

#4
create table Matches (
    match_id int primary key auto_increment,
    match_date datetime default now(),
    match_details nvarchar(255)
);

#5
create table Match_Participants (
    match_id int not null,
    player_id int not null,
    result int default 6,
    foreign key(match_id) references Matches(match_id),
    foreign key(player_id) references Players(player_id)
);

# 6
create table Deposit_History(
    deposit_id INT PRIMARY KEY AUTO_INCREMENT,
    player_id INT,
    deposit_amount DECIMAL(10, 2),
    deposit_date DATETIME DEFAULT NOW(),
    FOREIGN KEY (player_id) REFERENCES Players(player_id)
);

#7
create table Skin_User (
    skin_user_id INT PRIMARY KEY AUTO_INCREMENT,
    skin_id int not null,
    player_id int not null,
    skin_user_expried int,
    foreign key(player_id) references Players(player_id),
    foreign key(skin_id) references Skins(skin_id)
);

#insert data into database
insert into Players(username, password, score, elo, recharge_rank, currentSkin)
 values('guest1', '123456', 500000, 1200, 7, 3);
insert into Players(username, password, score, elo, recharge_rank, currentSkin)
 values('guest2', '123456', 40000, 1100, 5, 3);
insert into Players(username, password, score, elo, recharge_rank, currentSkin)
 values('guest2', '123456', 40000, 1100, 5, 3);
insert into Players(username, password, score, elo, recharge_rank, currentSkin)
 values('guest2', '123456', 40000, 1100, 5, 3);
 INSERT INTO Players(username, password, score, elo, recharge_rank, currentSkin) 
VALUES('player1', 'pass123', 25000, 1000, 1, 2),
       ('player2', 'pass456', 28000, 1020, 2, 3),
       ('player3', 'pass789', 32000, 1050, 4, 1);

insert into skin_groups(skin_group_name) values('Thần thoại');
insert into skin_groups(skin_group_name) values('Huyền thoại');
insert into skin_groups(skin_group_name) values('Sử thi');
insert into skin_groups(skin_group_name) values('Tối thượng');

insert into skins(skin_name, skin_price, skin_group_id)
values('Shadowed Assassin', 10000, 1);
insert into skins(skin_name, skin_price, skin_group_id)
values('Crimson Royalty', 13000, 2);
insert into skins(skin_name, skin_price, skin_group_id)
values('Electric Empress', 20000, 2);
insert into skins(skin_name, skin_price, skin_group_id)
values('Frostbite Sovereign', 400000, 3);
Shadowed Assassin     |      10000 |             1 |
|       3 | Crimson Royalty       |      13000 |             2 |
|       4 | Electric Empress      |      20000 |             2 |
|       5 | Frostbite Sovereign   |     400000 |             3 |
|       6 | Golden Guardian       |     100000 |             2 |
|       7 | Obsidian Ninja        |     110000 |             1 |
|       8 | Phantom Prince        |     200000 |             2 |
|       9 | Neon Nefarious        |     150000 |             3 |
|      10 | Celestial Samurai     |     170000 |             3 |
|      11 | Molten Monarch        |     150000 |             3 |
|      12 | Enigmatic Enchantress |     150000 |             2 |
|      13 | Cosmic Commander      |     130000 |             2 |
|      14 | Lunar Lycan           |     200000 |             1 |
|      15 | Radiant Rogue

insert into skin_user(skin_id, player_id, skin_user_expried)
values(1, 1, 3);
insert into skin_user(skin_id, player_id)
values(1, 2);
insert into skin_user(skin_id, player_id)
values(2, 2);
insert into skin_user(skin_id, player_id)
values(2, 1);

insert into matches(match_details) values('Trận đấu ngày 26-3-2024');
insert into matches(match_details) values('Trận đấu ngày 26-3-2024');
insert into matches(match_details) values('Trận đấu ngày 27-3-2024');
insert into matches(match_details) values('Trận đấu ngày 28-3-2024');

insert into Match_Participants(match_id, player_id, result) VALUES (1, 1, 1);
insert into Match_Participants(match_id, player_id, result) VALUES (2, 1, 2);
insert into Match_Participants(match_id, player_id, result) VALUES (3, 2, 3);
insert into Match_Participants(match_id, player_id, result) VALUES (3, 1, 5);

insert into deposit_history(player_id, deposit_amount) values(1, 30000);
insert into deposit_history(player_id, deposit_amount) values(2, 42000);
insert into deposit_history(player_id, deposit_amount) values(1, 30000);
insert into deposit_history(player_id, deposit_amount) values(3, 25000);
insert into deposit_history(player_id, deposit_amount) values(2, 67000);
insert into deposit_history(player_id, deposit_amount) values(3, 100000);


select * from skins;
delete from skins where skin_id=5
