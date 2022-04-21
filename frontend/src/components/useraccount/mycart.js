import "./mycart.css";

import { v4 as uuid } from "uuid";
import { toast } from "react-toastify";
import StripeCheckout from "react-stripe-checkout";
import { useSelector, useDispatch } from "react-redux";
import { RemoveFromCart, EmptyTheCart } from "../../redux/actions/cart_action";
import { AddQuantity, SubtractQuantity } from "../../redux/actions/cart_action";
import { useHistory } from "react-router-dom";

import axios from "axios";

export const Mycart = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const cart = useSelector((state) => state.cart.cart);

  console.log("my cart items", cart);
  const RemoveFromCartHandler = (id) => {
    dispatch(RemoveFromCart(id));
  };

  const AddQtyHandler = (id) => {
    dispatch(AddQuantity(id));
  };
  const SubtractQtyHandler = (id) => {
    dispatch(SubtractQuantity(id));
  };

  const Amounts = [];

  const options = {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };

  // ----stripe payment request----

  const makepayment = (token) => {
    let totalamount = Amounts.reduce((a, b) => a + b);

    let finalCart = [...cart, { totalprice: totalamount }];

    let body = {
      token,
      finalCart,
    };

    console.log("final cart is ", finalCart);

    axios
      .post("https://choco-wizard.herokuapp.com/orders/payment", body, options)
      .then((res) => {
        console.log("response is >>>", res);
        if (res.data.flag === true) {
          toast("Payment successful !!!", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          afterpayment(cart, totalamount);
        } else {
          toast("Payment failed", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          console.log("Payment failed", res);
        }
      })
      .catch((err) => {
        toast("Payment failed", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        console.log("error in payment", err);
      });
  };

  // -----saving the order after successful payment-----

  const afterpayment = (finalCart, totalamount) => {
    const username = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const orderid = uuid().slice(0, 8).toUpperCase();

    let body = {
      name: username,
      email: email,
      orderid: orderid,
      totalprice: totalamount,
      summary: finalCart,
    };

    console.log("body is >>>", body);

    axios
      .post("https://choco-wizard.herokuapp.com/orders/neworder", body, options)
      .then((res) => {
        if (res.data.flag === true) {
          toast("Order Placed !!! Thank You", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          console.log("Order Placed !!! Thank You", res);
          history.push("/myaccount");
        } else {
          console.log("error in placing order", res);
          toast("Error in placing order", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        }
      })
      .catch((err) => {
        console.log("error in placing order", err);
        toast("Error in placing order", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
  };

  const emptythecart = () => {
    dispatch(EmptyTheCart());
  };

  return (
    <>
      <div className="Mycart-container">
        {cart.length <= 0 ? (
          <div className="empty-cart">
            <img
              src={require("../../media/emptycart.png").default}
              alt="cart-pic"
            ></img>
            <h1>{"your cart is empty"}</h1>
          </div>
        ) : (
          <div className="Mycart">
            <div className="Mycart-header">
              <span>
                Here's what you are getting{" "}
                <img
                  src={require("../../media/smile-face.png").default}
                  alt="cart-pic"
                ></img>{" "}
              </span>
              <button onClick={emptythecart}>empty my cart</button>
            </div>

            {cart.map((item) => {
              Amounts.push(item.quantity * item.price);

              return (
                <div className="cart-listing-item" key={item._id}>
                  <span>
                    <img src={item.image} alt={"prduct-pic"}></img>
                  </span>
                  <span>{item.name}</span>
                  <span className="quantity">
                    <button onClick={() => SubtractQtyHandler(item._id)}>
                      -
                    </button>
                    <input type="text" readOnly value={item.quantity}></input>
                    <button onClick={() => AddQtyHandler(item._id)}>+</button>
                  </span>
                  <span>X {item.price}</span>
                  <span>${item.quantity * item.price}</span>

                  <span className="remove-btn">
                    <button onClick={() => RemoveFromCartHandler(item._id)}>
                      remove
                    </button>
                  </span>
                </div>
              );
            })}

            <div className="summary">
              <div className="summary-div">
                <h3>ORDER SUMMARY</h3>
                <div>
                  <span>TOTAL</span>
                  <span>${Amounts.reduce((a, b) => a + b)}</span>
                </div>
                <StripeCheckout
                  stripeKey="pk_test_51JpwLUSAlzxtYem5HnNpoVpMtIH8KYunqHUL9zUlRdewUayQLhGWuNIIM7BmfjCQ49YEPa5CavUaeswef1G0J6eR00YiEUb6da"
                  token={makepayment}
                  name="make-payment"
                  shippingAddress
                  billingAddress
                >
                  <button className="checkout-btn">CHECKOUT</button>
                </StripeCheckout>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
