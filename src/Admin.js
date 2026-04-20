import { useState, useEffect } from "react";

const BASE_URL = "https://backend-osy4.onrender.com";

function Admin() {
  const [value, setValue] = useState("");
  const [count, setCount] = useState(1);
  const [password, setPassword] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [mobile, setMobile] = useState("");
  const [jobId, setJobId] = useState(null);

  // 🔐 LOGIN
  const handleLogin = async () => {
    try {
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
    } catch (err) {
      console.log(err);
      alert("Login failed");
    }
  };

  // 🔥 GENERATE QR JOB
  const generateZip = async () => {
    if (!value || !count || isNaN(value) || isNaN(count)) {
      alert("Enter valid value & count");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/create-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": localStorage.getItem("adminToken")
        },
        body: JSON.stringify({ value, count })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setJobId(data.jobId);
      alert("QR generation started");
    } catch (err) {
      console.log(err);
      alert("Failed to start job");
    }
  };

  // 🔁 CHECK STATUS + DOWNLOAD
  const checkStatus = async () => {
    if (!jobId) {
      alert("No job running");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/job-status/${jobId}`);
      const data = await res.json();

      if (data.status === "completed") {
        window.open(`${BASE_URL}/download/${jobId}`);
        setJobId(null);
        loadTokens();
      } else {
        alert("Still processing...");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 📥 LOAD TOKENS (SAFE)
  const loadTokens = async () => {
    try {
      const res = await fetch(`${BASE_URL}/all-tokens`, {
        headers: {
          "x-admin-key": localStorage.getItem("adminToken")
        }
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setTokens(data);
      } else {
        console.log("Unexpected response:", data);
        setTokens([]);
      }
    } catch (err) {
      console.log("Error loading tokens:", err);
      setTokens([]);
    }
  };

  // 🧹 CLEAR WALLET
  const clearWallet = async () => {
    try {
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
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isAuth) {
      loadTokens();
    }
  }, [isAuth]);

  // 🔐 LOGIN UI
  if (!isAuth) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Admin Login</h2>
        <input
          type="password"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  // 🔥 ADMIN PANEL
  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "20px" }}>
      <h1>⚙️ Admin Panel</h1>

      <button
        onClick={() => alert("Export disabled for now")}
        style={{
          background: "green",
          color: "white",
          padding: "10px",
          marginBottom: "20px"
        }}
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
        style={{
          width: "100%",
          padding: "12px",
          background: "blue",
          color: "white"
        }}
      >
        Generate QR Job
      </button>

      <button
        onClick={checkStatus}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "10px",
          background: "orange",
          color: "white"
        }}
      >
        Check & Download
      </button>

      <h3 style={{ marginTop: "30px" }}>Clear Wallet</h3>

      <input
        placeholder="Enter Mobile"
        onChange={(e) => setMobile(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <button
        onClick={clearWallet}
        style={{
          width: "100%",
          padding: "10px",
          background: "red",
          color: "white"
        }}
      >
        Clear Wallet
      </button>

      <h3 style={{ marginTop: "30px" }}>All Tokens</h3>

      {Array.isArray(tokens) &&
        tokens.slice(0, 100).map((t, i) => (
          <div key={i}>
            {t.tokenId} - ₹{t.value} - {t.used ? "✅ Used" : "❌ Unused"}
          </div>
        ))}
    </div>
  );
}

export default Admin;