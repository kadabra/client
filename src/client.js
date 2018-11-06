import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import reactive from 'feathers-reactive'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'
import { CookieStorage } from 'cookie-storage'

const socket = io('http://localhost:7777', {transports: ['websocket']})

const kadabra = feathers()
  .configure(socketio(socket))
  .configure(auth({ storage: new CookieStorage() }))
  .configure(reactive({idField:'_id'}))

kadabra.endpoint = kadabra.service

kadabra.install = (Vue) => {
  Vue.prototype.$K = name => kadabra.endpoint(name)
} 

export default kadabra
