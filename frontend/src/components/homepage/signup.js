import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import { useForm } from "react-hook-form";

export const Signup=({setflag,flag})=>{

    const { register, handleSubmit } = useForm();
    const history = useHistory();
    const [Load, setLoad] = useState(false);
    const afterSignup = (user) => {
      console.log("signup success !!!", user);
      setLoad(false);
      toast("Sign up success, please login", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
  
    };
  
    const signupHandler = (data, e) => {
      console.log("signup alert", data);

      setLoad(true);
      e.target.reset();
  
      const options = {
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      };
  
      axios
      .post("http://localhost:5000/accounts/signup",data, options)
      .then((res) => {
        console.log("signup success !!!", res);
        afterSignup(res);
      })
      .catch((err) => {
        console.log("error in payment", err);
        setLoad(false);
        toast("Invalid credentials", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
    };

    const flipcardHandler=()=>{
        setflag(!flag)
    }

    return (
        
      <div className="Signup" style={{backgroundImage:`url(${require("../../media/form.jpg").default})`}} >
        <div className="loader">
        <ClipLoader color={"white"} loading={Load} size={25} />
        </div>
        <form onSubmit={handleSubmit(signupHandler)}>
        <div>    
                <label>Name</label>
                <input type="text" {...register("name")} required></input>
            </div>
            <div>    
                <label>Email</label>
                <input type="email" {...register("email")} required></input>
            </div>
            <div>    
                <label>Password</label>
                <input type="password" {...register("password")} required></input></div>
            <div>    
                <input type="submit" value="Sign up"></input>
            </div>
        </form>
        <button onClick={flipcardHandler}>Log in?</button>
        </div>
    )
}