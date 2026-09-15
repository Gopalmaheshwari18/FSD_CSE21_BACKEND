import exepess from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/Product", (req, res) => {
    const data = fs.readFile("./Product.json", "utf8");
        const Products = JSON.parse(data);
        res.json(Products);
});

app.post("/Product", (req, res) => {
   const data = fs.readFile("./Product.json", "utf8");
    const products = JSON.parse(data);
    const newProduct = {
        id:products.length + 1,
        name: req.body.name,
        price: req.body.price
    }});
    products.push(newProduct);
    fs.writeFile("./Product.json", JSON.stringify(products,null,2));
    

app.listen(4000, () => {
    console.log("Server is running on port  localhost:4000");
});