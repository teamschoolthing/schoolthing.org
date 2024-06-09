CREATE TABLE users (uuid TEXT, org TEXT, fname TEXT, lname TEXT, email TEXT, password TEXT, class TEXT, verified BOOLEAN, points INT, feed TEXT, notes TEXT, liked TEXT, bio TEXT, badges TEXT, teacher BOOLEAN, storage TEXT, vapid TEXT, accentcolor INT)
CREATE TABLE notes (org TEXT, authoruuid TEXT, privateuuid TEXT, uuid TEXT, fname TEXT, class TEXT, title TEXT, content TEXT, purchases INT, likes INT, imgs INT, points INT, subject TEXT)
CREATE TABLE organisations (domain TEXT, grades TEXT, subjects TEXT, id TEXT, name TEXT)
CREATE TABLE internaldata (key TEXT, value TEXT)
CREATE TABLE secrets (org TEXT, secret TEXT)

-- This file is used for initialising new databases

-- First command when starting the database [IMPORTANT]: INSERT INTO internaldata VALUES('moderators', '["mihir@pidgon.com", "manuadhitya16@gmail.com"]')

-- last updated 1st November, 2023: Get latest version from Manu (do not change users)
