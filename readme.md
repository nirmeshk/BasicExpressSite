[![Build Status](https://travis-ci.org/nirmeshk/BasicExpressSite.svg?branch=master)](https://travis-ci.org/nirmeshk/BasicExpressSite)

Basic Express Site
==================

Source code example for [A simple website in node.js with express, jade and stylus](http://www.clock.co.uk/blog/a-simple-website-in-nodejs-with-express-jade-and-stylus) article.

Build
-----

Run this command in console:

```
npm install
```

All dependencies will be downloaded by `npm` to `node_modules` folder.

Configuration files
---------------------

```
scope = global
[auth]
travis_auth_token = "Your auth token for travi ci repo"
```



Run
---

Run this command in console:

```
node app.js
```

Open `http://localhost:3000` to access basic Express Site.

To deploy using a docker container:

```
sudo docker build -t ncsu/deployserver .
sudo docker run -d -p 3000:3000 ncsu/deployserver
```
