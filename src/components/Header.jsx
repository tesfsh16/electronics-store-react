import { Link} from "react-router-dom";
import { useContext } from "react";
import { cartContext } from "../context/CartContext";

function Header (){
const {cartItem} = useContext(cartContext);

const totalItems = cartItem.reduce((total, item)=>total + item.quantity,0);

}