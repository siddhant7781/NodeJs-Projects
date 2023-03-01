const EventEmitter = require('events');

const myEmitter = new EventEmitter();

myEmitter.on("newSlale", () => {
    console.log("There was a new sale");
})

myEmitter.on("newSlale", () => {
    console.log("customer name : Siddhant");
})

myEmitter.emit("newSale");