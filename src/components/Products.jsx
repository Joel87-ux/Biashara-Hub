import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api/products";

function Products() {
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const emptyForm = {
        name: "",
        category: "",
        buyingPrice: "",
        sellingPrice: "",
        stock: "",
        restockLevel: "",
        restockQuantity: "",
    };

    const [form, setForm] = useState(emptyForm);

    // Format prices to two decimal places
    function formatPrice(amount) {
        return `KSh ${Number(amount).toLocaleString("en-KE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }

    // Load products from the backend
    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error("Failed to load products.");
                }

                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error(error);
                setError(
                    "Could not load products. Check that the backend is running."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    // Handle form input changes
    function handleChange(event) {
        const { name, value } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    }

    // Add a new product
    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSaving(true);

        const newProduct = {
            name: form.name.trim(),
            category: form.category,
            buyingPrice: Number(form.buyingPrice),
            sellingPrice: Number(form.sellingPrice),
            stock: Number(form.stock),
            restockLevel: Number(form.restockLevel),
            restockQuantity: Number(form.restockQuantity),
        };

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newProduct),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to add product."
                );
            }

            setProducts((currentProducts) => [
                ...currentProducts,
                data,
            ]);

            setForm(emptyForm);
            setShowForm(false);
        } catch (error) {
            console.error(error);
            setError(error.message || "Could not add product.");
        } finally {
            setSaving(false);
        }
    }

    // Determine stock status
    function getStockStatus(product) {
        if (product.stock === 0) {
            return "Out of Stock";
        }

        if (product.stock <= product.restockLevel) {
            return "Low Stock";
        }

        return "In Stock";
    }

    return (
        <main className="products-page">
            <header className="page-header">
                <div>
                    <h1>Products</h1>
                    <p>Manage your inventory, prices, and stock levels.</p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setError("");
                        setShowForm(true);
                    }}
                >
                    + Add Product
                </button>
            </header>

            {error && (
                <p role="alert" className="product-error">
                    {error}
                </p>
            )}

            <section className="product-list">
                <h2>Your Products</h2>

                {loading ? (
                    <p>Loading products...</p>
                ) : products.length === 0 ? (
                    <p>No products available. Add your first product.</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Buying Price</th>
                                    <th>Selling Price</th>
                                    <th>Profit / Unit</th>
                                    <th>Current Stock</th>
                                    <th>Stock Value</th>
                                    <th>Restock Level</th>
                                    <th>Restock Quantity</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.map((product) => {
                                    const profit =
                                        product.sellingPrice -
                                        product.buyingPrice;

                                    const stockValue =
                                        product.stock *
                                        product.buyingPrice;

                                    const status = getStockStatus(product);

                                    return (
                                        <tr key={product.id}>
                                            <td>{product.name}</td>
                                            <td>{product.category}</td>
                                            <td>
                                                {formatPrice(product.buyingPrice)}
                                            </td>
                                            <td>
                                                {formatPrice(product.sellingPrice)}
                                            </td>
                                            <td>
                                                {formatPrice(profit)}
                                            </td>
                                            <td>{product.stock}</td>
                                            <td>
                                                {formatPrice(stockValue)}
                                            </td>
                                            <td>{product.restockLevel}</td>
                                            <td>{product.restockQuantity}</td>
                                            <td>
                                                <span
                                                    className={`stock-status ${status
                                                        .toLowerCase()
                                                        .replaceAll(" ", "-")}`}
                                                >
                                                    {status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {showForm && (
                <div
                    className="modal-overlay"
                    onClick={() => {
                        if (!saving) setShowForm(false);
                    }}
                >
                    <section
                        className="product-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="add-product-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <header className="modal-header">
                            <div>
                                <h2 id="add-product-title">
                                    Add New Product
                                </h2>
                                <p>Enter the product details below.</p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                aria-label="Close form"
                                disabled={saving}
                            >
                                ✕
                            </button>
                        </header>

                        <form onSubmit={handleSubmit}>
                            <label>
                                Product Name
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Sugar"
                                    required
                                />
                            </label>

                            <label>
                                Category
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Select a category
                                    </option>
                                    <option value="Groceries">Groceries</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Automotive">Automotive</option>
                                    <option value="Furniture">Furniture</option>
                                    <option value="Beauty & Personal Care">
                                        Beauty & Personal Care
                                    </option>
                                    <option value="Hardware & Construction">
                                        Hardware & Construction
                                    </option>
                                    <option value="Household Items">
                                        Household Items
                                    </option>
                                    <option value="Food & Beverages">
                                        Food & Beverages
                                    </option>
                                    <option value="Stationery">Stationery</option>
                                    <option value="Other">Other</option>
                                </select>
                            </label>

                            <label>
                                Buying Price (KSh)
                                <input
                                    type="number"
                                    name="buyingPrice"
                                    value={form.buyingPrice}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    required
                                />
                            </label>

                            <label>
                                Selling Price (KSh)
                                <input
                                    type="number"
                                    name="sellingPrice"
                                    value={form.sellingPrice}
                                    onChange={handleChange}
                                    min="0.01"
                                    step="0.01"
                                    placeholder="0.00"
                                    required
                                />
                            </label>

                            <label>
                                Current Stock
                                <input
                                    type="number"
                                    name="stock"
                                    value={form.stock}
                                    onChange={handleChange}
                                    min="0"
                                    step="1"
                                    placeholder="0"
                                    required
                                />
                            </label>

                            <label>
                                Restock Level
                                <input
                                    type="number"
                                    name="restockLevel"
                                    value={form.restockLevel}
                                    onChange={handleChange}
                                    min="0"
                                    step="1"
                                    placeholder="0"
                                    required
                                />
                            </label>

                            <label>
                                Restock Quantity
                                <input
                                    type="number"
                                    name="restockQuantity"
                                    value={form.restockQuantity}
                                    onChange={handleChange}
                                    min="1"
                                    step="1"
                                    placeholder="0"
                                    required
                                />
                            </label>

                            <footer className="modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                >
                                    {saving ? "Saving..." : "Save Product"}
                                </button>
                            </footer>
                        </form>
                    </section>
                </div>
            )}
        </main>
    );
}

export default Products;