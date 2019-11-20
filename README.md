# Mothership JavaScript Logging Library

## Installing

### Simple

Drop the following into your ```<head>``` as close to the top as you can and populate the apiKey with your logging token at [https://mothership.app/](https://mothership.app/) > Project > Project Settings > Log Settings

```html
<script>
  window.MothershipConfig={ apiKey: "XXXXXX" } 
</script>
<script src="/main.js"></script>
```

### Advanced

To import mothership js logs as a module include it an initialize with your logging token at [https://mothership.app/](https://mothership.app/) > Project > Project Settings > Log Settings

```js
import MothershipLogger from 'mothership-js-logs'
...
var mothershipLogger = new MothershipLogger({apiKey: 'XXXXXXXX'});
```

Do note that you will need Mothership Logger to init pretty early in your page load to catch all the errors so ensure it's bundled in something that loads towards the top of the head before any other libraries that you may want to debug.

## Options
Here are the default options
```js
    apiKey: "",
    enabled: true,
    environment: null,
    version: null,
    errorLevel: "debug",
    customPayload: {},
    allowedDomains: [],
    disallowedDomains: [],
    disableIPCapture: false,
    captureUncaught: true
```

They can be set on the simple install like-a-so:
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

Or, on when using it as a project import:

```js
new MothershipLogger({
  apiKey: 'XXXXXXXX', 
  disableIPCapture: true,
  ...
});
```

You can also set individual settings like so:
```js
mothershipLogger.environment = 'production'
mothershipLogger.version = '1.0.3'
```



## Development and Testing

### Build

```sh
yarn build
```
```sh
npm run build
```

### Development

```sh
yarn start
```
```sh
npm run start
```

### Testing

```sh
yarn test
```
```sh
npm run test
```