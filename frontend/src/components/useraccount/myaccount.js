import "./myaccount.css";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import { EmptyTheCart } from "../../redux/actions/cart_action";

export const Myaccount = () => {
  const options = {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
  const dispatch = useDispatch();
  const username = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const [Myorders, setMyorders] = useState([]);
  // ---- retrieving past orders (Order history) ----
  useEffect(() => {
    axios
      .get(
        `https://choco-wizard.herokuapp.com/orders/myorders/${email}`,
        options
      )
      .then((res) => {
        console.log("you orders a retreived", res);
        setMyorders([...res.data.myorders]);
        dispatch(EmptyTheCart());
      })
      .catch((err) => {
        console.log("error getting your orders", err);
      });
  }, []);

  return (
    <>
      <div className="Myaccount-container">
        <div className="Myaccount-card">
          <div className="Myaccount-card-pic">
            <img
              src={require("../../media/user-pic.png").default}
              alt="user-pic"
            ></img>
          </div>
          <div className="Myaccount-card-details">
            <p>{username}</p>
            <p>{email}</p>
          </div>
        </div>
        <h1>Order History</h1>
        {Myorders.length === 0 ? (
          <div className="no-orders">
            <img
              src={require("../../media/orders.png").default}
              alt="cart-pic"
            ></img>
            <h1>{"No orders were made"}</h1>
          </div>
        ) : (
          Myorders.map((v, i) => {
            return (
              <div key={v.orderid} className="order-box">
                <div className="order-box-header">
                  <div>
                    <p>{"Order ID"}</p>
                    <p>{v.orderid}</p>
                  </div>
                  <div>
                    <p>{"Ordered on"}</p>
                    <p>{new Date(v.timestamp).toDateString()}</p>
                  </div>
                  <div>
                    <p>{"Order status"}</p>
                    <p>
                      {v.dispatch === true ? (
                        <p
                          style={{
                            color: "rgb(0, 255, 0)",
                            fontWeight: "bold",
                          }}
                        >
                          {"Shipped"}
                        </p>
                      ) : (
                        <p
                          style={{
                            color: "rgb(255, 148, 77)",
                            fontWeight: "bold",
                          }}
                        >
                          {"Processing"}
                        </p>
                      )}
                    </p>
                  </div>
                </div>

                {v.summary.map((product) => {
                  return (
                    <div className="order-box-body" key={product._id}>
                      <div className="order-box-body-1">
                        <img src={product.image} alt="user-pic"></img>
                        <span>{product.name}</span>
                      </div>
                      <div className="order-box-body-2">
                        <p className="order-box-heading">Price</p>
                        <p>{product.price}</p>
                      </div>
                      <div className="order-box-body-3">
                        <p className="order-box-heading">Quantity</p>
                        <p>{product.quantity}</p>
                      </div>
                    </div>
                  );
                })}
                <div className="Total-price">
                  Total Price ₹{v.totalprice}
                  {/* {v.summary.map((item) => item.price).reduce((a, b) => a + b)} */}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};
