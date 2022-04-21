import "./admin.css";
import { useForm } from "react-hook-form";
import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

import axios from "axios";

import { setProducts } from "../../redux/actions/product_actions";
import { SetCartInitialState } from "../../redux/actions/cart_action";

export const Adminpage = () => {
  const [Allorders, setAllorders] = useState([]);

  const dispatch = useDispatch();
  const reducerResults = useSelector((state) => state);

  // ---- fetching all orders from server by ADMIN ----

  const OrdersRefresh = useCallback(() => {
    const options = {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
    axios
      .get(
        `https://choco-wizard.herokuapp.com/orders/allorders/admin@chocowizard.com`,
        options
      )
      .then((res) => {
        console.log("all orders are retreived by admin", res);
        setAllorders([...res.data.Allorders]);
      })
      .catch((err) => {
        console.log("error getting your orders", err);
      });
  }, []);

  // ---- fetching all products from server by ADMIN ----

  const ProductsRefresh = useCallback(() => {
    const options = {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
    axios
      .get(
        "https://choco-wizard.herokuapp.com/products/allproducts/admin@chocowizard.com",
        options
      )
      .then((res) => {
        console.log("response data is", res.data);
        dispatch(setProducts(res.data.allproducts));
        dispatch(SetCartInitialState(res.data.allproducts));
      })
      .catch((err) => console.log("error in fetching data", err));
  }, []);

  return (
    <>
      <div className="Admin-container">
        <div className="admin-header">
          <div className="admin-card-1">
            <div>
              <img
                src={require("../../media/shield.png").default}
                alt="shield-pic"
              ></img>
            </div>
            <div>
              <span>{"ADMIN"}</span>
              <span>{"admin@chocowizard.com"}</span>
            </div>
          </div>
          <div className="admin-card-2">
            <div className="admin-card-square">
              <span className="field">{"Total Orders"}</span>
              <span className="value">{Allorders.length}</span>
            </div>
            <div className="admin-card-square">
              <span className="field">{"Total Products"}</span>
              <span className="value">
                {reducerResults.allProducts.products.length}
              </span>
            </div>
          </div>
        </div>

        <div className="admin-menubar">
          <a href="#orders">orders</a>
          <a href="#products">products</a>
        </div>

        <div className="admin-body">
          <Orders Allorders={Allorders} OrdersRefresh={OrdersRefresh} />
          <Products
            ProductsRefresh={ProductsRefresh}
            reducerResults={reducerResults}
          />
        </div>
      </div>
    </>
  );
};

const Products = ({ ProductsRefresh, reducerResults }) => {
  const [newProductForm, setnewProductForm] = useState("block");
  const [updateID, setupdateID] = useState("");
  // const [deleteID,setdeleteID]=useState("");

  useEffect(() => {
    ProductsRefresh();
  }, [ProductsRefresh]);

  const [Loading, setLoading] = useState(false);

  // ----deleting a product by ADMIN

  const DeleteHandler = (ID) => {
    console.log("product to be deleted >>>", ID);

    const options = {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };

    if (window.confirm(`Delete the product ${ID} ?`) === true) {
      axios
        .delete(
          `https://choco-wizard.herokuapp.com/products/deleteproduct/${ID}`,
          options
        )
        .then((res) => {
          console.log(
            "response data from local server all products by admin :",
            res.data
          );
          toast("product deleted successfully!!!", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          ProductsRefresh();
        })
        .catch((err) => {
          console.log("error in deleting product", err);
          toast("Error in deleting a product", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        });
    }
  };

  // ---- pagination for products table ----

  const [PageNumber, setPageNumber] = useState(0);
  const [productsPerPage, setproductsPerPage] = useState(5);

  const productsVisited = PageNumber * productsPerPage;
  const totalPages = Math.ceil(
    reducerResults.allProducts.products.length / productsPerPage
  );

  let pagesArray = [];

  for (let i = 0; i < totalPages; i++) {
    pagesArray.push(i);
  }

  return (
    <div id="products">
      <h1>
        {"PRODUCTS"}
        <ClipLoader color={"black"} loading={Loading} size={25} />
      </h1>

      <div className="product-forms-flex">
        {/* ----create product form ---- */}
        <NewProductForm
          setLoading={setLoading}
          ProductsRefresh={ProductsRefresh}
        />
        <UpdateProductForm
          updateID={updateID}
          setupdateID={setupdateID}
          setLoading={setLoading}
          ProductsRefresh={ProductsRefresh}
        />

        {/* ----update product form ---- */}
      </div>

      <div className="products-table-div">
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
          <table>
            <thead>
              <tr>
                <td>ID</td>
                <td>Name</td>
                <td>Price</td>
                <td>Image URL</td>
                <td>Description</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {reducerResults.allProducts.products
                .slice(productsVisited, productsVisited + productsPerPage)
                .map((item, index) => {
                  return (
                    <tr key={item._id}>
                      <td>{item._id}</td>
                      <td>{item.name}</td>
                      <td>{item.price}</td>
                      <td>{item.image}</td>
                      <td>{item.description}</td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => DeleteHandler(item._id)}
                        >
                          delete
                        </button>
                        <button
                          className="update-btn"
                          onClick={() => setupdateID(item._id)}
                        >
                          update
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
        <div className="Pagination">
          <div className="pagination-buttons">
            {/* -----previous page number button------ */}

            <button
              className="previous-button"
              onClick={() =>
                PageNumber > 0
                  ? setPageNumber(PageNumber - 1)
                  : setPageNumber(PageNumber)
              }
            >
              {"<"}{" "}
            </button>

            {/* ----page number buttons---- */}

            <PaginationButtons
              pagesArray={pagesArray}
              setPageNumber={setPageNumber}
            />

            {/* -----next page number button------ */}

            <button
              className="next-button"
              onClick={() =>
                PageNumber < totalPages - 1
                  ? setPageNumber(PageNumber + 1)
                  : setPageNumber(PageNumber)
              }
            >
              {">"}{" "}
            </button>
          </div>

          <div className="current-page-number">
            <span>PAGE : {PageNumber + 1}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaginationButtons = ({ pagesArray, setPageNumber }) => {
  return (
    <>
      {pagesArray.map((pages) => {
        return (
          <button
            className="page-number-button"
            value={pages}
            onClick={() => {
              setPageNumber(pages);
            }}
          >
            {pages + 1}
          </button>
        );
      })}
    </>
  );
};
// ---- creating a product form----

const NewProductForm = ({ setLoading, ProductsRefresh }) => {
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    ProductsRefresh();
  }, [ProductsRefresh]);

  const addNewProductHandler = (data, e) => {
    setLoading(true);
    e.target.reset();
    console.log("data for new product", data);

    const options = {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
    axios
      .post(
        "https://choco-wizard.herokuapp.com/products/newproduct",
        data,
        options
      )
      .then((res) => {
        if (res.data.flag == true) {
          console.log(
            "response data from local server all products by admin :",
            res.data
          );
          toast("New product added successfully!!!", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          ProductsRefresh();
          setLoading(false);
        } else {
          console.log("error in fetching data");
          toast("Error in adding new product successfully", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("error in fetching data", err);
        toast("Error in adding new product successfully", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        setLoading(false);
      });
  };

  return (
    <form className="new-product" onSubmit={handleSubmit(addNewProductHandler)}>
      <h4>New Product </h4>
      <div>
        <label>
          Name<sup>*</sup>
        </label>
        <input type="text" {...register("name")} required></input>
      </div>
      <div>
        <label>
          Price<sup>*</sup>
        </label>
        <input type="number" {...register("price")} required></input>
      </div>
      <div>
        <label>
          Image URL<sup>*</sup>
        </label>
        <input type="text" {...register("image")} required></input>
      </div>
      <div>
        <label>
          Description<sup>*</sup>
        </label>
        <textarea {...register("description")} rows="4" required></textarea>
      </div>
      <div>
        <input type="submit" value="ADD"></input>
      </div>
    </form>
  );
};

// ---- updating a product form----

const UpdateProductForm = ({
  setLoading,
  updateID,
  setupdateID,
  ProductsRefresh,
}) => {
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    ProductsRefresh();
  }, [ProductsRefresh]);

  const updateProductHandler = (data, e) => {
    setLoading(true);
    e.target.reset();
    console.log("update ID", updateID);
    console.log("new data for updation", data);

    const options = {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
    axios
      .patch(
        `https://choco-wizard.herokuapp.com/products/updateproduct/${updateID}`,
        data,
        options
      )
      .then((res) => {
        if (res.data.flag == true) {
          console.log("product updated successfully", res.data);
          toast("product updated successfully!!!", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          ProductsRefresh();
          setLoading(false);
          setupdateID("");
        } else {
          console.log("error in updating product");
          toast("error in updating product", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          setLoading(false);
          setupdateID("");
        }
      })
      .catch((err) => {
        console.log("error updating the product", err);
        setLoading(false);
        setupdateID("");
      });
  };

  return (
    <form
      className="update-product"
      onSubmit={handleSubmit(updateProductHandler)}
    >
      <h4>Update Product</h4>
      <h4>(select one to update)</h4>
      <div className="ID">
        <label>ID selected</label>
        <input readOnly value={updateID}></input>
      </div>
      <div>
        <label>
          Name<sup>*</sup>
        </label>
        <input type="text" {...register("name")} required></input>
      </div>
      <div>
        <label>
          Price<sup>*</sup>
        </label>
        <input type="number" {...register("price")} required></input>
      </div>
      <div>
        <label>
          Image URL<sup>*</sup>
        </label>
        <input type="text" {...register("image")} required></input>
      </div>
      <div>
        <label>
          Description<sup>*</sup>
        </label>
        <textarea {...register("description")} rows="4" required></textarea>
      </div>
      <div>
        <input type="submit" value="UPDATE"></input>
      </div>
    </form>
  );
};

const Orders = ({ Allorders, OrdersRefresh }) => {
  // const [Allorders, setAllorders] = useState([]);
  const [requiredOrder, setrequiredOrder] = useState([]);
  const [flag, setflag] = useState(false);
  const [disable, setdisable] = useState(false);

  const options = {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };

  // ----getting all orders by admin----

  useEffect(() => {
    OrdersRefresh();
  }, [OrdersRefresh]);

  const SummaryHandler = (id) => {
    const requiredOrder = Allorders.filter((item) => item._id == id);

    setrequiredOrder(requiredOrder);
  };

  // ----dispatching an order by ADMIN----

  const DispatchHandler = (ID) => {
    console.log("dispatch handler alert >>>", ID);

    axios
      .patch(
        `https://choco-wizard.herokuapp.com/orders/dispatch/${ID}`,
        options
      )
      .then((res) => {
        console.log("Order dispatched successfully", res);
        toast("Order dispatched successfully!!!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        OrdersRefresh();
      })
      .catch((err) => {
        console.log("error in dispatching order", err);
        toast("Order dispatched successfully!!!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
  };

  return (
    <div id="orders">
      <h1>{"ORDERS"}</h1>

      {Allorders.length <= 0 ? (
        <div className="no-orders">
          <img
            src={require("../../media/orders.png").default}
            alt="cart-pic"
          ></img>
          <h1>{"No orders were made"}</h1>
        </div>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Orderd by</th>
              <th>Email</th>
              <th>Orderd on</th>
              <th>Summary</th>
              <th>total price (₹)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Allorders.map((item, index) => {
              return (
                <tr key={item._id}>
                  <td>{item.orderid}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{new Date(item.timestamp).toDateString()}</td>
                  <td>
                    <button
                      value={item._id}
                      onMouseOver={(ele) => {
                        SummaryHandler(ele.target.value);
                        setflag(true);
                      }}
                    >
                      View
                    </button>
                  </td>
                  <td>{item.totalprice}</td>
                  <td>
                    {item.dispatch ? (
                      <span style={{ color: "green" }}>{"Dispatched"}</span>
                    ) : (
                      <span style={{ color: "orange" }}>{"Processing"}</span>
                    )}
                  </td>
                  <td>
                    {item.dispatch === false ? (
                      <button
                        value={item._id}
                        onClick={(e) => {
                          DispatchHandler(e.target.value);
                          setdisable(true);
                        }}
                        disabled={disable}
                      >
                        {disable ? "N/A" : "dispatch"}
                      </button>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {console.log("required order summary ::>>", requiredOrder)}
      <div
        className="summary-div"
        style={{ display: flag ? "inline-block" : "none" }}
      >
        <button onClick={() => setflag(false)}>X</button>
        <table>
          {!requiredOrder[0]
            ? ""
            : requiredOrder[0].summary.map((order, i) => {
                return (
                  <tbody>
                    <tr>
                      <td className="field">ID</td>
                      <td className="data">{order._id}</td>
                    </tr>
                    <tr>
                      <td className="field">name</td>
                      <td className="data">{order.name}</td>
                    </tr>
                    <tr>
                      <td className="field">price</td>
                      <td className="data">{order.price}</td>
                    </tr>
                    <tr style={{ marginBottom: "1rem" }}>
                      <td className="field">quantity</td>
                      <td className="data">{order.quantity}</td>
                    </tr>
                  </tbody>
                );
              })}
        </table>
      </div>
    </div>
  );
};
