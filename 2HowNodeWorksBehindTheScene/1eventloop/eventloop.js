/*Node is single thread program execution which have event loop. Inside the event loop all the callbacks are placed
If the task is very heavy then this event loop can take help of ohter threads provided by libuv. We can use upto 128
additional thread  along with our single main thread provided by node js.


How node executes perticular program?
                                    First top level codes are executed ie. code that does not have callback function.
                                    Then the modules are executed and lastly the code with callbacks are executed where
                                    all the callbacks are placed inside the web API.


How web API works?
                    Web API is background where all the async code runs so that it does not block rest of code.
                    
                    
   What is event loop?
   As we know the programm execution pattern. When code comes it is pushed into the stack. If the code in the
   stack is top level then it is executed first but if the code is async one then it is pushed into the Web API.
   After the asycn code is web api is fully processed it is then pushed in the queue. Now is there is no more
   top level code in the stack then the event loop comes into the play. It simply extract the task from queue 
   and push into the stack.

    Event loop has certain pattern to push task from queue to stack as below.
                    . First comes the timer function like setTimeout() and then comes the I/O like file read
                    write and then commes the setimmediate() callbacks and finally comes the close callbacks like
                    closing server or closing file read operation.



                    
*/

//Top level code
console.log("first event loop");
//set time out is funciton which makes it top level code
setTimeout(() => {
  setTimeout(() => {
    console.log(
      "this code is now inside the callback so event loop rules will apply"
    );
  });
  console.log(
    "this is not inside the callback so it also becomes top level code."
  );
});

//i/o module
require("fs").readFile(`${__dirname}/file.txt`, "utf8", (err, data) => {
  /*Event loop work for callback function. Since reading file has callback function
    so the rules of callback processing in event loop will be applied. */
  console.log(data);
  setTimeout(() => {
    console.log("  javascript timer 1 function");
  }, 0);
  setImmediate(() => {
    console.log("immediate code");
  });

  setTimeout(() => {
    console.log("  javascript timer 2 function");
  }, 0);
  console.log("Hello event loop");
});
