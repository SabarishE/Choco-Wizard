import "./products.css";
import { useHistory } from "react-router-dom";

import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProducts } from "../../redux/actions/product_actions";
import { SetCartInitialState } from "../../redux/actions/cart_action";
import axios from "axios";

export const ProductListing = () => {
  // const [ nofilter,setnofilter]=useState([]);
  const [searchText, setSearchText] = useState("");
  const reducerResults = useSelector((state) => state);
  const [productsForDisplay, setproductsForDisplay] = useState(
    reducerResults.allProducts.products
  );
  const dispatch = useDispatch();

  const history = useHistory();

  const ProductsRefresh = useCallback(() => {
    const options = {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
    axios
      .get(
        "http://localhost:5000/products/allproducts/admin@chocowizard.com",
        options
      )
      .then((res) => {
        console.log("response data is", res.data);
        dispatch(setProducts(res.data.allproducts));
        dispatch(SetCartInitialState(res.data.allproducts));
      })
      .catch((err) => console.log("error in fetching data", err));
  }, []);

  useEffect(() => {
    ProductsRefresh();
  }, [ProductsRefresh]);

  const productDetailsDisplay = (id, v) => {
    history.push(`/product-details/${id}`);
    localStorage.removeItem("selectedproduct");
    localStorage.setItem("selectedproduct", JSON.stringify(v));
  };

  // ------function for FILTERS-------

  // ---- 1) price low to high------

  const LowToHighPriceFilter = () => {
    let afterfilter = reducerResults.allProducts.products.sort((a, b) => {
      return a.price - b.price;
    });

    console.log("price low to high after filter >>>>", afterfilter);

    dispatch(setProducts(afterfilter));
  };

  // ---- 2) price high to low------

  const HighToLowPriceFilter = () => {
    let afterfilter = reducerResults.allProducts.products.sort((a, b) => {
      return b.price - a.price;
    });

    console.log("price high to low after filter >>>>", afterfilter);

    dispatch(setProducts(afterfilter));
  };

  // 3) filter a-z

  const AToZFilter = () => {
    let afterfilter = reducerResults.allProducts.products.sort((a, b) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });

    console.log("a to z : after filter >>>>", afterfilter);

    dispatch(setProducts(afterfilter));
  };

  // ----4) filter by name -----
  const ProductSearchByName = () => {
    console.log("search change >>>>>>>>>", searchText);

    let afterfilter = reducerResults.cart.Allproducts.filter((v) =>
      v.name.includes(searchText)
    );

    console.log("after search byb name,>>>", afterfilter);
    dispatch(setProducts(afterfilter));
    setSearchText("");
  };

  // ---- 4) remove filter -----
  const ProductRemoveFilter = () => {
    ProductsRefresh();
  };

  return (
    <>
      <div className="product-list-container">
        <div className="filter-section">
          <div className="filter-menu">
            <img
              src={require("../../media/filterproducts.png").default}
              alt={"funnel"}
            ></img>
            <div className="filter-menu-content">
              <span
                onClick={() => {
                  LowToHighPriceFilter();
                }}
              >
                price low to high
              </span>
              <span
                onClick={() => {
                  HighToLowPriceFilter();
                }}
              >
                price high to low
              </span>
              <span
                onClick={() => {
                  AToZFilter();
                }}
              >
                A - Z
              </span>
            </div>
          </div>

          <div className="filter-byname">
            <img
              src={require("../../media/magnifier.png").default}
              alt={"magnifier"}
            ></img>
            <div className="filter-byname-bar">
              <div>
                <input
                  type={"text"}
                  placeholder={"search..."}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                ></input>
                <img
                  src={require("../../media/magnifier.png").default}
                  alt={"magnifier"}
                  onClick={() => {
                    ProductSearchByName();
                  }}
                  onKeyPress={() => {
                    ProductSearchByName();
                  }}
                ></img>
              </div>
            </div>
          </div>
          <div className="all-products" onClick={() => ProductRemoveFilter()}>
            <img
              src={require("../../media/dontfilterproducts.png").default}
              alt={"all"}
            ></img>
          </div>
        </div>
        <div className="product-list">
          {reducerResults.allProducts.products.length === 0 ? (
            <div className="not-found">
              {" "}
              <img
                src={require("../../media/noproducts.png").default}
                alt="no products"
              ></img>
              <h1>{"No products found"}</h1>
            </div>
          ) : (
            reducerResults.allProducts.products.map((v) => {
              return (
                <div className="product-card" key={v._id}>
                  <div className="card-img">
                    <img src={v.image} alt="choco-pic"></img>
                  </div>
                  <div className="card-name">{v.name}</div>
                  <div className="card-flex">
                    <div className="card-price">
                      {"₹"} {v.price}
                    </div>
                    <div className="card-details">
                      <img
                        src={require("../../media/more.png").default}
                        onClick={() => productDetailsDisplay(v._id, v)}
                      ></img>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};
