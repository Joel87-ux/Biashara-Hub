import { useEffect, useState } from "react";

function Dashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://localhost:3000/api/products")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load products");
                }

                return response.json();
            })
            .then((data) => {
                setProducts(data);
            })
            .catch((error) => {
                console.error(error);
                setError("Could not load inventory information.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const lowStock = products.filter(
        (product) =>
            product.stock > 0 &&
            product.stock <= product.restockLevel
    );

    const outOfStock = products.filter(
        (product) => product.stock === 0
    );

    return (
        <main className="dashboard">
            <div className="dashboard-heading">
                <div>
                    <h1>Dashboard</h1> <br />
                    <p>Here's a quick overview of your business.</p>
                </div>
            </div>

            <section className="dashboard-grid">
                <article className="dashboard-card">
                    <p>Total Products</p>
                    <h2>{loading ? "..." : products.length}</h2>
                    <span>Products in inventory</span>
                </article>

                <article className="dashboard-card">
                    <p>Low Stock</p>
                    <h2>{loading ? "..." : lowStock.length}</h2>
                    <span>Products needing restocking</span>
                </article>

                <article className="dashboard-card">
                    <p>Out of Stock</p>
                    <h2>{loading ? "..." : outOfStock.length}</h2>
                    <span>Products unavailable</span>
                </article>

                <article className="dashboard-card">
                    <p>Inventory Status</p>
                    <h2>
                        {loading
                            ? "..."
                            : outOfStock.length === 0 &&
                                lowStock.length === 0
                                ? "Good"
                                : "Attention"}
                    </h2>
                    <span>Based on current stock levels</span>
                </article>
            </section>

            <section className="dashboard-section">
                <h2>Business Alerts</h2>

                {loading && <p>Loading inventory information...</p>}

                {error && <p>{error}</p>}

                {!loading && !error && (
                    <>
                        {outOfStock.length === 0 && lowStock.length === 0 ? (
                            <p>All products are sufficiently stocked.</p>
                        ) : (
                            <ul className="alert-list">
                                {outOfStock.map((product) => (
                                    <li key={product.id}>
                                        <strong>{product.name}</strong>
                                        {" "}is out of stock.
                                    </li>
                                ))}

                                {lowStock.map((product) => (
                                    <li key={product.id}>
                                        <strong>{product.name}</strong>
                                        {" "}has only {product.stock} units left.
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </section>
        </main>
    );
}

export default Dashboard;