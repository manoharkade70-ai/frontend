import { useParams } from "react-router-dom";
import { useState } from "react";

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
    alert(data.message);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Redeem Token</h2>

      <p><b>{tokenId}</b></p>

      <input
        placeholder="Enter Name"
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Enter Mobile"
        onChange={(e) => setMobile(e.target.value)}
      />
      <br /><br />

      <button onClick={handleRedeem}>
        Redeem
      </button>
    </div>
  );
}

export default Redeem;