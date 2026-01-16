import { Link} from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function Header (){
const {cartItem} = useContext(CartContext);

const totalItems = cartItem.reduce((total, item)=>total + item.quantity,0);
return (
  <header className="bg-primary text-black px-6 py-4 flex justify-between item-center">
    <Link to="/" className="text-x1 font-bold hover:underline">
      ElectroStore
    </Link>
    <Link to="/cart" className="relative">
      🛒
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 rounded-full">
          {totalItems}
        </span>
      )}
    </Link>
  </header>
);
}
export default Header;