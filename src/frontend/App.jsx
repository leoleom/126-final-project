import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../../src/frontend/pages/home";
import Login from "../../src/frontend/pages/login";
import Signup from "../../src/frontend/pages/signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;