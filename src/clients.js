import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import reactive from 'feathers-reactive'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'
import { CookieStorage } from 'cookie-storage'

const hostname = window ? window.location.hostname : 'localhost' // SSR has no window object 

export const feathersClient = (host=`${hostname}:7777`) => {
  const socket = io(host, { transports: ['websocket']})
  return feathers()
    .configure(socketio(socket))
    .configure(auth({ storage: new CookieStorage() }))
    .configure(reactive({idField:'_id'}))
}

export const kadabraClient = ({ host=`${hostname}:7777`, feathers=null}) => (name='') => {
  const client = feathers || feathersClient(host) 

  return {
    client,

    // Base methods
    authenticate: (params) => {
      if (params) {
        params = Object.assign({}, params, {strategy: 'local'})
        return client.authenticate(params)
      } else {
        return client.authenticate()
      }
    },
    logout: () => client.logout(),
    
    watch: (params) => client.service(name).watch(params),
    
    get: (id, params) => client.service(name).get(id, params),
    find: (params) => client.service(name).find(params),
    create: (data, params) => client.service(name).create(data, params),
    update: (id, data, params) => client.service(name).update(id, data, params),
    patch: (id, data, params) => client.service(name).patch(id, data, params),
    removeMany: (params) => client.service(name).remove(null, params),
    remove: (id, params) => {
      if (id) client.service(name).remove(id, params)
      else throw new Error("Falsey id passed to remove(id, params). Use the removeMany(params) if this was your intent, and use it with great caution!") 
    },
  
    // Composite methods
    stream: func => client.service(name).watch().find().subscribe(func)
  }
}
