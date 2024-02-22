import { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const Login = () => {
    const [isLogInActive, setIsLogInActive] = useState(true)
    
    const handleFormChange = () => {
        setIsLogInActive(!isLogInActive)
    }

    return (
        isLogInActive ? <LoginForm onClick={handleFormChange} /> : <RegisterForm onClick={handleFormChange} />
    );
}

export default Login;