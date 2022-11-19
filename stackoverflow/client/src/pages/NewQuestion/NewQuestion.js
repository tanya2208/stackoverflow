import React, { useState, useEffect } from "react";
import '../../../node_modules/draft-js/dist/Draft.css';
import RichTextEditor from "../../components/RichTextEditor/RichTextEditor";
import {decodeToken} from 'react-jwt'
import { useNavigate } from 'react-router-dom'
import TagInput from "../../components/TagInput/TagInput";
import './NewQuestion.css'

function NewQuestion(){
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
	const navigate = useNavigate();
    const [chosenTags, setChosenTags] = useState([])
    const [userId, setUserId] = useState('')

    useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			const user = decodeToken(token)
			if (!user) {
				localStorage.removeItem('token')
				navigate('/login')
			} else {
                setUserId(user._id)
            }
		} else {
			navigate('/login')
		}
	}, [])

    const sendDataToParentCmp = (description) => {
        setDescription(description)
    }

    async function handleSubmit(event){
        event.preventDefault()
        if(validateForm()){
            const response = await fetch('http://localhost:1337/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    title,
                    description,
                    tags: chosenTags
                })
            })
            const data = await response.json()
            if(data.question){
                const req = await fetch('http://localhost:1337/users/updateRating/' + userId, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({field: 'questions'})
                    })
                const userData = await req.json()
                if (userData.status !== 'ok') {
                    console.log(userData.error)
                } 
                navigate('/questions/'+data.question._id)
            } else{
                console.log(data.error)
            }
        }
    }

    function validateForm(){
        let isValid = true
        if(title == ''){
            document.querySelector('.title-input').classList.add('error')
            isValid = false
        } else {
            document.querySelector('.title-input').classList.remove('error')
        }
        if(description == ''){
            document.querySelector('.editor').classList.add('error')
            isValid = false 
        } else {
            document.querySelector('.editor').classList.remove('error')
        }
        return isValid
    }

    function redirectBack(){
        navigate('/')
    }

    const sendTags = (tags) => {
        console.log(tags)
        setChosenTags(tags)
    };

    return(
        <div className="new-question-container">
            <h1>Create New Question</h1>
            <form onSubmit={handleSubmit}>
                <input className="title-input" placeholder="Title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <div className="editor">
                    <RichTextEditor text={description} sendDataToParentCmp={sendDataToParentCmp}/>
                </div>
                <TagInput sendTags={sendTags} border={false}></TagInput>
                <div className="buttons">
                    <button type="button" className="simple-btn" onClick={redirectBack}>Cancel</button>
                    <input type="submit" value="Save" className="submit-btn"/>
                </div>
            </form>
        </div>
       
    )
}

export default NewQuestion