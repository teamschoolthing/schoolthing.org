CREATE TABLE users (uuid TEXT, org TEXT, fname TEXT, lname TEXT, email TEXT, password TEXT, class TEXT, verified BOOLEAN, points INT, feed TEXT, notes TEXT, liked TEXT, bio TEXT, badges TEXT, teacher BOOLEAN, storage TEXT, vapid TEXT, accentcolor INT)
CREATE TABLE notes (org TEXT, authoruuid TEXT, privateuuid TEXT, uuid TEXT, fname TEXT, class TEXT, title TEXT, content TEXT, purchases INT, likes INT, imgs INT, points INT, subject TEXT, teacher BOOLEAN);
CREATE TABLE organisations (domain TEXT, grades TEXT, subjects TEXT, id TEXT, name TEXT);
CREATE TABLE internaldata (key TEXT, value TEXT);
CREATE TABLE secrets (org TEXT, secret TEXT);
CREATE TABLE notices (org TEXT, broadcast TEXT, title TEXT, timestamp TEXT, content TEXT);
CREATE TABLE logincodes (org TEXT, scope TEXT, data TEXT, code TEXT, timestamp TEXT);
CREATE TABLE orglimits (org TEXT, plan TEXT, limits TEXT);
CREATE TABLE posts (org TEXT, uuid TEXT, authoruuid TEXT, username TEXT, title TEXT, content TEXT, timestamp TEXT, replies TEXT, likes TEXT, email TEXT);

INSERT INTO internaldata VALUES('moderators', '["mihir@pidgon.com", "manuadhitya16@gmail.com"]');


-- last updated 20th June, 2023: So far everything is up to date
