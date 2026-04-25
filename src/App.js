import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Redeem from "./Redeem";
import User from "./User";
import Admin from "./Admin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<User />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/redeem/:tokenId" element={<Redeem />} />
      </Routes>
    </Router>
  );
}

export default App;