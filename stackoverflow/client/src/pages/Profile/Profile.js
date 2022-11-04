import React, {useEffect, useState} from "react";
import {decodeToken} from 'react-jwt'
import { useParams } from 'react-router-dom'
import './Profile.css';
import QuestionSummary from "../../components/QuestionSummary/QuestionSummary";
import TagInput from "../../components/TagInput/TagInput";
import Tag from "../../components/Tag/Tag";
import userAvatar from '../../images/user.png'

function Profile(props){
    const params = useParams();
	const [user, setUser] = useState({rating: {}, nickname: ''}) 
	const [userCopy, setUserCopy] = useState({})
	const [editMode, setEditMode] = useState(false)
	const [access, setAccess] = useState(false)
	const [questions, setQuestions] = useState([])
    const [stack, setStack] = useState([])

    async function getUserQuestions(){
        const req = await fetch('http://localhost:1337/users/'+params.userId + '/questions')
        const data = await req.json()
		if (data.status === 'ok') {
            setQuestions(data.questions)
        }
    }

    async function getUserData() {
		const req = await fetch('http://localhost:1337/users/'+params.userId, {
			headers: {
				'x-access-token': localStorage.getItem('token') ? localStorage.getItem('token') : '',
			}
		})
		const data = await req.json()
		if (data.status === 'ok') {
			setUser(data.user)
			setUserCopy(data.user)
            setAccess(data.access)
            getUserQuestions()
            setStack(data.user.stack)
		} else {
			alert(data.error)
		}
	}

    useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			const user = decodeToken(token)
			if (!user) {
				localStorage.removeItem('token')
			}
		} 
		getUserData()
	}, [])

    const handleInputChange = e => {
        const value = e.target.value;
        const name = e.target.name
        setUser(prevState => ({
                ...prevState,
                [name] : value
        }));
    }

    const cancelHandler = () => {
        setUser({...userCopy})
        setEditMode(false)
    }

    async function saveHandler(){
        setUser((prevState) => { return {...prevState, stack} })
        const req = await fetch('http://localhost:1337/users/update/' + params.userId, {
			method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
		})
        const data = await req.json()
		if (data.status === 'ok') {
			setUser({...data.user})
			setUserCopy({...data.user})
            setEditMode(false)
		} else {
			console.log(data.error)
		}
    }

    return(
        <div>
            {user && 
            <div className="profile-wrapper">
                <div className="personal-info-container">
                    <div className="personal-info">
                        <div className="avatar"><img src={userAvatar} alt="User avatar"/></div>
                        <div className="user-name">{user.name} {user.surname}</div>
                        <div className="user-nickname grey-field">{user.nickname}</div>
                        <div className="user-email grey-field">{user.email}</div>
                        <div className="user-position">{user.position}</div>
                        {user.experience && <div className="user-experience grey-field">{user.experience} year(s) of experience</div>}
                        {user.stack && <div className="user-stack">
                            {user.stack.map((tag, index)=>{
                                return <Tag key={index} tag={tag} showCloseBtn={false}></Tag>
                            })}
                        </div>}  
                        {access && <button className="edit-btn" onClick={() => setEditMode(true)}>Edit Profile</button>}
                    </div>
                </div>
                <div className="activity-info">
                    <div className="stat-wrapper">
                        <div className="stat-item">
                             <div className="stat-item-value">{user.rating.questions ? user.rating.questions : 0}</div>
                            <div className="stat-item-name">Questions</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-item-value">{user.rating.answers ? user.rating.answers : 0}</div>
                            <div className="stat-item-name">Answers</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-item-value">{user.rating.liked ? user.rating.liked : 0}</div>
                            <div className="stat-item-name">Liked</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-item-value">{user.rating.accepted ? user.rating.accepted : 0}</div>
                            <div className="stat-item-name">Accepted</div>
                        </div>
                    </div>
                    
                    {questions.length > 0 &&
                        <div className="user-questions">
                            <h2>Questions</h2>
                            {questions.map((item,index)=>{
                                item.user = user
                                return <QuestionSummary key={index} question={item}></QuestionSummary>
                            })}
                        </div>
                    }
                </div>
            </div>}
            {editMode && <div>
                <div className="edit-user-modal">
                    <h2 className="edit-title">Edit Profile</h2>
                    <input name="name" value={user.name} placeholder="Name" onChange={handleInputChange} className="custom-input"/>
                    <input name="surname" value={user.surname} placeholder="Surname" onChange={handleInputChange} className="custom-input"/>
                    <input name="email" value={user.email} placeholder="Email" onChange={handleInputChange} className="custom-input"/>
                    <input name="nickname" value={user.nickname} placeholder="Nickname" onChange={handleInputChange} className="custom-input"/>
                    <input name="position" value={user.position} onChange={handleInputChange} placeholder="Working Position" className="custom-input"/>
                    <input name="experience" value={user.experience} type="number" onChange={handleInputChange} placeholder="Years of experience" className="custom-input"/>
                    {/* <div className="edit-from-tag-container">
                        <TagInput setChosenTags={setStack} stack={stack} showTags={true}></TagInput>
                    </div> */}
                    <div className="buttons">
                        <button className="simple-btn" onClick={cancelHandler}>Cancel</button>
                        <button className="submit-btn" onClick={saveHandler}>Save</button>
                    </div>
                </div>
                <div className="backdrop"></div>
            </div>}
        </div>
    )
}

export default Profile