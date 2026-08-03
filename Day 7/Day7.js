// Simulate DOM-like event handling in Node.js using events
//Buttons : click and mouseover events 

const eventEmitter = require("events");

class Button extends EventEmiter{

    click(){
        console.log("call button click event");
        this.emit("click");
    }

    mouseover(){
        console.log("/n call button mouseover event");
        this.emit("mouseover");
    }


}
const button=new Button();
button.on("click", ()=>{
    console.log("Button clicked!");


})

// Visualize the Event Loop using
// process.nextTick(), setTimeout(), and setImmediate()

console.log("1. Start");

process.nextTick(() => {
    console.log("2. process.nextTick()");
});

setTimeout(() => {
    console.log("3. setTimeout() - 0ms");
}, 0);

setImmediate(() => {
    console.log("4. setImmediate()");
});

console.log("5. End");