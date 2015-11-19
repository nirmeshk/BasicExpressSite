[![Build Status](https://travis-ci.org/nirmeshk/BasicExpressSite.svg?branch=master)](https://travis-ci.org/nirmeshk/BasicExpressSite)

Basic Express Site
===================

Source code example for [A simple website in node.js with express, jade and stylus](http://www.clock.co.uk/blog/a-simple-website-in-nodejs-with-express-jade-and-stylus) article.

Build
------

Run this command in console:

```
npm install
```

All dependencies will be downloaded by `npm` to `node_modules` folder.

Configuration files
---------------------
Add `config.ini` file in the project

```
[redis]
redis_host = "redis host"
redis_port = "redis port"
redis_pass = "redis pass" 
[travis]
travis_auth_token = ""
```

Run
---

Run this command in console:

```
node app.js
```

### Milestone Details:
==================

##### The ability to configure a production environment automatically, using a configuration management tool, such as ansible, or configured using docker.

- For this, we are using docker container.
- In order to configure the production environment automatically, we just build a docker container and run the app inside it.
- The `Dockerfile` is provided within the project.

##### The ability to deploy software to the production environment triggered after build, testing, and analysis stage is completed. The deployment needs to occur on actual remote machine/VM (e.g. AWS, droplet, VCL), and not a local VM.

- We have set up travis-ci for building the project. 
- Once the build and test is successfull, travis makes a http request to our deployment server along with the build id. We have used `after_success` hook in `.travis.yml` to make this call.
- The `deployServer.js` is a simple http server, that listens to the deployment requests.
- For each request, it stops the old docker container, pulls the changes for that commit_id, and builds a new container with new code and runs the new container.
- ![screen cast](images/part_1.gif)

##### The ability to use feature flags, serviced by a global redis store, to toggle functionality of a deployed feature in production.
- We use a redis server running on a digital ocean droplet with required authentication enabled. 
- We implement feature flags by having a set in redis containing all the enabled feature flags.
- We made a feature flag for changing the webpage's title. 
- Whenever a request comes in, we check if the feature flag for a new title is in the feature flags set, and if it is we return a page with the new title. If it's not in the feature flags set, or the check to redis fails, we return the page with the default title.

![Feature Flags screencast](https://i.imgur.com/VfT7QYG.gif)

##### The ability to monitor the deployed application (using at least 2 metrics) and send alerts using email or SMS (e.g., smtp, mandrill, twilio). An alert can be sent based on some predefined rule.

- When we want to begin moninoring for our web application, we run <code>node monitoring.js <port> <proxy></code>
  where we can set the port to check for a running web appication and indicate where there is a canary release to check by passing a value to the proxy parameter.

- The web application that we want to monitor will maintain it's original start time and the number of requests that it receives.
- Our monitoring application sends a request the the application for this
![Monitoring screencast](http://i.imgur.com/FSX8QL1.gif)

##### The ability to perform a canary release: Using a proxy/load balancer server, route a percentage of traffic to a newly staged version of software and remaining traffic to a stable version of software. Stop routing traffic to canary if alert is raised.



