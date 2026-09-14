//EventEmitter is classs 
//emit("event param"): trigger/create/fire and on ("event emit parameter",callback function ):listener that register

// const { emit } = require("cluster");
const EventEmitter = require("events");
const event = new EventEmitter();
event.on("greet",()=>{
        console.log("this is event emitter");
})
event.once("greet",()=>{
    console.log("call event once only")
})
event.emit("greet");
event.emit("greet");
event.once("greet");
event.once("greet");

// create a custom eventEmitter that triggers "greet " or "exit"
// create DOM-like event handling in Node.js using events

class myEmitter extends EventEmitter{}
const event = new myEmitter()
event.on("greet",(msg)=>{

    console.log('hello ${msg}');         // Template literals : `${var}

})

event.on("exit",()=>{
    console.log("exits myEmitter application....");
})

event.emit("exit")
event.emit("greet", "CSE 21 this is FSD class");
event.emit("exit")