import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Sales from "./components/Sales";
import Products from "./components/Products"
import Expenses from "./components/Expenses";
import Customers from "./components/Customers";
import Reports from "./components/Reports";
import Settings from "./components/Settings";

import "./App.css";
function App() {
  const [sales, setSales] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const profit = sales - expenses;
  const [page, setPage] = useState("dashboard");

  return (
    <div>
      <nav>
        <h2>Biashara Hub</h2>

        <button onClick={ () => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("products")}>Products</button>  
        <button onClick={ () => setPage("sales")}>Sales</button>  
        <button onClick={ () => setPage("expenses")}>Expenses</button>
        <button onClick={() => setPage("customers")}>Customers</button>
        <button onClick={() => setPage("reports")}>Reports</button>
        <button onClick={() => setPage("settings")}>Settings</button>
      </nav>

    {page === "dashboard" && (
      <Dashboard
        sales ={sales}
        expenses = {expenses}
        profit = {profit}
      />
    )}
      
    {page === "sales" && <Sales />}
    {page === "products" && <Products />}
    {page === "expenses" && <Expenses />}
    {page === "customers" && <Customers />}
    {page === "reports" && <Reports />}
    {page === "settings" && <Settings />}






  
    </div>
  );
}

export default App;