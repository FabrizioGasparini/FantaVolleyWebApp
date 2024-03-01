import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/Sidebar"
import Cookies from "universal-cookie";
import axios from "../api/axios";
import './css/Account.css'
import { useNavigate } from "react-router-dom";

const cookies = new Cookies()

const Account = () => {
    const [user, setUser] = useState({})

    const navigate = useNavigate()

    useEffect(() => {
        const getUser = async () => {
            try {
                const token = cookies.get("token")

                axios.defaults.headers.common = { 'Authorization': `Bearer ${token}` }
                const response = await axios.post('/api/v1/auth/user/read', {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                setUser(response.data.user)
            }
            catch (error) {
                console.error('Errore durante la verifica del token:', error);
            }
            
        }
        
        getUser()
    }, [])

    const getRoleName = (role) => {
        switch (role) {
            case 'user':
                return 'UTENTE'
            
            case 'admin':
                return 'ADMIN'
            
            default:
                return 'NESSUNO'
        }
    }



    return (
        <Sidebar>
            <h1 className='header'>Account</h1>
            <div className="account-icon">
                <img src="https://cdn-icons-png.flaticon.com/512/4847/4847985.png" alt="" />
            </div>
            <div className="stats">
                <div className="stat">
                    <div className="info title">Username</div>
                    <div className="info"><b>{user.username}</b></div>
                </div>
                <div className="stat">
                    <div className="info title">Email</div>
                    <div className="info"><b>{user.email}</b></div>
                </div>
                <div className="stat">
                    <div className="info title">ID Utente</div>
                    <div className="info"><b>{user.id}</b></div>
                </div>
                <div className="stat">
                    <div className="info title">Ruolo</div>
                    <div className="info"><b>{getRoleName(user.role)}</b></div>
                </div>
                <div className="stat large" onClick={() => {navigate('/logout')}}>
                    <div className="info red"><b>LOGOUT</b></div>
                </div>
            </div>
        </Sidebar>
    )
}

export default Account;