import { useEffect, useState } from "react";

import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import Sales from "./components/Sales";
import AddSale from "./components/AddSale";
import Expenses from "./components/Expenses";
import Customers from "./components/Customers";
import Reports from "./components/Reports";
import Settings from "./components/Settings";

import "./App.css";

function App() {
  const [page, setPage] = useState("dashboard");

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("biashara-theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("biashara-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }

  const navigation = [
    { id: "dashboard", label: "Dashboard", icon: "▦" },
    { id: "products", label: "Products", icon: "▤" },
    { id: "sales", label: "Sales", icon: "↗" },
    { id: "expenses", label: "Expenses", icon: "↘" },
    { id: "customers", label: "Customers", icon: "♙" },
    { id: "reports", label: "Reports", icon: "▥" },
    { id: "settings", label: "Settings", icon: "⚙" },
  ];

  const currentPage =
    page === "add-sale"
      ? { label: "Add Sale" }
      : navigation.find((item) => item.id === page);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">B</div>

          <div className="brand-text">
            <span>Biashara</span>
            <span>HUB</span>
          </div>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="main-navigation" aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              key={item.id}
              type="button"
              className={
                page === item.id ||
                  (page === "add-sale" && item.id === "sales")
                  ? "nav-button active"
                  : "nav-button"
              }
              onClick={() => setPage(item.id)}
              aria-current={
                page === item.id ||
                  (page === "add-sale" && item.id === "sales")
                  ? "page"
                  : undefined
              }
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>

              <span>{item.label}</span>

              {(page === item.id ||
                (page === "add-sale" && item.id === "sales")) && (
                  <span className="active-indicator" />
                )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="status-dot" />
          <span>Business management</span>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="breadcrumb-divider">/</span>
            <strong>{currentPage?.label}</strong>
          </div>

          <div className="topbar-right">
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
              title={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
            >
              <span aria-hidden="true">
                {theme === "light" ? "☾" : "☀"}
              </span>

              <span>
                {theme === "light" ? "Dark mode" : "Light mode"}
              </span>
            </button>

            <span className="system-status">
              <span className="status-dot" />
              System ready
            </span>

            <div className="profile-avatar" title="Business owner">
              B
            </div>
          </div>
        </header>

        <main className="page-content">
          {page === "dashboard" && <Dashboard />}

          {page === "products" && <Products />}

          {page === "sales" && (
            <Sales onAddSale={() => setPage("add-sale")} />
          )}

          {page === "add-sale" && (
            <AddSale onCancel={() => setPage("sales")} />
          )}

          {page === "expenses" && <Expenses />}

          {page === "customers" && <Customers />}

          {page === "reports" && <Reports />}

          {page === "settings" && <Settings />}
        </main>

        <footer className="app-footer">
          <span>Biashara Hub</span>
          <span>Simple for the owner. Smart behind the scenes.</span>
        </footer>
      </div>
    </div>
  );
}

export default App;