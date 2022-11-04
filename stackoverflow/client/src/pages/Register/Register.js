import React from 'react';
import {useState, useEffect} from 'react'
import './Register.css';
import { useNavigate } from 'react-router-dom'
import TagInput from '../../components/TagInput/TagInput';

function Register(){
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [nickname, setNickname] = useState('')
    const [position, setPosition] = useState('')
    const [experience, setExperience] = useState('')
    const [stack, setStack] = useState([])
    const [step, setStep] = useState(1)
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate();

    useEffect(()=> {
        if(localStorage.getItem('token')){
            navigate('/')
        }
    }, [])

    async function registerUser(event){
        console.log(event, event.target)
        event.preventDefault()
        const response = await fetch('http://localhost:1337/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name, 
                surname,
                email,
                password,
                nickname,
                position, 
                experience,
                stack,
                rating: {
                    questions: 0,
                    answers: 0,
                    liked: 0,
                    accepted: 0
                }
              })
        })
        const data = await response.json()
        if(data.status === 'ok'){
            localStorage.setItem('token', data.token)
            navigate('/')
        } else{
            setErrorMessage('Something went wrong. Please try again')
        }
    }

    function nextHandler(){
        let inputs = document.querySelectorAll('.register-input')
        let isValid = true
        inputs.forEach(input => {
            input.checkValidity()
            if(!input.checkValidity()){
                isValid = false;
                input.classList.add('error')
            } else{
                input.classList.remove('error')
            }
        });
        if(isValid){
            setStep(step + 1)
        }
    }

    return(
        <div>
            <div className="register-container">
                <div className="title">
                    {(step === 2 || step === 3) && <button className="back-btn" type="button" onClick={() => setStep(step-1)}>←</button>}
                    <h1>Create an account</h1>
                </div>
                <form className="register-form" onSubmit={registerUser}>
                    {step === 1 && <div>
                        <input
                            className="custom-input register-input"
                            placeholder="Name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            className="custom-input register-input"
                            placeholder="Surname"
                            type="text"
                            required
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                        />
                        <input
                            className="custom-input register-input"
                            placeholder="Email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className="custom-input register-input"
                            placeholder="Password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div> }
                    {step === 2 && <div> 
                        <input
                        className="custom-input margin-top"
                        placeholder="Nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        />
                        <input
                            className="custom-input"
                            placeholder="Working Position"
                            type="text"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                        />
                        <input
                            className="custom-input"
                            placeholder="Years of working experience"
                            min="0"
                            type="number"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                        />
                    </div>}
                    {(step === 1 || step === 2) && <button className="submit-btn" type="button" onClick={nextHandler}>Next</button>}
                    {step === 3 && <div className='stack-container'>
                        <label className='stack-label'>Preferred programming languages and technologies</label>
                        <TagInput chosenTags={stack} setChosenTags={setStack}></TagInput>
                        {errorMessage && <div className='error-message'>{errorMessage}</div>}
                        <input type="submit" value="Sign up" className="submit-btn"/>
                    </div>}
                </form>
            </div>
        </div>
    )
}

export default Register;