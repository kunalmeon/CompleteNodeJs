/* Instead of waiting for once promise to complete we can wait and execute all promise at once
using Proimise.all() method. Let us take an example */

function promiseOne(name) {
  return new Promise((resolve, reject) => {
    if (name === "") reject("no name");
    resolve(name);
  });
}

function promiseTwo(address) {
  return new Promise((resolve, reject) => {
    if (address === "") reject("no address");
    resolve(address);
  });
}

function promiseThree(profession) {
  return new Promise((resolve, reject) => {
    if (profession === "") reject("no profession");
    resolve(profession);
  });
}

async function writing(filepath, data) {
  return new Promise((resolve, reject) => {
    require("fs").writeFile(filepath, data, (err) => {
      if (err) reject("error while writing");
      resolve("successfully written");
    });
  });
};

async function mainFunction() {
  const promise1 = promiseOne("kunal");
  const promise2 = promiseTwo("mahendranagar");
  const promise3 = promiseThree("data scientist");

  try {
    const promiseGrouping = await Promise.all([promise1, promise2, promise3]);

    let totalInfo = promiseGrouping.map((promise) => {
      return promise;
    });
    console.log(totalInfo);
    //total info in now [ 'kunal', 'mahendranagar', 'data scientist' ] so let us conver it into string
    let totalInfoToString = totalInfo.join("\n");
    console.log(totalInfoToString);
    await writing(`${__dirname}/allPromiseData.txt`,totalInfoToString)
  } catch (error) {
    console.log(error);
    throw "main function failed";
  }

  return 'chapter closed'
}
(async()=>{
   const returnedValue= await mainFunction()
   console.log(returnedValue)
})()

/*Summary: WE can wait for the result of all promises using await Promise.all([]). Make sure the argument inside of
it returns the promise as we have made many function which all returns the promise. Note: After using the all() method
we can furter use await as per need. Happy Coding Love.  */