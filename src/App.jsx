import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import Sales from "./components/Sales";
import Expenses from "./components/Expenses";
import Customers from "./components/Customers";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import "./App.css";

function App() {
  const [page, setPage] = useState("dashboard");

  const navigation = [
    { id: "dashboard", label: "Dashboard" },
    { id: "products", label: "Products" },
    { id: "sales", label: "Sales" },
    { id: "expenses", label: "Expenses" },
    { id: "customers", label: "Customers" },
    { id: "reports", label: "Reports" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="app">
      <header className="app-header">
        <h2>Biashara Hub</h2>

        <nav className="main-navigation">
          {navigation.map((item) => (
            <button
              key={item.id}
              type="button"
              className={
                page === item.id ? "nav-button active" : "nav-button"
              }
              onClick={() => setPage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="page-content">
        {page === "dashboard" && <Dashboard />}
        {page === "products" && <Products />}
        {page === "sales" && <Sales />}
        {page === "expenses" && <Expenses />}
        {page === "customers" && <Customers />}
        {page === "reports" && <Reports />}
        {page === "settings" && <Settings />}
      </div>
    </div>
  );
}

export default App;