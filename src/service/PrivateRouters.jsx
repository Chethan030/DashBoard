import { Navigate } from "react-router-dom";

function PrivateRouters({children}){
    const token=localStorage.getItem('token')
    return token ? children : Navigate('/login')
}
export default PrivateRouters;