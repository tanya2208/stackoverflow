import React, {useEffect, useState} from "react"
import {Link, useLocation} from 'react-router-dom'
import {decodeToken} from 'react-jwt'
import userAvatar from '../../images/user.png'
import './Header.css'

function Header(props){
    const [userId, setUserId] = useState('')
    const location = useLocation()

    useEffect(() => {
        const token = localStorage.getItem('token')
		if (token) {
			const user = decodeToken(token)
			if (!user) {
				localStorage.removeItem('token')
                setUserId('')
			} else {
				setUserId(user._id)
			}
		} else {
			setUserId('')
		}
    }, [])

    async function logOutHandler(){
        const response = await fetch('http://localhost:1337/users/logout', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer' + localStorage.getItem('token')
            },
        })
        const data = await response.json()
        if(data.status === 'ok'){
            localStorage.removeItem('token')
            window.location.reload()
        }
    } 

    return(
        <header className="header">
            <Link className="header-logo" to="/"><span>Stack</span>Overflow</Link>
            <div className="header-btn-group">
                {!userId && location.pathname !== '/login' && <Link className="header-nav-link" to="/login">Log in</Link>}
                {!userId && location.pathname !== '/register' && <Link className="header-nav-link" to="/register">Sign up</Link>}
                {userId && <Link className="header-nav-link" to={'/users/' + userId}><div className="profile"><img src={userAvatar}/></div></Link>}
                {userId && <button className="logout-btn" onClick={logOutHandler}>Logout</button>}
            </div>
        </header>
    )
}

export default Header