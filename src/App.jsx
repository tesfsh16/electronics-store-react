import {BrowserRouter , Routes , Route} from "react-router-dom"
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Header from "./components/Header"

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
