import { useParams } from "react-router-dom";
import { useState } from "react";
const [wallet, setWallet] = useState(0);
const BASE_URL = "https://backend-osy4.onrender.com";

function Redeem() {
  const { tokenId } = useParams();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const handleRedeem = async () => {
    if (!tokenId) {
      alert("Token missing");
      return;
    }

    const res = await fetch(`${BASE_URL}/redeem-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tokenId,
        name,
        mobile
      })
    });

    const data = await res.json();
    setWallet(data.wallet);
alert(data.message);
  };

 return (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f5f5f5"
    }}
  >
    <div
      style={{
        background: "white",
        padding: "30px",
        borderRadius: "12px",
        width: "350px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>🎁 Redeem Reward</h2>

      <input
        placeholder="Enter Name"
        onChange={(e) => setName(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px"
        }}
      />

      <input
        placeholder="Enter Mobile"
        onChange={(e) => setMobile(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          border: "1px solid #ccc",
          borderRadius: "5px"
        }}
      />

      <button
        onClick={handleRedeem}
        style={{
          width: "100%",
          padding: "10px",
          background: "green",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Redeem
      </button>

      <h3 style={{ marginTop: "20px" }}>
        💰 Wallet Balance: ₹{wallet}
      </h3>

      <h3>History</h3>
    </div>
  </div>
);
}

export default Redeem;