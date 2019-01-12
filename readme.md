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
let spellbook = []
kadabra('spells')
  .find({ query: { element: "Fire" } })
  .then(fireSpells => spellbook.concat(fireSpells))
```

## API

Kadabra is built on top of Feathers. Refer to [Feathers Service Methods Documentation](https://docs.feathersjs.com/api/services#service-methods) for further detail if needed, but in most cases this is enough without reading it:

```js
get(id)
find() // "get many"; see feathers docs for how to query
create(obj) 
remove(id)
update(id, obj) // replace current object
patch(id, obj) // merge into current object
```

Kadabra also leverages [feathers-reactive](https://github.com/feathersjs-ecosystem/feathers-reactive) and [feathers authentication client](https://github.com/feathersjs-ecosystem/feathers-reactive) to add:

```js
watch(params) // see feathers-reactive or see below
authenticate() // Call once to (re)authenticate
login({ email: 'foo', password: 'bar' })
```

We've also added:

```js
removeMany(params)
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

> **Note** - The `subscription` object has a `.unsubscribe()` method to cancel that subscription!