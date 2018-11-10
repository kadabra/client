import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import reactive from 'feathers-reactive'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'
import { CookieStorage } from 'cookie-storage'

export default (name, host="http://localhost:7777") => {
  const socket = io(host, {transports: ['websocket']})

  const client = feathers()
    .configure(socketio(socket))
    .configure(auth({ storage: new CookieStorage() }))
    .configure(reactive({idField:'_id'}))

  let endpoint = client.service(name)
  return {
    client,
    
    // Primitives
    watch(params) { return endpoint.watch(params) },
    find(params) { return endpoint.find(params) },
    get(id, params) { return endpoint.get(id, params) },
    create(data, params) { return endpoint.create(data, params) },
    update(id, data, params) { return endpoint.update(id, data, params) },
    patch(id, data, params) { return endpoint.patch(id, data, params) },
    remove(id, params) { return endpoint.remove(id, params) },
  
    // Macros
    stream(findParams={}, watchParams={}) { return await endpoint(name).watch(watchParams).find(findParams) },
    streamOne(id, getParams={}, watchParams={}) { return await endpoint(name).watch(watchParams).get(id, getParams) },
  }
}
