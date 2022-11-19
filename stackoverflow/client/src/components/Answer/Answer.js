import {React, useEffect, useState} from "react";
import './Answer.css';
import { convertToHTML } from 'draft-convert'
import {decodeToken} from 'react-jwt'
import { convertFromRaw } from 'draft-js'
import arrowUp from '../../images/arrow-up-green.svg'
import accept from '../../images/accept.svg'

function Answer(props){
	const [user, setUser] = useState('') 
	const [currentUser, setCurrentUser] = useState('') 
	const [rating, setRating] = useState(props.rating) 
	const [isVoted, setIsVoted] = useState(false) 
    const [isClosed, setIsClosed] = useState(props.isClosed)
    const [isAccepted, setIsAccepted] = useState(props.isAccepted)

    useEffect(() => {
		getUser()
	}, [])

    async function getUser() {
        const token = localStorage.getItem('token')
		const req = await fetch('http://localhost:1337/users/'+props.user, {
			headers: {
				'x-access-token': token ? token : '',
			}
		})
		const data = await req.json()
		if (data.status === 'ok') {
			setUser(data.user)
            if(token){
                setCurrentUser(decodeToken(token)._id)
                props.votedUsers.forEach(user => {
                    console.log('user', user, 'current', decodeToken(token)._id)
                    if(user === decodeToken(token)._id){
                        setIsVoted(true)
                    }
                });
            }
		} else {
			alert(data.error)
		}
	}

    async function increaseRating(){
        changeRating('increase')
    }

    async function changeRating(operation){
        const req = await fetch('http://localhost:1337/questions/' + props.questionId + '/updateAnswerRating/' + props.answerId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({operation, votedUser: currentUser})
        })
        const answerData = await req.json()
        if(answerData.status == 'ok'){
            setRating(answerData.answer.rating)
            setIsVoted(true)
            await fetch('http://localhost:1337/users/updateRating/' + user._id, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({field: 'liked', answerRating: props.rating})                    
			})
        }
    }

    async function acceptAnswer(){
        const req = await fetch('http://localhost:1337/questions/' + props.questionId + '/close', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({answerId: props.answerId})
        })
        const questionData = await req.json()
        if(questionData.status == 'ok'){
            setIsClosed(questionData.question.isClosed)
            setIsAccepted(questionData.answer.isAccepted)
            await fetch('http://localhost:1337/users/updateRating/' + user._id, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({field: 'accepted'})                    
			})
            props.close()
        } 
        props.close()

    }

    return <div className="answer-wrapper">
        {currentUser && <div className="btn-section">
            {props.isOwner && <button className="accept-button" disabled={isClosed} onClick={acceptAnswer}><img src={accept}/></button>}
            <button disabled={isVoted} onClick={increaseRating}><img src={arrowUp}/></button>
            <div className="rating">{rating}</div>
        </div>
        }
        <div className={isAccepted ? 'answer-container accepted' : 'answer-container'}>
            <div dangerouslySetInnerHTML={{__html: convertToHTML(convertFromRaw(JSON.parse(props.answer)))}}></div>
            <a className="user-link align-right" href={'/users/' + props.user}>{user.nickname ? user.nickname : user.name + ' ' + user.surname}</a>
        </div>
    </div>
}

export default Answer
