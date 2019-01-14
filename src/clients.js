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
  if (!feathers) {
    feathers = feathersClient(host) 
  }
  let endpoint = feathers.service(name)

  return {
    client,

    // Base methods
    authenticate: (params) => client.authenticate(Object.assign({}, params, {strategy: 'local'})),
    logout: () => client.logout(),
    
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
