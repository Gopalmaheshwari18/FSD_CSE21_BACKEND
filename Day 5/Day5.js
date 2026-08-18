// Understand the concept of fetch in console log
async function test() {
    console.log("This is Asynchronous Function and we want to use fetch function");

    const response = await fetch("./Student.json");
    console.log(response.status);

    const stud = await response.json();
    console.log("Finally data fetched");

    return stud;
}

test()
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
});