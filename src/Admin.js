import { useState, useEffect } from "react";

const BASE_URL = process.env.REACT_APP_BASE_URL;

function Admin() {
  const [value, setValue] = useState("");
  const [count, setCount] = useState(1);
  const [password, setPassword] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [mobile, setMobile] = useState("");

  const login = () => {
    if (password === "admin123") setIsAuth(true);
    else alert("Wrong password");
  };

  const generateZip = async () => {
    if (!value || !count || isNaN(value) || isNaN(count)) {
      alert("Please enter valid value and count");
      return;
    }
    const res = await fetch(`${BASE_URL}/create-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value, count })
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcodes.zip";
    a.click();
    loadTokens();
  };

  const loadTokens = async () => {
    const res = await fetch(`${BASE_URL}/all-tokens`);
    const data = await res.json();
    setTokens(data);
  };

  const clearWallet = async () => {
    const res = await fetch(`${BASE_URL}/clear-wallet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile })
    });
    const data = await res.json();
    alert(data.message);
  };

  useEffect(() => {
    loadTokens();
  }, []);

  if (!isAuth) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Admin Login</h2>
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
        <br /><br />
        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "20px" }}>
      <h1>⚙️ Admin Panel</h1>

      <button
        onClick={() => window.open(`${BASE_URL}/export-users`)}
        style={{ background: "green", color: "white", padding: "10px", marginBottom: "20px" }}
      >
        Export Excel
      </button>

      <input
        placeholder="Enter Value"
        onChange={(e) => setValue(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        placeholder="Number of Tokens"
        onChange={(e) => setCount(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <button
        onClick={generateZip}
        style={{ width: "100%", padding: "12px", background: "blue", color: "white" }}
      >
        Generate & Download ZIP
      </button>

      <h3 style={{ marginTop: "30px" }}>Clear Wallet</h3>
      <input
        placeholder="Enter Mobile"
        onChange={(e) => setMobile(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <button
        onClick={clearWallet}
        style={{ width: "100%", padding: "10px", background: "red", color: "white" }}
      >
        Clear Wallet
      </button>

      <h3 style={{ marginTop: "30px" }}>All Tokens</h3>

      {tokens.map((t, i) => (
        <div key={i}>
          {t.tokenId} - ₹{t.value} - {t.used ? "✅ Used" : "❌ Unused"}
        </div>
      ))}
    </div>
  );
}

export default Admin;