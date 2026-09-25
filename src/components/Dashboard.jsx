import { useEffect, useState } from "react";

function Dashboard({ sales, expenses, profit }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/products")
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
            });
    }, []);

    const lowStock = products.filter(
        (product) => product.stock <= product.restockLevel && product.stock > 0
    );

    const outOfStock = products.filter(
        (product) => product.stock === 0
    );

    return (
        <main>
            <h1>Dashboard</h1>

            <h2>Good afternoon 👋</h2>
            <p>Here's how your business is doing today.</p>

            <section>
                <h3>Today's Sales</h3>
                <p>KSh {sales}</p>
            </section>

            <section>
                <h3>Today's Expenses</h3>
                <p>KSh {expenses}</p>
            </section>

            <section>
                <h3>Estimated Profit</h3>
                <p>KSh {profit}</p>
            </section>

            <section>
                <h3>Stock Overview</h3>

                <p>Total Products: {products.length}</p>

                <h4>Products Requiring Restocking</h4>

                {lowStock.length > 0 ? (
                    <ul>
                        {lowStock.map((product) => (
                            <li key={product.id}>
                                {product.name} — {product.stock} left
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No products currently require restocking.</p>
                )}

                <h4>Out of Stock</h4>

                {outOfStock.length > 0 ? (
                    <ul>
                        {outOfStock.map((product) => (
                            <li key={product.id}>
                                {product.name} — Out of stock
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No products are out of stock.</p>
                )}
            </section>
        </main>
    );
}
 
export default Dashboard;

