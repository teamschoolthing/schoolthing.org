# Schoolthing
Current version: Schoolthing v7.6.0 | SCX-24w23a
Docs last updated: 9th June 2024

DISCLAIMER: code is extremely spaghetti.

## In this file:
- Setup
- .Env file
- Current Features

## Setup
Setup will take a bit of time, mainly because I haven't updated the codebase in a while, but hopefully someone can update everything haha.
1. Run `npm install --force`, the force tag is required because the version of React here is outdated. (Again, if anyone has the time to fix this, please submit a PR!!)

2. Create a `.env` file in the root folder. Fill the file in with the empty values from the next section.

### Service Setups
I use 4 different services for tools on the web app. All these services are free/freemium. If you don't plan on modifying the codebase, these services are absolutely necessary. Otherwise feel free to skip the next three steps.

3.1. Create a Postgres server. I used [Neon](https://neon.tech), setup is super simple. After you're done setting it up, copy the Pooled connection URL and unpooled connection URL to your .env file.

3.2. ImageKit. This is for note uploads. Create and configure an [ImageKit](https://imagekit.io/) account. Setup for this is also easy. Copy your public and private key, open `resources/strings.js` and paste it into the `ikPublicKey` and the `ikPrivateKey` variables respectively. Finally, copy the URL Endpoint into the `ikEndpoint` variable.

3.3. TinyMCE. This is for rich text editing. Create a [tinyMCE](https://www.tiny.cloud/) account and copy your API key into the `editorAPIkey` variable in `resources/strings.js`.

3.4. THE FINAL STEP. Create a [Rollbar](https://rollbar.com/) account for error tracking. Copy the Access key and environment name into the `RollbarAccess` and `RollbarEnvironment` variables in `resources/strings.js`

4. Finally, email configs. This is for sending automated emails to users. If you're using Gmail, generate an [App Password](https://support.google.com/mail/answer/185833?hl=en). If you're using iCloud, generate an [App-specific Password](https://support.apple.com/en-us/102654). Copy it into your `EMAIL_PASSWORD` field in the .env file. Then, open `resources/strings.js` and paste in your email you plan on using and the service (e.g. Gmail, iCloud).

5. Finally, open your Neon SQL editor and paste this:
```sql
CREATE TABLE users (uuid TEXT, org TEXT, fname TEXT, lname TEXT, email TEXT, password TEXT, class TEXT, verified BOOLEAN, points INT, feed TEXT, notes TEXT, liked TEXT, bio TEXT, badges TEXT, teacher BOOLEAN, storage TEXT, vapid TEXT, accentcolor INT)
CREATE TABLE notes (org TEXT, authoruuid TEXT, privateuuid TEXT, uuid TEXT, fname TEXT, class TEXT, title TEXT, content TEXT, purchases INT, likes INT, imgs INT, points INT, subject TEXT, teacher BOOLEAN);
CREATE TABLE organisations (domain TEXT, grades TEXT, subjects TEXT, id TEXT, name TEXT);
CREATE TABLE internaldata (key TEXT, value TEXT);
CREATE TABLE secrets (org TEXT, secret TEXT);
CREATE TABLE notices (org TEXT, broadcast TEXT, title TEXT, timestamp TEXT, content TEXT);
CREATE TABLE logincodes (org TEXT, scope TEXT, data TEXT, code TEXT, timestamp TEXT);
CREATE TABLE orglimits (org TEXT, plan TEXT, limits TEXT);
CREATE TABLE posts (org TEXT, uuid TEXT, authoruuid TEXT, username TEXT, title TEXT, content TEXT, timestamp TEXT, replies TEXT, likes TEXT, email TEXT);

INSERT INTO internaldata VALUES('moderators', '["email@example.com"]');
```
This will initialize your database with the required tables and initial data.

That's it! (I know that was not quick haha, sorry for any frustrations that may have been caused during this. Email me at mihir@pidgon.com if you need help.)

## .Env file

Fill in your .env file with this:
```js
EMAIL_PASSWORD=""
POSTGRES_DATABASE="neondb"
POSTGRES_HOST=""
POSTGRES_PASSWORD=""
POSTGRES_PRISMA_URL=""
POSTGRES_URL=""
POSTGRES_URL_NON_POOLING=""
POSTGRES_USER=""
RELEASE="false"
```


## Current Features:
- Twitter-style page for students to interact with each other
- Fully supports PWA and web-app can be installed on all mobile operating systems and select desktop OS's
- All transactions are verified and completed within milliseconds
- 100 on the Lighthouse score
- Settings to edit name and bio
- a11y compliant
- Content moderation system and reporting for each note
- Notes can be sorted in almost every category
- Code and UI follows best practices
- Very error-secure, with fallbacks for every error
- Modals show all request results, not even a single alert() function
- Feed logs all actions taken by the user
- Leaderboard ranking users by points
- Powerful search engine
- Notes can be liked
- All orgs are protected with an email-scope
- Admins can add notices using Pidgon access tokens
- Email verification
- Notes can be created and uploaded super fast, and quick image uploads
- Grades can be changed in settings
- A ’Teacher’ dashboard for teachers to log in.
- Teachers are able to create login codes so that people without organization emails can create an account.
- Support for ‘teacher’ notes, which glow in the note store.
- Teachers can view current storage of the organization
- Cool animations for mobile
- Clean UI
- So much more I don't even remember
- Even more features I don't remember as of v6
