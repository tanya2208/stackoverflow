import React, {useState, useEffect} from "react";
import {decodeToken} from 'react-jwt'
import { useNavigate, useParams } from 'react-router-dom'
import './Question.css';
import { convertToHTML } from 'draft-convert'
import { convertFromRaw } from 'draft-js'
import Tag from "../../components/Tag/Tag";
import RichTextEditor from "../../components/RichTextEditor/RichTextEditor";

function Question(props){
	const navigate = useNavigate();
    const params = useParams();
	const [question, setQuestion] = useState({rating: {}, nickname: ''}) 
	const [access, setAccess] = useState(false)
	const [isOwner, setIsOwner] = useState(false)
	const [answer, setAnswer] = useState('')
	const [userId, setUserId] = useState('')

	const html = ''
    async function getQuestion() {
		const req = await fetch('http://localhost:1337/questions/'+params.questionId, {
			headers: {
				'x-access-token': localStorage.getItem('token') ? localStorage.getItem('token') : '',
			}
		})
		const data = await req.json()
		console.log('question data',data)
		if (data.status === 'ok') {
			setQuestion(data.question)
            setIsOwner(data.access)
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
			console.log(data.question)
		} else {
			//error 
		}
	}

    // async function saveHandler(){
    //     const req = await fetch('http://localhost:1337/users/update/:id', {
	// 		method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(user)
	// 	})
    //     const data = await req.json()
	// 	if (data.status === 'ok') {
	// 		setUser({...data.user})
	// 		setUserCopy({...data.user})
    //         setEditMode(false)
	// 	} else {
	// 		console.log(data.error)
	// 	}
    // }
	function deleteTag(){
        console.log('test')
    }

    return(
        <div>
			<div className="full-question">
            	<div className="question-title">{question.title}</div>
                {question.answers && <div className="answers">{question.answers.length} Answers</div>}
				{question.description && <div className="question-description" dangerouslySetInnerHTML={{__html: convertToHTML(convertFromRaw(JSON.parse(question.description)))}}></div>}
				{question.tags && <div>{question.tags.map((tag, index)=>{ return <Tag key={index} tag={tag} showCloseBtn={false}></Tag> })}</div>}
			</div>
			{access && <div className="answer-input"> 
				<RichTextEditor text={answer} sendDataToParentCmp={setAnswer}/>
				<button onClick={sendAnswer}>Send Answer</button>
			</div>}
			<div className="answers">
				{question.answers && <div>{question.answers.map((answer, index)=>{ return <div key={index}>{answer.answer}</div> })}</div>}
			</div>
        </div>
    )
}

export default Question