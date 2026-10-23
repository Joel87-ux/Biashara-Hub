const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ==========================================
// TEMPORARY STORAGE
// ==========================================

let products = [
    {
        id: 1,
        name: "Sugar",
        category: "Groceries",
        buyingPrice: 120,
        sellingPrice: 150,
        stock: 20,
        restockLevel: 5,
        restockQuantity: 20,
    },
    {
        id: 2,
        name: "Rice",
        category: "Groceries",
        buyingPrice: 160,
        sellingPrice: 200,
        stock: 15,
        restockLevel: 5,
        restockQuantity: 15,
    },
];

let sales = [];

let nextProductId = 3;
let nextSaleId = 1;

// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {
    res.send("Biashara Hub API is running");
});

// ==========================================
// PRODUCTS
// ==========================================

// Get all products
app.get("/api/products", (req, res) => {
    res.json(products);
});

// Get one product
app.get("/api/products/:id", (req, res) => {
    const product = products.find(
        (item) => item.id === Number(req.params.id)
    );

    if (!product) {
        return res.status(404).json({
            message: "Product not found.",
        });
    }

    res.json(product);
});

// Add a product
app.post("/api/products", (req, res) => {
    const {
        name,
        category,
        buyingPrice,
        sellingPrice,
        stock,
        restockLevel,
        restockQuantity,
    } = req.body;

    if (
        typeof name !== "string" ||
        !name.trim() ||
        typeof category !== "string" ||
        !category.trim() ||
        typeof buyingPrice !== "number" ||
        !Number.isFinite(buyingPrice) ||
        buyingPrice < 0 ||
        typeof sellingPrice !== "number" ||
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
            message: "Please provide valid product details.",
        });
    }

    const newProduct = {
        id: nextProductId++,
        name: name.trim(),
        category: category.trim(),
        buyingPrice,
        sellingPrice,
        stock,
        restockLevel,
        restockQuantity,
    };

    products.push(newProduct);

    res.status(201).json(newProduct);
});

// ==========================================
// SALES HISTORY
// ==========================================

// Get all recorded sales
app.get("/api/sales", (req, res) => {
    res.json(
        [...sales].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        )
    );
});

// Get one sale
app.get("/api/sales/:id", (req, res) => {
    const sale = sales.find(
        (item) => item.id === Number(req.params.id)
    );

    if (!sale) {
        return res.status(404).json({
            message: "Sale not found.",
        });
    }

    res.json(sale);
});

// ==========================================
// RECORD A SALE
// ==========================================

app.post("/api/sales", (req, res) => {
    const {
        items,
        paymentMethod,
        customerName = "",
        customerPhone = "",
    } = req.body;

    // Validate sale items
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            message: "Please select at least one product.",
        });
    }

    // Validate payment method
    const validPaymentMethods = ["Cash", "M-Pesa", "Credit"];

    if (!validPaymentMethods.includes(paymentMethod)) {
        return res.status(400).json({
            message: "Please select a valid payment method.",
        });
    }

    // Credit sales require customer details
    if (
        paymentMethod === "Credit" &&
        (
            typeof customerName !== "string" ||
            !customerName.trim() ||
            typeof customerPhone !== "string" ||
            !customerPhone.trim()
        )
    ) {
        return res.status(400).json({
            message:
                "Customer name and phone number are required for credit sales.",
        });
    }

    // Validate product IDs and quantities.
    // Combine duplicate product selections before checking stock.
    const requestedQuantities = new Map();

    for (const item of items) {
        const productId = Number(item.productId);
        const quantity = Number(item.quantity);

        if (
            !Number.isInteger(productId) ||
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {
            return res.status(400).json({
                message: "Invalid product or quantity.",
            });
        }

        const product = products.find(
            (product) => product.id === productId
        );

        if (!product) {
            return res.status(400).json({
                message: `Product ID ${productId} was not found.`,
            });
        }

        const previousQuantity =
            requestedQuantities.get(productId) || 0;

        requestedQuantities.set(
            productId,
            previousQuantity + quantity
        );
    }

    // Check stock for every product BEFORE changing anything.
    for (const [productId, quantity] of requestedQuantities) {
        const product = products.find(
            (item) => item.id === productId
        );

        if (quantity > product.stock) {
            return res.status(400).json({
                message:
                    `Not enough stock for ${product.name}. ` +
                    `Available: ${product.stock}.`,
            });
        }
    }

    // Calculate sale items using prices stored on the backend.
    const saleItems = [];

    for (const [productId, quantity] of requestedQuantities) {
        const product = products.find(
            (item) => item.id === productId
        );

        saleItems.push({
            productId: product.id,
            productName: product.name,
            quantity,
            unitPrice: product.sellingPrice,
            subtotal: product.sellingPrice * quantity,
        });
    }

    const total = saleItems.reduce(
        (sum, item) => sum + item.subtotal,
        0
    );

    // Create the transaction.
    const newSale = {
        id: nextSaleId++,
        date: new Date().toISOString(),
        items: saleItems,
        total,
        paymentMethod,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        status: paymentMethod === "Credit" ? "Unpaid" : "Paid",
    };

    // Deduct stock only after all validation succeeds.
    for (const [productId, quantity] of requestedQuantities) {
        const product = products.find(
            (item) => item.id === productId
        );

        product.stock -= quantity;
    }

    // Store the transaction.
    sales.push(newSale);

    // Return the saved sale and updated products.
    res.status(201).json({
        message: "Sale recorded successfully.",
        sale: newSale,
        products,
    });
});

// ==========================================
// ERROR HANDLING
// ==========================================

app.use((err, req, res, next) => {
    console.error("Backend error:", err);

    res.status(500).json({
        message: "An unexpected server error occurred.",
    });
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
    console.log(
        `Biashara Hub API running at http://localhost:${PORT}`
    );
});