import React from "react";
import {useState, useEffect} from "react"
import './Login.css';
import { useNavigate } from 'react-router-dom'

function Login(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
	const navigate = useNavigate();

    useEffect(()=> {
        if(localStorage.getItem('token')){
            navigate('/')
        }
    }, [])

    async function handleSubmit(event){
        event.preventDefault()
        const response = await fetch('http://localhost:1337/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
            })
        })
        const data = await response.json()
        if(data.token){
            localStorage.setItem('token', data.token)
            window.location.href = '/'
        } else{
            setErrorMessage('Please check your email and password')
        }
    }

    return(
        <div>
            <div className="login-container">
                <h1>Login</h1>
                <h3>Hey, enter your details to get sign in to your profile</h3>
                <form className="login-form" onSubmit={handleSubmit}>
                    <input
                        className="custom-input"
                        placeholder="Enter email"
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="custom-input"
                        placeholder="Enter password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <input type="submit" value="Sign in" className="submit-btn"/>
                </form>
            </div>
        </div>
    )
}

export default Login;