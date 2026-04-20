import { useState, useEffect } from "react";

const BASE_URL = "https://backend-osy4.onrender.com";

function Admin() {
  const [value, setValue] = useState("");
  const [count, setCount] = useState(1);
  const [password, setPassword] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [groupedTokens, setGroupedTokens] = useState({});
  const [openDate, setOpenDate] = useState(null);
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
    <div
      style={{
        textAlign: "center",
        marginTop: "120px",
        fontFamily: "Arial"
      }}
    >
      <h2>🔐 Admin Login</h2>

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          padding: "10px",
          width: "220px",
          marginTop: "10px",
          border: "1px solid #ccc",
          outline: "none"
        }}
      />

      <br /><br />

      <button
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          background: "blue",
          color: "white",
          border: "black",
          cursor: "pointer"
        }}
      >
        Login
      </button>
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

     <div style={{ marginBottom: "20px" }}>
  <input
    placeholder="Value"
    onChange={(e) => setValue(e.target.value)}
    style={{ width: "100px", padding: "8px", marginRight: "10px" }}
  />

  <input
    placeholder="Count"
    onChange={(e) => setCount(e.target.value)}
    style={{ width: "100px", padding: "8px" }}
  />

  <br /><br />

  <button
    onClick={generateZip}
    style={{
      padding: "10px 15px",
      background: "blue",
      color: "white",
      border: "black",
      cursor: "pointer"
    }}
  >
    Generate & Download
  </button>
</div>

      <h3>Clear Wallet</h3>

<div style={{ marginBottom: "20px" }}>
  <input
    placeholder="Mobile"
    onChange={(e) => setMobile(e.target.value)}
    style={{ width: "200px", padding: "8px" }}
  />

  <br /><br />

  <button
    onClick={clearWallet}
    style={{
      padding: "10px",
      background: "red",
      color: "white",
      border: "black"
    }}
  >
    Clear Wallet
  </button>
</div>

      <h3>Tokens by Date</h3>

{Object.keys(groupedTokens)
  .sort((a, b) => new Date(b) - new Date(a))
  .map(date => (
    <div key={date} style={{ marginBottom: "10px" }}>

    {/* DATE BAR */}
    <div
      onClick={() => setOpenDate(openDate === date ? null : date)}
      style={{
        background: "#eee",
        padding: "10px",
        cursor: "pointer",
        fontWeight: "bold",
        border: "1px solid #ccc"
      }}
    >
      {date} {openDate === date ? "▼" : "▶"}
    </div>

    {/* TOKENS LIST */}
    {openDate === date && (
      <div
        style={{
          maxHeight: "200px",
          overflowY: "auto",
          border: "1px solid #ddd",
          padding: "10px",
          background: "#fafafa"
        }}
      >
        {groupedTokens[date].map((t, i) => (
          <div key={i} style={{ marginBottom: "5px" }}>
            {t.tokenId} - ₹{t.value} - {t.used ? "✅ Used" : "❌ Unused"}
          </div>
        ))}
      </div>
    )}

  </div>
))}
    </div>
  );
}

export default Admin;