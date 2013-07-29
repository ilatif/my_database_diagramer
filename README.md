Introduction
============
This is a Codeigniter based library that will let user to generate image of database schema in browser. Using this library user can generate image of database schema in his browser. User can:-

1. delete table(s)
2. delete field(s) from table
3. change position of tables by drag n drop
4. change position of fields within a table by drag n drop
5. resize a table
6. rename table_name / field_name
7. generate image of database sechma locally within a browser instantly

Motivation
==========
The most importatnt for every programmer who joins a new team is to understand the database schema and an image of database schema is what you need. This happens to me too many times. As I' am a lazy person I don't want to install any Softwares to generate image. Also I want something where I can view structure of database and relationships among tables in a clear and consise way. I found for some tools around but didn't find any cool tool so I decided to create my own tool. This library uses HTML5 Canvas to generate image of database schema in browser instantly.

Usage
=====
Presently this projects is built in Codeigniter but can be easily used with any framework. The heart of this tool is table drawing code on canvas which is built in JavaScript. To use this library you can either download this full git repo. This is a Codeigniter project so you just have to change the **"/application/config/database.php"** to match your database settings and then on visiting this project in your browser e.g. **http://locatlhost/my_database_diagramer** will show you tables from your database and you can adjust them around according to your needs and generate an image instantly. To save image right-click on image and click on 'Save image as'.

If you want to use this library in your own project then just copy **"/application/controllers/database_diagramer.php"** and **"/application/views/database_diagramer"** into your project. All necessary **JavaScript** and **CSS** files have been included in **"/application/views/database_diagramer"** so you don't need to do any extra configuration.

Important
=========
1. ***Please! note that this library will not alter your database schema in any way. If you are removing a table it means that you are removing it from the generated image. To alter underlying database schema there are plenty of tools available such as phpMyAdmin etc.***

2. ***Please! use latest versions of Canvas supported Browsers such as Chrome and Firefox to use this library.***

Todo
====
Most important thing to add in this Library is to add relationships support among tables. Other todos might include editing of generated image to manipulate it further by drawing text / things

Contribution
============
1. Fork this library.
2. Submit Pull Requests.
3. Report issues.
4. Test this library with other databases such as PostgreSQL, MongoDB etc.



