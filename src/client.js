import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import reactive from 'feathers-reactive'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'
import { CookieStorage } from 'cookie-storage'

const socket = io('http://localhost:7777', {transports: ['websocket']})

const feathersClient = feathers()
  .configure(socketio(socket))
  .configure(auth({ storage: new CookieStorage() }))
  .configure(reactive({idField:'_id'}))

feathersClient.endpoint = feathersClient.service

feathersClient.install = (Vue) => {
  Vue.prototype.$K = feathersClient.endpoint
} 

export default feathersClient
