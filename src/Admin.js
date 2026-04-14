import { useState, useEffect } from "react";

const BASE_URL = process.env.REACT_APP_BASE_URL;


function Admin() {
  const [value, setValue] = useState("");
  const [tokens, setTokens] = useState([]);
  const [qrImage, setQrImage] = useState("");
  const [mobile, setMobile] = useState("");

  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");

const login = () => {
  if (password === "admin123") {
    setIsAuth(true);
  } else {
    alert("Wrong password");
  }
};


  // 🔥 CREATE TOKEN (RANDOM FROM BACKEND)
  const createToken = async () => {
    const res = await fetch(`${BASE_URL}/create-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ value })
    });

    const data = await res.json();

    alert(data.message);

    if (data.qr) {
      setQrImage(data.qr);
    }

    loadTokens();
  };

  // 🔥 LOAD TOKENS
  const loadTokens = async () => {
    const res = await fetch(`${BASE_URL}/all-tokens`);
    const data = await res.json();
    setTokens(data);
  };

  // 🔥 CLEAR WALLET (ADMIN CONTROL)
  const clearWallet = async () => {
    const res = await fetch(`${BASE_URL}/clear-wallet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
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

        <input
          type="password"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />

        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>⚙️ Admin Panel</h1>

      {/* 🔥 EXPORT EXCEL */}
      <button
        onClick={() => window.open("https://backend-osy4.onrender.com/export-users")}
        style={{
          padding: "10px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          marginBottom: "20px",
          cursor: "pointer"
        }}
      >
        📥 Export Users Report
      </button>

      {/* 🔥 CREATE TOKEN */}
      <input
        placeholder="Enter Value (₹)"
        onChange={(e) => setValue(e.target.value)}
      /><br /><br />

      <button
        onClick={createToken}
        style={{
          padding: "10px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px"
        }}
      >
        Create Token
      </button>

      {/* 🔥 QR DISPLAY */}
      {qrImage && (
        <div style={{ marginTop: "20px" }}>
          <h3>Generated QR</h3>

          <img
            src={qrImage}
            alt="QR"
            style={{ width: "200px", marginBottom: "10px" }}
          />

          <br />

          <a
            href={qrImage}
            download="qr-code.png"
            style={{
              padding: "8px 15px",
              backgroundColor: "#007BFF",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px"
            }}
          >
            Download QR
          </a>
        </div>
      )}

      {/* 🔥 CLEAR WALLET */}
      <h2 style={{ marginTop: "30px" }}>Clear Customer Wallet</h2>

      <input
        placeholder="Enter Mobile"
        onChange={(e) => setMobile(e.target.value)}
      /><br /><br />

      <button
        onClick={clearWallet}
        style={{
          padding: "10px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          borderRadius: "5px"
        }}
      >
        Clear Wallet
      </button>

      {/* 🔥 TOKEN LIST */}
      <h2 style={{ marginTop: "30px" }}>All Tokens</h2>

      {tokens.map((t, i) => (
        <div key={i}>
          {t.tokenId} - ₹{t.value} - {t.used ? "Used" : "Unused"}
        </div>
      ))}
    </div>
  );
}

export default Admin;