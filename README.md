# Qubecloud.io - Server Hosting Platform

Link - https://qubecloud.io/

![Qubecloud](https://i.imgur.com/AbsyUZn.png)

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

## Screenshots
### Overview
![Qubecloud Overview](https://i.imgur.com/O0eioqO.png)

### Server Creation
![Qubecloud Create 1](https://i.imgur.com/sdIrqp8.png)

![Qubecloud Create 2](https://i.imgur.com/ZPOsSj1.png)

### Server Details
![Qubecloud Create 2](https://i.imgur.com/9yxaHDw.png)



## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
