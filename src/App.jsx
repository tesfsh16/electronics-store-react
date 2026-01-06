import {BrowserRouter , Routes , Route} from "react-router-dom"
import Home from "./pages/Home";
import Cart from "./pages/cart";
import Header from "./components/Header"

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
