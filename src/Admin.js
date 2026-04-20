import { useState, useEffect } from "react";

const BASE_URL = "https://backend-osy4.onrender.com";

function Admin() {
  const [value, setValue] = useState("");
  const [count, setCount] = useState(1);
  const [password, setPassword] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [groupedTokens, setGroupedTokens] = useState({});
  const [mobile, setMobile] = useState("");

  const handleLogin = async () => {
    const res = await fetch(`${BASE_URL}/admin-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcodes.zip";
    a.click();

    loadGroupedTokens(); // refresh
  };

  const loadGroupedTokens = async () => {
    const res = await fetch(`${BASE_URL}/tokens-by-date`, {
      headers: {
        "x-admin-key": localStorage.getItem("adminToken")
      }
    });

    const data = await res.json();
    setGroupedTokens(data);
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
    if (isAuth) loadGroupedTokens();
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
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>⚙️ Admin Panel</h1>

      {/* ✅ Excel Button */}
      <button
        onClick={() =>
          window.open(
            `${BASE_URL}/export-users?key=${localStorage.getItem("adminToken")}`
          )
        }
        style={{
          background: "green",
          color: "white",
          padding: "10px",
          marginBottom: "20px"
        }}
      >
        Export Excel
      </button>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input placeholder="Value" onChange={(e) => setValue(e.target.value)} />
        <input placeholder="Count" onChange={(e) => setCount(e.target.value)} />
        <button onClick={generateZip}>Generate & Download</button>
      </div>

      <h3>Clear Wallet</h3>
      <input placeholder="Mobile" onChange={(e) => setMobile(e.target.value)} />
      <button onClick={clearWallet}>Clear</button>

      <h3>Tokens by Date</h3>

      {Object.keys(groupedTokens).map(date => (
        <div key={date}>
          <h4>{date}</h4>
          {groupedTokens[date].map((t, i) => (
            <div key={i}>
              {t.tokenId} - ₹{t.value} - {t.used ? "✅ Used" : "❌ Unused"}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Admin;