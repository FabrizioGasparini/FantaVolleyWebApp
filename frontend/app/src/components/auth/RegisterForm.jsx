import { useState } from 'react';
import './Login.css';
import { faUser, faLock, faAt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from '../../api/axios';
import PropTypes from 'prop-types'
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';

const cookies = new Cookies()
const COOKIE_PATH = "/"
const COOKIE_NAME = "token"


const RegisterForm = ({ onClick }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('')
    
    const navigate = useNavigate()
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (password == confirmPassword)
            {                
                const response = await axios.post('/api/v1/auth/register', {username, email, password});
                
                const token = response.data.user.token

                cookies.set(COOKIE_NAME, token, { path: COOKIE_PATH, httpOnly: true })
                return navigate('/')
            }
            else setError("Le password non corrispondono")
        } catch (error) {
            setError(error.response.data.error.message)
            console.error('Errore durante il login:', error);
        }
    };

    return (
        <div className="login-frame">
            <h1 className="hl">Benvenuto!</h1>
            <p className="st">Crea il tuo account!</p>
            <form className="form" onSubmit={handleSubmit}>
                <div className="inputs">                    
                    <div className="input-box">
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Username"
                            required
                            autoComplete='username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <FontAwesomeIcon className="icon" icon={faUser} />
                    </div>
                    <div className="input-box">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email"
                            required
                            value={email}
                            autoComplete="email"
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
                            autoComplete='password'
                            onChange={(e) => setPassword(e.target.value)}/>
                        <FontAwesomeIcon className="icon" icon={faLock} />
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            name="confirm"
                            id="confirm"
                            placeholder="Conferma Password"
                            required
                            value={confirmPassword}
                            autoComplete='off'
                            onChange={(e) => setConfirmPassword(e.target.value)}/>
                        <FontAwesomeIcon className="icon" icon={faLock} />
                    </div>
                </div>
                <button type="submit" className="submit">Registrati</button>
                <p className="error-message">{error}</p>
                <span className="separator"></span>
                <p className='new-user'>Hai già un account?</p>
                <div className="register">
                    <button onClick={onClick}>Accedi</button>
                </div>
            </form>
        </div>
    );
}

RegisterForm.propTypes = {
    onClick: PropTypes.func.isRequired
};

export default RegisterForm;