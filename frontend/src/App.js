import "./App.css";
import 'react-toastify/dist/ReactToastify.css';

import {Header} from "./components/layouts/header"
import {Body} from "./components/layouts/body"
import { ToastContainer,Zoom } from 'react-toastify';
import {
  BrowserRouter as Router,
} from "react-router-dom";
// import { sample } from "./sample";
export default function App() {
  return (

      <Router>
        <Header />
        <Body />
        <ToastContainer transition={Zoom} toastStyle={{ backgroundColor: "rgb(36, 1, 1)" ,boxShadow:"0 0 4px 2px white",color:"white",fontWeight:"bold",width:"290px",fontSize:"0.8rem" }} />
      </Router>
  );
}





