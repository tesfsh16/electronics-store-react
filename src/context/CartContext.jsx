import { createContext , useState } from "react";
 export const cartContext = createContext();

 function cartProveder({children}){
    const [cartItem , setCartItem ] = useState([]);
    
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
<cartContext.prvider
value ={{cartItem , addToCart, removeFromCart}}>
   {children}
</cartContext.prvider>
);
 }