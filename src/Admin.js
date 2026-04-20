import { useState, useEffect } from "react";

const BASE_URL = "https://backend-osy4.onrender.com";

function Admin() {
  const [value, setValue] = useState("");
  const [count, setCount] = useState(1);
  const [password, setPassword] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [mobile, setMobile] = useState("");

  const handleLogin = async () => {
    const res = await fetch(`${BASE_URL}/admin-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Wrong password");
      return;
    }

    localStorage.setItem("adminToken", data.token);
    setIsAuth(true);
  };

  const generateZip = async () => {
    const res = await fetch(`${BASE_URL}/create-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": localStorage.getItem("adminToken")
      },
      body: JSON.stringify({ value, count })
    });

    if (!res.ok) {
      alert("Failed to generate QR");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcodes.zip";
    a.click();
  };

  const loadTokens = async () => {
    const res = await fetch(`${BASE_URL}/all-tokens`, {
      headers: {
        "x-admin-key": localStorage.getItem("adminToken")
      }
    });

    const data = await res.json();
    setTokens(Array.isArray(data) ? data : []);
  };

  const clearWallet = async () => {
    const res = await fetch(`${BASE_URL}/clear-wallet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": localStorage.getItem("adminToken")
      },
      body: JSON.stringify({ mobile })
    });

    const data = await res.json();
    alert(data.message);
  };

  useEffect(() => {
    if (isAuth) loadTokens();
  }, [isAuth]);

  if (!isAuth) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Admin Login</h2>
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
        <br /><br />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "20px" }}>
      <h1>⚙️ Admin Panel</h1>

      <input placeholder="Value" onChange={(e) => setValue(e.target.value)} />
      <input placeholder="Count" onChange={(e) => setCount(e.target.value)} />

      <button onClick={generateZip}>
        Generate & Download QR
      </button>

      <h3>Clear Wallet</h3>
      <input placeholder="Mobile" onChange={(e) => setMobile(e.target.value)} />
      <button onClick={clearWallet}>Clear Wallet</button>

      <h3>Tokens</h3>
      {tokens.slice(0, 50).map((t, i) => (
        <div key={i}>
          {t.tokenId} - ₹{t.value} - {t.used ? "Used" : "Unused"}
        </div>
      ))}
    </div>
  );
}

export default Admin;