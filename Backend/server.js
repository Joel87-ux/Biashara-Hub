const express = require("express");

const app = express();

app.use(express.json());

const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Biashara Hub API is running");
});

app.get("/api/products",(req, res) => {
    const products = [
        {
            id:1,
            name: "sugar",
            sellingPrice: 150,
            stock: 20,
            restockLevel: 10
        },
        {
            id:2,
            name: "Rice",
            sellingPrice: 200,
            stock: 15,
            restockLevel: 5
        }
    ];
    res.json(products);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
