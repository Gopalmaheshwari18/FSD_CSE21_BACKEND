// Perform CRUD

import fs from "fs/promises";

const fileName = "student.txt";

// CREATE
async function createFile() {
    try {
        await fs.writeFile(
            fileName,
            "Name: Gopal\nEmail: gopalbirla181@gmail.com\n",
            "utf-8"
        );

        console.log("File created successfully...");
    } catch (err) {
        console.log("Error:", err.message);
    }
}

// READ
async function readFile() {
    try {
        const data = await fs.readFile(fileName, "utf-8");

        console.log("File content:");
        console.log(data);
    } catch (err) {
        console.log("Error:", err.message);
    }
}

// UPDATE
async function updateFile() {
    try {
        await fs.appendFile(
            fileName,
            "Course: B.Tech CSE\n",
            "utf-8"
        );

        console.log("File updated successfully...");
    } catch (err) {
        console.log("Error:", err.message);
    }
}

// DELETE
async function deleteFile() {
    try {
        await fs.unlink(fileName);

        console.log("File deleted successfully...");
    } catch (err) {
        console.log("Error:", err.message);
    }
}

// MAIN
async function main() {
    await createFile();
    await readFile();
    await updateFile();
    await readFile();
    await deleteFile();
}

main();