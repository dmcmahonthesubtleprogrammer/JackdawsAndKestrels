# JackdawsAndKestrels

Thanks for checking out this project!

This guide assumes that you have MAMP installed on your computer.

Extract these files to your MAMP htdocs folder.

Enter this url based on where your file is located
http://localhost:81/yourfolderdirectory/Jackdaws%20and%20Kestrels/mainMenu.php

Database set up: 
High score database: 

Create using phpmyadmin: 
1 - add new database named jackdawsandkestrels

2 - add new table named users with this layout:
id - bigint(20) - AUTO_INCREMENT
name - varchar(255) 
score - bigint(20)
date - varchar(255)

Create using mysql: 
1 - CREATE DATABASE [IF NOT EXISTS] jackdawsandkestrels 
[CHARACTER SET utf8mb3]
[COLLATE utf8mb3_general_ci]

2 - create table highscores(
   id BIGINT(20) NOT NULL AUTO_INCREMENT,
   name VARCHAR(255)  NOT NULL,
   score BIGINT(20) NOT NULL,
   date VARCHAR(255) NOT NULL
);
