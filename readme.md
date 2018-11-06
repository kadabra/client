# Kadabra Client

A Feathers Client wired to connect to your local kadabra server

`npm i --save @kadabra/client`

```js
import kadabra from '@kadabra/client'

kadabra.endpoint('foo').create({ bar: "baz" })
```

Also includes Vue plugin to bind client.endpoint to `vm.$K` (for Kadabra):

```js
import Vue from 'vue'
import kadabra from '@kadabra/client'

Vue.use(kadabra)
```

Then in a Vue component:

```js
export default {
  data: () => ({
    endpoints: [], // Prime the data object
  }),
  mounted() {
    // Alias 'this' to use inside inner function
    let component = this 
    this.$K('endpoints')  // Connect to 'endpoints' endpoint
      .find()             // Get all records
      .then(response => { // Then save data to our local state
        component.endpoints = response.data 
      })
  }
}
```

For real-time in a Vue component:

```js
export default {
  data: () => ({
    endpoints: [], // Prime the data object
  }),
  mounted() {
    let component = this 
    this.$K('endpoints')
      .watch() // Creates the watcher for realtime updates
      .find()
      .then(response => {
        component.endpoints = response.data 
      })
  }
}
```
