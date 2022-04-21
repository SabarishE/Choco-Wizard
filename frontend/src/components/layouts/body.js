import "./layout.css";
import { Switch, Route } from "react-router-dom";

import { ProductListing } from "../products/product-listing";
import { ProductDetails } from "../products/product-details";
import { Homepage } from "../homepage/homepage";
import { Mycart } from "../useraccount/mycart";
import { Myaccount } from "../useraccount/myaccount";
import { Adminpage } from "../admin/admin";

export const Body = () => {
  const isAdmin = localStorage.getItem("admin");

  return (
    <div className="body">
      <Switch>
        <Route path="/homepage">
          <Homepage />
        </Route>
        <Route path="/Allproducts" exact>
          <ProductListing />
        </Route>
        <Route path="/product-details/:id">
          <ProductDetails />
        </Route>
        <Route path="/mycart">
          <Mycart />
        </Route>
        <Route path="/myaccount">
          <Myaccount />
        </Route>
        <Route path="/adminpage">
          {isAdmin ? <Adminpage /> : <Homepage />}
        </Route>
        <Route path="*">
          <Homepage />
        </Route>
      </Switch>
    </div>
  );
};
