import { useEffect, useState } from "react";

function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/products")
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
            });
    }, []);

    return (
        <main>
            <h1>Products</h1>

            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <h2>{product.name}</h2>
                        <p>Selling Price: KSh {product.sellingPrice}</p>
                        <p>Stock: {product.stock}</p>
                    </li>
                ))}
            </ul>
        </main>
    );
}

export default Products;

