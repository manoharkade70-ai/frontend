import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const BASE_URL = "https://backend-osy4.onrender.com";

function Redeem() {
  const { tokenId } = useParams();

  // ✅ ALL STATES INSIDE COMPONENT
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [wallet, setWallet] = useState(0);
  const [history, setHistory] = useState([]);

  // ✅ LOAD USER DATA ON PAGE LOAD
  useEffect(() => {
    const savedMobile = localStorage.getItem("userMobile");

    if (savedMobile) {
      setMobile(savedMobile);

      fetch(`${BASE_URL}/user/${savedMobile}`)
        .then(res => res.json())
        .then(data => {
          setWallet(data.wallet || 0);
          setHistory(data.history || []);
        });
    }
  }, []);

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

    // ✅ SAVE MOBILE FOR FUTURE
    localStorage.setItem("userMobile", mobile);

    // ✅ UPDATE WALLET ALWAYS (even for already used)
    setWallet(data.wallet || 0);

    // ✅ REFRESH HISTORY
    fetch(`${BASE_URL}/user/${mobile}`)
      .then(res => res.json())
      .then(data => {
        setHistory(data.history || []);
      });

    alert(data.message);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
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
        <h2>🎁 Redeem Reward</h2>

        <input
          placeholder="Enter Name"
          value={name}
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
          value={mobile}
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

        <div style={{ maxHeight: "150px", overflowY: "auto" }}>
          {history.map((h, i) => (
            <div key={i}>
              ₹{h.value} - {new Date(h.date).toLocaleDateString()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Redeem;