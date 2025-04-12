
import {NavBar} from "../components/NavBar";
import { Footer } from "../components/Footer";
import { Outlet } from "react-router-dom";
import  { useUser } from "../context/UserContext";
type Props = {
  
};

export const  Layout= (props: Props)=> {
  const { name } = useUser();
  return (
    <>
    {/* Solo mostrar NavBar si ya ingresó su nombre */}
    {name && <NavBar />}

    <Outlet />

    <Footer />
  </>
  );
}