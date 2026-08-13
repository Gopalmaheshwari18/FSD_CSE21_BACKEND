// const fs = require("fs");

// // CREATE - Create a file
// fs.writeFileSync("student.txt", "Name: Gopal\nRoll No: 12");

// console.log("File created successfully");

// // READ - Read the file
// let data = fs.readFileSync("student.txt", "utf8");

// console.log("\nFile Content:");
// console.log(data);

// // UPDATE - Add new data to the file
// fs.appendFileSync("student.txt", "\nCourse: B.Tech CSE");

// console.log("\nFile updated successfully");



//With pormises


const fs = require("fs/promises");

async function fileOperations() {
  try {
    // CREATE
    await fs.writeFile("student.txt", "Name: Harshit Sharma \nRoll No: 547");
    console.log("File created successfully");

    // READ
    const data = await fs.readFile("student.txt", "utf8");
    console.log("\nFile Content:");
    console.log(data);

    // UPDATE
    await fs.appendFile("student.txt", "\nCourse: B.Tech CSE");
    console.log("\nFile updated successfully");

    // READ AGAIN
    const updatedData = await fs.readFile("student.txt", "utf8");
    console.log("\nUpdated File Content:");
    console.log(updatedData);
  } catch (err) {
    console.error("Error:", err);
  }
}

fileOperations();