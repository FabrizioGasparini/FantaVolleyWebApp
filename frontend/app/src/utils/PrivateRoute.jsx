import { Outlet, Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "../api/axios";

const cookies = new Cookies()


const PrivateRoutes = () => {
    const token = cookies.get('token')
    
    const verifyToken = async () => {
        if (token != undefined) {
            try {
                const result = await axios.post('/api/v1/auth/read/user',
                    JSON.stringify({ token }),
                    {
                        headers: { 'Content-Type': 'application/json' }
                    }
                );

                return result;
            }
            catch
            {
                return false;
            }
        }
        else return false;
    };
    const isTokenValid = verifyToken(token)
    console.log(isTokenValid)
    return (
        isTokenValid != false ? <Outlet /> : <Navigate to="/login" />
    )
}

export default PrivateRoutes