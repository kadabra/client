import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import reactive from 'feathers-reactive'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'
import { CookieStorage } from 'cookie-storage'

export function feathersClient(host) {
  const socket = io(host, { transports: ['websocket']})
  return feathers()
    .configure(socketio(socket))
    .configure(auth({ storage: new CookieStorage() }))
    .configure(reactive({idField:'_id'}))
}

export default (host="http://localhost:7777", auth=null) => name => {
  const client = feathersClient(host)
  let endpoint = client.service(name)

  return {
    client,

    // Base methods
    authenticate: () => client.authenticate(),
    logout: () => client.authenticate(),
    
    watch: (params) => endpoint.watch(params),
    
    get: (id, params) => endpoint.get(id, params),
    find: (params) => endpoint.find(params),
    create: (data, params) => endpoint.create(data, params),
    update: (id, data, params) => endpoint.update(id, data, params),
    patch: (id, data, params) => endpoint.patch(id, data, params),
    removeMany: (params) => endpoint.remove(null, params),
    remove: (id, params) => {
      if (id) endpoint.remove(id, params)
      else throw new Error("Falsey id passed to remove(id, params). Use the removeMany(params) if this was your intent, and use it with great caution!") 
    },
  
    // Composite methods
    stream: func => endpoint(name).watch().find().subscribe(func)
  }
}
