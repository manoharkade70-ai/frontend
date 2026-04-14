import { useState, useEffect } from "react";

const BASE_URL = process.env.REACT_APP_BASE_URL;

function User() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [wallet, setWallet] = useState(0);

useEffect(() => {
  const savedMobile = localStorage.getItem("mobile");

  if (savedMobile) {
    setMobile(savedMobile);
    fetchHistory(savedMobile);
  }
}, []);

  const getToken = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
  };

  const redeem = async () => {
    const token = getToken();

    const res = await fetch(`${BASE_URL}/redeem-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tokenId: token,
        name,
        mobile
      })
    });

    const data = await res.json();
    setMessage(data.message);

    fetchHistory(mobile);
  };

  const fetchHistory = async (mob) => {
  const res = await fetch(`${BASE_URL}/user-history/${mob}`);
  const data = await res.json();

  setHistory(data.history || []);
  setWallet(data.wallet || 0);
};

  // 🔥 IMPORTANT: set wallet from backend

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
  setWallet(0);
};

  return (
  <div style={{
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    textAlign: "center",
    fontFamily: "Arial"
  }}>
      <h1>🎁 Redeem Reward</h1>

     <input
       placeholder="Enter Name"
       onChange={(e) => setName(e.target.value)}
       style={{ padding: "10px", width: "90%", marginBottom: "10px" }}
    /><br /><br />

      <input
        placeholder="Enter Mobile"
        onChange={(e) => {
  setMobile(e.target.value);
  localStorage.setItem("mobile", e.target.value);
}}
        style={{ padding: "10px", width: "90%", marginBottom: "10px" }}
      /><br /><br />

<button
  onClick={redeem}
  style={{
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }}
>
  Redeem
</button>

      <p style={{ color: "green", fontWeight: "bold" }}>
                {message}
      </p>

      <h2 style={{ color: "#333" }}>
  💰 Wallet Balance: ₹{wallet}
      </h2>

      <h2>History</h2>

      {history.map((item, i) => (
  <div key={i} style={{
    border: "1px solid #ddd",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    textAlign: "left"
  }}>
    <p><strong>Token:</strong> {item.tokenId}</p>
    <p><strong>Amount:</strong> ₹100</p>
    <p><strong>Date:</strong> {new Date(item.date).toLocaleString()}</p>
  </div>
))}
    </div>
  );
}

export default User;