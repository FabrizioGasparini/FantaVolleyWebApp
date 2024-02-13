import { useState } from 'react';
import './Login.css';
import { faLock, faAt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from '../../api/axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies()

const COOKIE_PATH = "/"
const COOKIE_NAME = "token"

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/v1/auth/login',
                JSON.stringify({ email, password }),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            console.log(response.data);
            const token = response.data.user.token

            cookies.set(COOKIE_NAME, token, {path: COOKIE_PATH})
        } catch (error) {
            setError(error.response.data.error.message)
            console.error('Errore durante il login:', error);
        }
    };

    return (
        <div className="login-frame">
            <h1 className="hl">Benvenuto!</h1>
            <p className="st">Inserisci i tuoi dati per accedere!</p>
            <form className="form" onSubmit={handleSubmit}>
                <div className="inputs">                    
                    <div className="input-box">
                        <input
                            type="text"
                            name="email"
                            id="email"
                            placeholder="Email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <FontAwesomeIcon className="icon" icon={faAt} />
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            name="pwd"
                            id="pwd"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}/>
                        <FontAwesomeIcon className="icon" icon={faLock} />
                    </div>
                    <div className="forgot">
                        <a href="#">Password Dimenticata</a>
                    </div>
                </div>
                <button type="submit" className="submit">Login</button>
                <p className="error-message">{error}</p>
            </form>
            <span className="separator"></span>
            <p className='new-user'>Sei un nuovo utente?</p>
            <div className="register">
                <a href="#">Registrati</a>
            </div>
        </div>
    );
}

export default LoginForm;