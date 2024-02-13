import { useState } from 'react';
import './Login.css';
import { faUser, faLock, faAt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from '../../api/axios';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/v1/auth/register',
                JSON.stringify({ username, email, password }),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            console.log(response.data);
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
                            name="username"
                            id="username"
                            placeholder="Username"
                            required
                            autoComplete="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <FontAwesomeIcon className="icon" icon={faUser} />
                    </div>
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
            <p className='new-user'>Hai già un account?</p>
            <div className="register">
                <a href="#">Accedi</a>
            </div>
        </div>
    );
}

export default RegisterForm;