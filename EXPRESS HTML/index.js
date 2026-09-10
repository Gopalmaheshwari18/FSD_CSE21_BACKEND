import express from "express";
import fs from "fs";

const app = express();
const PORT = 8000;

app.get("/", (req, res) => {
    fs.readFile("./Pages/home.html", "utf8", (err, data) => {
        if (err) {
            res.status(500).send("Error reading the HTML file");
            return;
        } else {
            res.send(data);
        }
    });
});

app.get("/about", (req, res) => {
    fs.readFile("./Pages/about.html", "utf8", (err, data) => {
        if (err) {
            res.status(500).send("Error reading the HTML file");
            return;
        } else {
            res.send(data);
        }
    });
});

app.get("/contact", (req, res) => {
    fs.readFile("./Pages/contact.html", "utf8", (err, data) => {
        if (err) {
            res.status(500).send("Error reading the HTML file");
            return;
        } else {
            res.send(data);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
