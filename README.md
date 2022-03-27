## Quick Start

### Send custom event to GA
```js
import north from 'pathTo/config/north.config';

/*
 @param {string} eventname
 @param {object} more desc value
*/
north.sendEvent('north_test', {
  "author":"Bill Q",
  "title":"How to Build a Backpack",
  "number_of_pages":2,
});
```

### Set Sentry Tag
```js
import north from 'pathTo/config/north.config';

/*
 @param {string} tag name
 @param {string | number | boolean} tag value
*/
north.setTag('chainId', chainId);
```
