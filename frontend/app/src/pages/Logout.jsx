import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies()

const Logout = () => {    
    const navigate = useNavigate()

    useEffect(() => {
        const logout = () => {
            cookies.remove('token')
            navigate('/login')
        }

        logout()
    }, [navigate])


    return;
}

export default Logout;