Synchronous code are those which must be executed no matter what time they take to complete, thus
ohter part of code needs to wait because node is single threaded. Earlier in file read write 
we have used Synchronous way.



                            There is another way which is called async way. The main idea is it accepts
a callback function which will only be called once the task such as reading or writing is done in the background.
e.g fs.readFile(filepath,encoding,callbackfunction)