//promises : object 
//  A Promise is an object that represents the eventual completion (success) or failure of an asynchronous operation.
//promise way 1 
const promiseOne = new Promise((resolve,reject) => {
    console.log("promise done ");
    resolve("operation successful");
    let success = true;

    if (success) {
        resolve("Operation Successful");
    } else {
        reject("Operation Failed");
    }

    
})  
promiseOne.then((result)=>{
    console.log(result);
}).catch((error)=>{
    console.log(error);
})