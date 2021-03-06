# Mothership JS

## About

Mothership JS allows you to log client-side errors to your [Mothership](https://mothership.app) account where you can gather and organize logs in addition to performing backups, healthchecks, and sync your devlopment box with your various environments in seconds.

Once you've signed up let's get started!

## Installing

### JS Module

To import mothership js logs as a module include it an initialize with your logging token at [https://mothership.app/](https://mothership.app/) > Project > Project Settings > Log Settings

```sh
yarn add mothership-js
```

```sh
npm install mothership-js --save
```

```js
import MothershipJs from 'mothership-js'
...
var mjs = new MothershipJs({apiKey: 'XXXXXXXX'});
```

Do note that you will need Mothership JS to init pretty early in your page load to catch all the errors so ensure it's bundled in something that loads towards the top of the head before any other libraries that you may want to debug

### Library

Download [mothership-js.lib.js](https://raw.githubusercontent.com/MothershipApp/mothership-js/master/library-dist/mothership-js.lib.js) and place it in your javascript directory (the example below we assume it's called "js").

Drop the following into your `<head>` as close to the top as you can and populate the apiKey with your logging token at [https://mothership.app/](https://mothership.app/) > Project > Project Settings > Log Settings

```html
<script>
  window.MothershipConfig = { apiKey: "XXXXXX" };
</script>
<script src="js/mothership-js.lib.js"></script>
```

This will create `window.MothershipJs` which you can access from anywhere to change configuration or execute errors in your try/catch or anywhere you need to log something.

## Options

Here are the default options

```js
apiKey: "", // required
enabled: true, // enables or disables logging entirely
environment: null, // String defining the environment
version: null, // String defining the version
minimumErrorLevel: "debug", // The minimum error level to log (must be at least "error" to capture uncaught exceptions)
customPayload: {}, // An object of any custom information
allowedDomains: [], // Array of strings of domains that should be logged
disallowedDomains: [], // Array of strings of domains that shouldn't be logged
disableIPCapture: false, // Tells Mothership not to store the IP Address of the client logging
captureUncaught: true // If disabled will not capture uncaught exceptions
```

They can be set on the library install like-a-so:

```html
<script>
  window.MothershipConfig={
    apiKey: "XXXXXX",
    disallowedDomains: ['google.com', 'whatever.com'],
    ...etc...
  }
</script>
<script src="/main.js"></script>
```

Or, on when using it as a js module:

```js
new MothershipJs({
  apiKey: 'XXXXXXXX',
  disableIPCapture: true,
  ...
});
```

You can also set individual settings like so:

### Setting options from the library instance

```js
window.MothershipJs.environment = "production";
window.MothershipJs.version = "1.0.3";
```

### Setting options from js module instance

```js
mjs.environment = "production";
mjs.version = "1.0.3";
```

## Usage

Out of the box Mothership JS will automatically submit all uncaught errors that happen. If you would like to log errors that _are_ caught you can use the following methods:

### Example from Library Install

```js
window.MothershipJs.critical("Woah, we messed up");
window.MothershipJs.error("Like... really messed up");
window.MothershipJs.warn("I mean... not that bad");
window.MothershipJs.info("We just wanted to know");
window.MothershipJs.debug("This was all a test");
```

### Example when using the JS Module

```js
mjs.critical("Woah, we messed up");
mjs.error("Like... really messed up");
mjs.warn("I mean... not that bad");
mjs.info("We just wanted to know");
mjs.debug("This was all a test");
```

## Development and Testing

### Build

This will build both the library and the js module packages

```sh
yarn build-lib
```

```sh
npm run build-lib
```

### Development

```sh
yarn serve
```

```sh
npm run serve
```

### Testing

```sh
yarn test
```

```sh
npm run test
```
