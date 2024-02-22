import { Outlet, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useEffect } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies()

const PrivateRoutes = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const checkToken = async () => {
            try
            {  
                const token = cookies.get("token")

                axios.defaults.headers.common = { 'Authorization': `Bearer ${token}` }
                await axios.post('/api/v1/auth/user/read', {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })  
            } 
        catch (error)
        {
            console.error('Errore durante la verifica del token:', error);
            return navigate('/login')
        }
    }
    
    checkToken()
    }, [navigate])
    
    return (
        <Outlet/>
    )
}

export default PrivateRoutes