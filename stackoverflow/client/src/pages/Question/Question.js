import React, {useState, useEffect} from "react";
import {decodeToken} from 'react-jwt'
import { useParams } from 'react-router-dom'
import './Question.css';
import Answer from "../../components/Answer/Answer";
import RichTextEditor from "../../components/RichTextEditor/RichTextEditor";
import QuestionSummary from '../../components/QuestionSummary/QuestionSummary';
import arrow from '../../images/arrow.svg'

function Question(props){
    const params = useParams();
	const [question, setQuestion] = useState({rating: {}, nickname: ''}) 
	const [access, setAccess] = useState(false)
	const [isOwner, setIsOwner] = useState(false)
	const [answer, setAnswer] = useState('')
	const [userId, setUserId] = useState('')
	const [activePage, setActivePage] = useState(1)
	const [showPagination, setShowPagination] = useState(false)
	const [answersArr, setAnswersArr] = useState([])

    async function getQuestion() {
		const req = await fetch('http://localhost:1337/questions/'+params.questionId, {
			headers: {
				'x-access-token': localStorage.getItem('token') ? localStorage.getItem('token') : '',
			}
		})
		const data = await req.json()
		if (data.status === 'ok') {
			setQuestion(data.question)
            setIsOwner(data.access)
			if(data.question.answers.length < 4){
				setShowPagination(false)
				setAnswersArr(data.question.answers)
			} else {
				setShowPagination(true)
				setActivePage(0)
				getAnswers(0)
			}
		} else {
			//error 
		}
	}

    useEffect(() => {
		getQuestion()
		const token = localStorage.getItem('token')
		if (token) {	
			const user = decodeToken(token)
			if (!user) {
				localStorage.removeItem('token')
			} else {
				setAccess(true)
				setUserId(user._id)
			}
		} else {
			setUserId('')
		}
	}, [])

	async function sendAnswer(){
		const req = await fetch('http://localhost:1337/questions/' + question._id + '/answer', {
			method: 'POST',
			headers: {
			    'Content-Type': 'application/json',
				'Authorization': 'Bearer' + localStorage.getItem('token')
			},
			body: JSON.stringify({answer})
		})
		const data = await req.json()
		if (data.status === 'ok') {
			setQuestion(data.question)
			await fetch('http://localhost:1337/users/updateRating/' + userId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({field: 'answers'}) 		                   
			})
		} else {
			//error 
		}
	}

	async function getAnswers(chunk){
		const req = await fetch('http://localhost:1337/questions/' + params.questionId + '/answers', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({chunk})
		})
		const data = await req.json()
		if (data.status === 'ok') {
			setAnswersArr(data.answers)
		} else {
			//error 
		}
	}

	function next(){
		let active = activePage + 1
		setActivePage(active)
		getAnswers(active)
	}

	function prev(){
		let active = activePage - 1
		setActivePage(active)
		getAnswers(active)
	}

	function closeQuestion(){
		// let questionTmp = question
        // questionTmp.isClosed = true
        // setQuestion(questionTmp)
		// getQuestion()
	}

    return(
        <div className="question-page-container">
			{question && <QuestionSummary question={question}></QuestionSummary>}
			<div>
				<h2>Answers</h2>
				{answersArr && <div>{answersArr.map((answer, index)=>{ return <Answer key={index} 
				rating={answer.rating} 
				answer={answer.answer} 
				user={answer.user} 
				answerId={answer._id} 
				questionId={question._id} 
				questionUserId={question.user} 
				isClosed={question.isClosed}
				isAccepted={answer.isAccepted}
				isOwner = {isOwner}
				votedUsers={answer.voteUserIds}
				close={closeQuestion}></Answer> })}</div>}
				{showPagination && <div className="pagination">
					<button className="prev simple-btn" onClick={prev} disabled={activePage==0}><img src={arrow}/></button>
					<p>{activePage+1} of {Math.ceil(question.answers.length/5)}</p>
					<button className="next simple-btn" onClick={next} disabled={activePage==Math.ceil(question.answers.length/5)-1}><img src={arrow}/></button>
				</div>}
			</div>
			{access && !question.isClosed && <div className="answer-input"> 
				<RichTextEditor text={answer} sendDataToParentCmp={setAnswer}/>
				<button className="submit-btn btn-margin" onClick={sendAnswer}>Send</button>
			</div>}
        </div>
    )
}

export default Question