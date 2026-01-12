import { createContext , useState , useEffect} from "react";
 export const cartContext = createContext();

     export function CartProvider({children}){
    const [cartItem , setCartItem ] = useState(()=>{
      const storedCart = localStorage.getItem("cart");
      return storedCart? JSON.parse(storedCart) : [];
    });
    
    //Add to cart

    const addToCart = (product)=>{
      setCartItem((prevItem)=> {
         const exsistingItem  =  prevItem.find((item)=> item.id === product.id);
         if(exsistingItem){
            return prevItem.map((item)=> item.id===product.id?{...item , quantity:item.quantity + 1 }: item );
         }
         return [...prevItem , {...product, quantity:1}];
      });
    };

    //Remove from cart

    const removeFromCart = (id)=>{
      setCartItem((prevItem)=> prevItem.filter((item)=> item.id !== id)
      );
    };
return (
<cartContext.Provider
value ={{cartItem , addToCart, removeFromCart}}>
   {children}
</cartContext.Provider>
);
 }