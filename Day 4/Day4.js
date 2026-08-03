// create one promise that will disply username and password
// using resove and if data will be rejected it display error
// Create a single Promise

// CHATGPT : 
 const loginPromise = new Promise((resolve, reject) => {
    let username = "Gopal";
    let password = "12345";

    // Check if username and password are correct
    if (username === "Gopal" && password === "12345") {
        resolve({
            username: username,
            password: password
        });
    } else {
        reject("Error: Invalid username or password!");
    }
});

// Consume the Promise
loginPromise
    .then((data) => {
        console.log("Login Successful!");
        console.log("Username:", data.username);
        console.log("Password:", data.password);
    })
    .catch((error) => {
        console.log(error);
    });

new Promise((resolve,reject)=>{
    setTimeout(()=>{

        let err = false;

        if(!err){
            resolve("user: GOPAL,password:12345");
        }else{
            reject("ERROR...:data fail");
        }
    },2000)
    
}).then((result)=>{
    console.log(result);
}).catch(()=>{
    console.log(error);
})

Aync /await
console.log("this is async and await");
async function test(){
     console.log("1");
    await  console.log("2");
     console.log("3");
     console.log("4");

}
test().then(res)