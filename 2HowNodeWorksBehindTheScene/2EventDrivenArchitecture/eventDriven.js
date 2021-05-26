/*we have node's events module from which we can make our own event object which is also called
custom event. Whenever you see .on() it indicates it is listening to event. For inbuild module
like http we dont need to emit event name but for custom we need to emit the event manually. */


// custom event.

const event=require('events');
const customEvent=new event();
//2 listen for the event

customEvent.on('programming',()=>{
    console.log("programming is fun love")
})
customEvent.on('backend',()=>{
    console.log("backend is also fun love")
})

customEvent.on('arguments',(name)=>{
    console.log(`hello ${name}`)
})
// 1 emit the event
customEvent.emit('programming')
customEvent.emit('backend')
customEvent.emit('arguments','kunal')

//we can reuse same event object to emmit different event.

//we can also pass arguments 

/* In  build events just needs to listen no need to emmit. Note custom event name wont work for in build modules 
e.g 
const server=require('http').createServer();
server.on('hack',(req,res)=>{
    res.end('happy hacking')
}).listen(3000)

customEvent.emit('hack')
*/

const server=require('http').createServer();
server.on('request',(req,res)=>{
    res.end('happy hacking')
}).listen(3000)

// 'close' is http's inbuild named event not the custom one. Custom one wont work as I know.
server.on('close',(req,res)=>{
    console.log('server closed')
})
server.emit('close')