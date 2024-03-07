import { useState } from 'react';
import './Login.css';
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from '../../api/axios';
import Cookies from 'universal-cookie';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const cookies = new Cookies()

const LoginForm = ({ onClick }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')
    
    const [invisibleInput, setInvisibleInput] = useState('');

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(invisibleInput == '')
        {
            try {
                const response = await axios.post('/api/v1/auth/login', { username: username, password: password });
                const token = response.data.user.token

                cookies.set("token", token, {path:"/"})
                axios.defaults.headers.common = { 'Authorization': `Bearer ${token}` }

                return navigate('/')
            } catch (error) {
                setError(error.response.data.error.message)
                console.error('Errore durante il login:', error);
            }
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
                    <input type="text" className="invisible-input" style={{display: 'none'}} value={invisibleInput} onChange={(e) => setInvisibleInput(e.target.value)}/>
                </div>
                <button type="submit" className="submit">Login</button>
                <p className="error-message">{error}</p>
                <span className="separator"></span>
                <p className='new-user'>Sei un nuovo utente?</p>
                <div className="register">
                    <button onClick={onClick}>Registrati</button>
                </div>
            </form>
        </div>
    );
}

LoginForm.propTypes = {
    onClick: PropTypes.func.isRequired
};

export default LoginForm;