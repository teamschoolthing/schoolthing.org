CREATE TABLE users (fname TEXT, lname TEXT, email TEXT, password TEXT, class TEXT, verified BOOLEAN, points INT, feed TEXT, notes TEXT)
CREATE TABLE notes (org TEXT authoruuid TEXT, privateuuid TEXT, uuid TEXT, fname TEXT, class TEXT, title TEXT, content TEXT, purchases INT, likes INT, imgs INT, points INT, subject TEXT)
CREATE TABLE organisations (domain TEXT, grades TEXT, subjects TEXT, id TEXT, name TEXT)
CREATE TABLE notices (org TEXT broadcast TEXT title TEXT timestamp TEXT content TEXT)
