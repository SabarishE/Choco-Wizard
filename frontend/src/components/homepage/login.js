import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import { useForm } from "react-hook-form";
import { LoginAction } from "../../redux/actions/account_action";

import { useSelector, useDispatch } from "react-redux";
export const Login = ({ setflag, flag }) => {
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm();
  const history = useHistory();
  const [Load, setLoad] = useState(false);
  const afterLogin = (user) => {
    console.log("login success !!!", user);
    dispatch(LoginAction(true, user.name));
    setLoad(false);
    localStorage.setItem("name", user.name);
    localStorage.setItem("email", user.email);
    localStorage.setItem("token", user.token);
    localStorage.setItem("admin", user.admin);

    toast(`Welcome back ${user.name}`, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });

    if (user.admin === true) {
      history.push("/adminpage");
      return window.location.reload();
    } else {
      return history.push("/myaccount");
    }
  };

  const loginHandler = (data, e) => {
    console.log("login alert", data);

    setLoad(true);
    e.target.reset();

    const options = {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };

    axios
      .post("https://choco-wizard.herokuapp.com/accounts/login", data, options)
      .then((res) => {
        afterLogin(res.data);
      })
      .catch((err) => {
        console.log("error in payment", err);
        setLoad(false);
        toast("Invalid credentials", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
  };

  const flipcardHandler = () => {
    setflag(!flag);
  };

  return (
    <div
      className="login"
      style={{
        backgroundImage: `url(${require("../../media/form.jpg").default})`,
      }}
    >
      <div className="loader">
        <ClipLoader color={"white"} loading={Load} size={25} />
      </div>

      <form onSubmit={handleSubmit(loginHandler)}>
        <div>
          <label>Email</label>
          <input type="email" {...register("email")} required></input>
        </div>
        <div>
          <label>Password</label>
          <input type="password" {...register("password")} required></input>
        </div>
        <div>
          <input type="submit" value="Log in"></input>
        </div>
      </form>
      <button onClick={flipcardHandler}>Sign up?</button>
    </div>
  );
};
