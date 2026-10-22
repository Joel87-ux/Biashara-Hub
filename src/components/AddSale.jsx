import { useEffect, useState } from "react";

function Sales({ onAddSale }) {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchSales() {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/sales"
                );

                if (!response.ok) {
                    throw new Error("Could not load sales history.");
                }

                const data = await response.json();
                setSales(data);
            } catch {
                setError(
                    "Unable to load sales. Check that your backend is running."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchSales();
    }, []);

    function formatMoney(amount) {
        return `KSh ${Number(amount).toLocaleString("en-KE")}`;
    }

    function formatDate(date) {
        return new Date(date).toLocaleString("en-KE", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    }

    return (
        <section className="sales-page">
            <div className="page-heading">
                <div>
                    <h1>Sales</h1>
                    <p>Record transactions and track your sales history.</p>
                </div>

                <button
                    type="button"
                    className="add-sale-button"
                    onClick={onAddSale}
                >
                    + Add Sale
                </button>
            </div>

            <section className="sales-card">
                <h2>Sales History</h2>
                <p>Review your recorded transactions.</p>

                {loading ? (
                    <p>Loading sales...</p>
                ) : error ? (
                    <p role="alert" className="sale-error">
                        {error}
                    </p>
                ) : sales.length === 0 ? (
                    <div className="empty-sales">
                        <h3>No sales recorded yet</h3>
                        <p>
                            Your completed transactions will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="sales-history-list">
                        {sales.map((sale) => (
                            <article
                                className="sale-history-item"
                                key={sale.id}
                            >
                                <div className="sale-history-header">
                                    <div>
                                        <h3>Sale #{sale.id}</h3>
                                        <p>{formatDate(sale.date)}</p>
                                    </div>

                                    <strong className="sale-history-total">
                                        {formatMoney(sale.total)}
                                    </strong>
                                </div>

                                <div className="sale-history-details">
                                    <p>
                                        <strong>Payment:</strong>{" "}
                                        {sale.paymentMethod}
                                    </p>

                                    <p>
                                        <strong>Status:</strong>{" "}
                                        {sale.status}
                                    </p>

                                    {sale.paymentMethod === "Credit" && (
                                        <>
                                            <p>
                                                <strong>Customer:</strong>{" "}
                                                {sale.customerName}
                                            </p>

                                            <p>
                                                <strong>Phone:</strong>{" "}
                                                {sale.customerPhone}
                                            </p>
                                        </>
                                    )}
                                </div>

                                <div className="sale-history-products">
                                    <h4>Items Sold</h4>

                                    {sale.items.map((item, index) => (
                                        <div
                                            className="sale-history-product"
                                            key={`${sale.id}-${item.productId}-${index}`}
                                        >
                                            <span>
                                                {item.productName} ×{" "}
                                                {item.quantity}
                                            </span>

                                            <span>
                                                {formatMoney(item.subtotal)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </section>
    );
}

export default Sales;