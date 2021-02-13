# Qubecloud.io - Server Hosting Platform


![Qubecloud](https://qubecloud.io/images/global/TextAndLogoPrimary.svg)

https://qubecloud.io/

Qubecloud is a side project I have been working on that aims to make Minecraft server deployment a breeze.

I primarily used it as a way to improve my knowledge about containerized services and Kubernetes. Each server can be deployed in isolation using dynamically configured Dockerfiles.

Currently, I am using Google Compute Engine to run the docker containers, but with minor effort, this can be changed to run on a full Kubernetes environment. Finding the correct balance as it scales from a few servers to potentially hundreds is why I am starting with CE and will later move to K8s.

## Stack
* Plain HTML/CSS Landing Page
* Angular 10 Web Application
* [Nebular](https://akveo.github.io/nebular/) Component Library
* Firebase - Auth, Cloud Functions and Firestore Database
* Docker - WebApp talks to a seperate backend service to configure and build a Minecraft Server Dockerfile
* Google Compute Engine for Dockerized VM Server Deployments
* Paddle Payment Integration

## Overview
### Landing Page

Hosted separately and built using static HTML and CSS for improved search engine optimization.

![Qubecloud](https://i.imgur.com/AbsyUZn.png)


### Servers Summary

This is a glanceable summary of all servers you have running.

![Qubecloud Overview](https://i.imgur.com/O0eioqO.png)

### Server Creation

The first step in a three-step process when setting up a new server. The plan you choose essentially decides the resources available to your server.

![Qubecloud Create 1](https://i.imgur.com/sdIrqp8.png)

The second step is the main part of the process. Here you provided a name for your server as well as what version and/or modpack to deploy.

![Qubecloud Create 2](https://i.imgur.com/ZPOsSj1.png)

The final step is a summary screen and payment screen.

### Server Details

This is a detailed view of a server. You can track CPU and ram server load, monitor the Minecraft server logs, as well as update any server-specific configuration.

![Qubecloud Create 2](https://i.imgur.com/9yxaHDw.png)


## Development and Deployment
See `package.json` for scripts to assist running a local server, or deploying to Firebase Hosting
