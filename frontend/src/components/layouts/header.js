import "./layout.css";
import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { EmptyTheCart } from "../../redux/actions/cart_action";
import { LogoutAction } from "../../redux/actions/account_action";

import { Adminpage } from "../admin/admin";
import ReactTooltip from "react-tooltip";

export const Header = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  // const [user,setuser]=useState(false);

  const cart = useSelector((state) => state.cart.cart);
  const userstatus = useSelector((state) => state.account.UserStatus);
  const username = useSelector((state) => state.account.UserName);
  const email = localStorage.getItem("email");
  const isAdmin = localStorage.getItem("admin");
  console.log("userstatus is >>>", userstatus);

  const LogoutHandler = () => {
    const removables = ["name", "email", "token", "admin"];
    removables.forEach((i) => localStorage.removeItem(i));
    dispatch(EmptyTheCart());
    dispatch(LogoutAction(false));
    history.push("/homepage");
  };

  const [fil, setfil] = useState("none");

  return (
    <>
      <div className="header">
        <div className="header-right">
          <span className="title">CHOCO WIZARD</span>

          <span
            data-tip
            data-for="landing-page"
            data-background-color="white"
            data-type="info"
            data-text-color="black"
            bordercolor="black"
          >
            <Link to="/homepage">
              <img
                src={require("../../media/logo.png").default}
                className="logo"
                alt="logo"
              ></img>
            </Link>
          </span>

          <ReactTooltip id="landing-page" place="bottom" effect="solid">
            {"Landing page"}
          </ReactTooltip>
        </div>

        <div className="header-left">
          {/* ----icon 1----- */}
          <span
            data-tip
            data-for="product-list"
            data-background-color="white"
            data-type="info"
            data-text-color="black"
            bordercolor="black"
          >
            <Link to="/Allproducts">
              <img
                src={require("../../media/products.png").default}
                alt="products"
              ></img>
            </Link>
          </span>
          <ReactTooltip id="product-list" place="bottom" effect="solid">
            {"All products"}
          </ReactTooltip>

          {isAdmin ? (
            <div>
              <span
                data-tip
                data-for="admin-pannel"
                data-background-color="white"
                data-type="info"
                data-text-color="black"
                bordercolor="black"
              >
                <Link to="/adminpage">
                  <img
                    src={require("../../media/admin1.png").default}
                    alt="admin"
                  ></img>
                </Link>
              </span>
              <ReactTooltip id="admin-pannel" place="bottom" effect="solid">
                {"Admin Panel"}
              </ReactTooltip>
            </div>
          ) : (
            ""
          )}

          {/* ----icon 2----- */}
          {userstatus && email !== "admin@chocowizard.com" ? (
            <span>
              <span
                data-tip
                data-for="my-cart"
                data-background-color="white"
                data-type="info"
                data-text-color="black"
                bordercolor="black"
              >
                <Link to="/mycart">
                  <div className="cart-badge">
                    <img
                      src={require("../../media/cart.png").default}
                      alt="cart-pic"
                    ></img>
                    <span>{cart.length}</span>
                  </div>
                </Link>
              </span>
              <ReactTooltip id="my-cart" place="bottom" effect="solid">
                {"My cart"}
              </ReactTooltip>
            </span>
          ) : (
            ""
          )}

          {/* ----icon 3 (username badge)----- */}
          {userstatus && email !== "admin@chocowizard.com" ? (
            <div className="user-badge">
              <div className="user-badge-icon">
                <span>
                  {" "}
                  <span
                    data-tip
                    data-for="my-account"
                    data-background-color="white"
                    data-type="info"
                    data-text-color="black"
                    bordercolor="black"
                  >
                    <Link to="/myaccount">
                      <img
                        src={require("../../media/profilepic.png").default}
                        alt="user-pic"
                      ></img>
                    </Link>
                  </span>
                  <ReactTooltip id="my-account" place="bottom" effect="solid">
                    {"My account"}
                  </ReactTooltip>
                </span>
              </div>
              <div className="user-badge-details">
                <span>{username}</span>
                <span onClick={LogoutHandler} className="logout">
                  Log out
                </span>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};
