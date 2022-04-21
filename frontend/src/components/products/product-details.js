import "./products.css"
import {
useParams
} from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import {useSelector,useDispatch} from "react-redux"
import { AddToCart } from "../../redux/actions/cart_action";

import { useEffect } from "react";
// import { selectedProduct } from "../../redux/actions/product_actions";

export const ProductDetails = () => {
  
    const { id } = useParams();
    const [qty,setqty]=useState(1);
    const dispatch=useDispatch();

    const CurrentState=useSelector(state=>state)
    console.log("current state is ",CurrentState)

    const userstatus=useSelector(state=>state.account.UserStatus)

    
    const Product=JSON.parse(localStorage.getItem("selectedproduct"));
    console.log("selected product  is",Product);

    const Allproducts=useSelector((state)=>state.allProducts.products);

   const AddToCartHandler=()=>{
console.log("add to cart alert !!!",Product);
if(userstatus){
  dispatch(AddToCart(Product,qty));
  toast("Item added to cart", {
    position: toast.POSITION.BOTTOM_RIGHT,
  })
}
else{
  toast("Please login to purchase", {
    position: toast.POSITION.BOTTOM_RIGHT,
  });
}
   
   }

   const bg={backgroundImage:`url("https://res.cloudinary.com/cloudyimg/image/upload/v1635506543/pdbg_lg3w0k.jpg")`}

    return (
      <>
      <div className="selected-product-contianer" style={bg}>
        {!Product? <h2>Loading...</h2>:(
          <div className="selected-product" >

            <div className="selected-product-details">
              
            <div className="selected-product-img">
              <img src={Product.image} alt="choco-image"></img>
            </div>
            
            <div className="selected-product-ops">
            
            <div className="name">{Product.name}</div>
            <div className="price">${Product.price}</div>
            <div className="quantity">
              <button onClick={()=>qty>1?setqty(qty-1):""}>-</button><input type="text" readOnly value={qty}></input><button onClick={()=>setqty(qty+1)}>+</button>
            </div>
            <div className="addtocart"><img src={require("../../media/add-to-cart.png").default} onClick={AddToCartHandler}></img></div>
            
            </div>
            </div>
            <div className="selected-product-description">
{Product.description}
            </div>
          </div>
        )}
        </div>
      </>
    );
  };
  