# Kadabra Client

Connect to your local kadabra server

`npm i --save @kadabra/client`

### Setup

```js
import client from '@kadabra/client'
let kadabra = client() // connect to local Kadabra server
// OR 
let kadabra = client('foo.com:7777') // connect to other kadabra or feathers server
```

```js
let spellbook = []
kadabra('spells')
  .find({ query: { element: "Fire" } })
  .then(fireSpells => spellbook.concat(fireSpells))
```

Kadabra is built on top of Feathers. Refer to [Feathers Service Methods Documentation](https://docs.feathersjs.com/api/services#service-methods) for the basic API: find, get, create, update, patch, and remove.

Kadabra also leverages [feathers-reactive](https://github.com/feathersjs-ecosystem/feathers-reactive) which uses RxJS to make it much easier to work with realtime events:

```js
let potions = []
let subscription = kadabra('potions')
  .watch() // after watch(), find or get will return observables
  .find()
  .subscribe(pots => { potions = pots }) 
  // full setter will be ran on every re-fetch, keeps `potions` constantly up-to-date with realtime updates
```

This pattern and the `get` version are so common that Kadabra provides these helper methods (params are optional just as with regular watch and find):

```js
kadabra('scrolls')
  .stream(findParams, watchParams)
  .subscribe(scroll => alert('Found ' + scroll)) 
// same as .watch(watchParams).find(findParams) -- a realtime get-all

kadabra('enchantments')
  .streamOne(id, getParams, watchParams)
  .subscribe(ench => console.log(`You're now enchanted with ${ench}`)) 
// same as .watch(watchParams).get(getParams) -- a realtime get-one
```
