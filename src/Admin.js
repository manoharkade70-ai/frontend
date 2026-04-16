import { useState } from "react";

const BASE_URL = process.env.REACT_APP_BASE_URL;

function Admin() {
  const [value, setValue] = useState("");
  const [count, setCount] = useState(1);
  const [password, setPassword] = useState("");
  const [isAuth, setIsAuth] = useState(false);

  const login = () => {
    if (password === "admin123") setIsAuth(true);
    else alert("Wrong password");
  };

  const generateZip = async () => {
    const res = await fetch(`${BASE_URL}/create-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ value, count })
    });

    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcodes.zip";
    a.click();
  };

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
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h1>⚙️ Admin Panel</h1>

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
        Generate & Download ZIP
      </button>
    </div>
  );
}

export default Admin;