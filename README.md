# JackdawsAndKestrels

Enter this url based on where your file is located
http://localhost:81/folderdirectory/Jackdaws%20and%20Kestrels/mainMenu.php

Database set up: 
High score database: 

Create using mysql: 
1 - CREATE DATABASE [IF NOT EXISTS] watchtime 
[CHARACTER SET utf8mb3]
[COLLATE utf8mb3_general_ci]

2 - create table highscores(
   id BIGINT(20) NOT NULL AUTO_INCREMENT,
   name VARCHAR(255)  NOT NULL,
   score VARCHAR(20) NOT NULL,
   date VARCHAR(255) NOT NULL
);
