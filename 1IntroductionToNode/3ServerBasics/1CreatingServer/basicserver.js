/* like file read/write operation we need http module. This is it. */

const http=require('http')
http.createServer((req,res)=>{
    res.end('hello from server')

}).listen(3000,()=>{

    console.log('server is listening at port 3000')
})

/* Working mechanism is very simpmle. Every time new request comes at port 3000 the callback function created 
inside the server will be executed */