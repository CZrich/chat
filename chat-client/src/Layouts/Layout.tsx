import React from "react";
import {NavBar} from "../components/NavBar";
import { Footer } from "../components/Footer";
import { Outlet } from "react-router-dom";

type Props = {
  
};

export const  Layout= (props: Props)=> {
  return (
    <React.Fragment>

      <NavBar></NavBar>
        
        <Outlet></Outlet>
        <Footer></Footer>
    </React.Fragment>
  );
}