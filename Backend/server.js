const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

// Temporary product storage
let products = [
    {
        id: 1,
        name: "Sugar",
        category: "Groceries",
        buyingPrice: 120,
        sellingPrice: 150,
        stock: 20,
        restockLevel: 5,
        restockQuantity: 20
    },
    {
        id: 2,
        name: "Rice",
        category: "Groceries",
        buyingPrice: 160,
        sellingPrice: 200,
        stock: 15,
        restockLevel: 5,
        restockQuantity: 15
    }
];

// Home route
app.get("/", (req, res) => {
    res.send("Biashara Hub API is running");
});

// Get all products
app.get("/api/products", (req, res) => {
    res.json(products);
});

// Get one product by ID
app.get("/api/products/:id", (req, res) => {
    const product = products.find(
        (item) => item.id === Number(req.params.id)
    );

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.json(product);
});

// Add a new product
app.post("/api/products", (req, res) => {
    const {
        name,
        category,
        buyingPrice,
        sellingPrice,
        stock,
        restockLevel,
        restockQuantity
    } = req.body;

    if (
        !name?.trim() ||
        !category?.trim() ||
        !Number.isFinite(buyingPrice) ||
        buyingPrice < 0 ||
        !Number.isFinite(sellingPrice) ||
        sellingPrice <= 0 ||
        !Number.isInteger(stock) ||
        stock < 0 ||
        !Number.isInteger(restockLevel) ||
        restockLevel < 0 ||
        !Number.isInteger(restockQuantity) ||
        restockQuantity < 1
    ) {
        return res.status(400).json({
            message: "Please provide valid product details."
        });
    }

    const newProduct = {
        id: Date.now(),
        name: name.trim(),
        category: category.trim(),
        buyingPrice,
        sellingPrice,
        stock,
        restockLevel,
        restockQuantity
    };

    products.push(newProduct);

    res.status(201).json(newProduct);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});