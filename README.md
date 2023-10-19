<p align="center">
  <img src="https://s3.amazonaws.com/tw-inlineimages/467579/0/0/ff47c124a5732bf549b43532a7ac19e1.png"/>
</p>
<p align="center">
  <a href="http://www.openforge.io/">Official Website</a> |
  <a href="http://www.openforge.io/opportunities">Opportunities</a> |
  <a href="https://openforge.io/mobile-academy/">Mobile Academy</a>
</p>

<h3 align="center">
  Leading By Example.
</h3>


# Rock The Steps

For install the dependencies `npm install`.  
Note: In case you are running issues becase the Macs M1/Intel chip variations try deleting package.lock and install again.  
For run on web browser `npm run start`

In order to run on  Emulator you need to run: `npm run sync:app`  and `npm run build:app`

To run using iOS: `npm run ios:app`

To run using Android `npm run android:app` 

# Debug Mode

To turn on/off debug mode (the boxes) go to phaser-singleton.module.ts and toggle the arcade 'debug:false/debug:true'

# Architecture

This project uses Ionic Framework for the majority of screens and overlays; and uses Phaser for the gameplay itself. Please see corresponding documentation on their respective websites.

# LICENSE

For more detailed information on licensing, see the LICENSE.md file included in the repository

# Checking Licenses

To run the license checker, use
`npx license-checker --summary` or vanilla `npx license-checker`

# Important - Utilizing this Repo

Most of the commands to generate projects/capabilities/apps are default to NX, Ionic, or Angular (in that order), so we will NOT include their specific instructions since as the packages update so will the documentation.

With that said, there are some special things to keep in mind...

## Generating a Project - Additional Step

After any project is created by NX, we MUST add StyleLint

nx g nx-stylelint:configuration --project <projectName>

## Generate an application

The normal NX command to generate an app is `nx g @nx/react:app my-app` ; however, there are some special steps to generate an Ionic App. These are defined well in [Eric Jeker's post here](https://medium.com/@eric.jeker/how-to-integrate-ionic-in-nrwl-nx-3493fcb7e85e)

When using Nx, you can create multiple applications and libraries in the same workspace.

## Adding Capacitor to your application

We are using Capacitor to run the project in mobile. We configured Capacitor to be able to run in monorepos, so if you want to add capacitor into your application follow this steps:

1. Make sure you have run `nx build your-app-name` (Where `your-app-name` will be the name of your application).
2. Make sure your application has the `package.json` created, if not create one at the root of you application folder `apps/your-application-folder` and add the folowing properties: `"name": your-app-name`, `"version": "0.0.0"`, `"licence: "MIT""`, `"private: true"`, `"dependencies: {}"`, `"devDependencies": {}` (where `your-app-name` will be replaced with your currently application name).
3. Go to `apps/your-app-name` and run `npm install @capacitor/cli --save-dev`, then run `npm install @capacitor/core`.
4. Nowe it's time to initialize Capacitor. Go to `apps/your-app-name` and run `npx cap init`.
5. In the project root folder, search for the `ionic.config.json` file and add `your-app-name` as a new project in the `projects` array. You can copy&paste the example one and just replace all instances.

## Adding a Capacitor Platform to your application

1. At the root of your project, run `ionic capacitor add platform --project=your-app-name` (Where `platform` could be `ios` | `android`) (Where `your-project-name` will be the project name you set into the `ionic.config.json` file).

## Running your application with Capacitor

1. Run `nx build your-app-name` (Where `your-app-name` will be the name of your application).
2. Run `cd apps/your-app-name && npx cap copy`.
3. Run `cd apps/your-app-name && npx cap sync`.
4. Run `cd apps/your-app-name && npx cap open platform`. (Where `platform` could be `ios` | `android`)

# NX Original Instructions

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

## Generate a library

Run `nx g @nx/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@rock-the-steps/mylib`.

## Code scaffolding

Run `nx g @nx/angular:component my-component --project=my-app` to generate a new component.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.
