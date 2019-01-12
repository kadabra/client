# Kadabra Client

Connect to a kadabra server.

`npm i --save @kadabra/client`

## Setup

```js
import client from '@kadabra/client'
let kadabra = client() // connect to local Kadabra server
// OR 
let kadabra = client('foo.com:7777') // connect to other kadabra or feathers server
```

#### Quick Example

```js
kadabra().authenticate({ email: "merlin@camelot", password: "Xcal!ber" })

let spellbook = []
kadabra('spells')
  .find({ query: { element: "Fire" } })
  .then(fireSpells => spellbook.concat(fireSpells))

kadabra().logout()
```

## API

Kadabra is built on top of Feathers. Refer to [Feathers Service Methods Documentation](https://docs.feathersjs.com/api/services#service-methods) for further detail if needed, but in most cases this is enough without reading it:

```js
get(id)
find() // "get many"; see feathers docs for how to query
create(obj) 
remove(id) // Note that id is now required. use removeMany(params) to remove many records
update(id, obj) // replace current object
patch(id, obj)  // merge into current object
```

Kadabra also leverages [feathers-reactive](https://github.com/feathersjs-ecosystem/feathers-reactive) and [feathers authentication client](https://github.com/feathersjs-ecosystem/feathers-reactive) to add:

```js
watch() // see feathers-reactive or see below
authenticate({ email: 'foo', password: 'bar' }) // Call once to (re)authenticate
logout()
```

## Realtime Example

```js
let potions = []
let subscription = kadabra('potions')
  .watch() // after watch(), find and get return observables you subscribe to
  .find()
  .subscribe(pots => { potions = pots }) // this will be re-ran every update
```

This pattern is so common that we provide this helper methods:

```js
let subscription = kadabra('scrolls')
  .stream(scroll => alert('Found ' + scroll))
```

> **Note** - The `subscription` object has an `.unsubscribe()` method to cancel that subscription! 