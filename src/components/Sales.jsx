function Sales({ onAddSale }) {
    return (
        <section className="sales-page">
            <div className="page-heading">
                <div>
                    <h1>Sales</h1>
                    <p>Record and manage your business sales.</p>
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
               
                <div className="empty-sales">
                    <span className="empty-sales-icon" aria-hidden="true">
                        ↗
                    </span>

                    <h3>No sales recorded yet</h3>

                    <p>
                        Start recording transactions to keep track of your
                        business sales.
                    </p>

                </div>
            </section>
        </section>
    );
}

export default Sales;