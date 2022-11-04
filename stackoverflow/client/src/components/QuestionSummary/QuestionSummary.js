import React from "react"
import { convertToHTML } from 'draft-convert'
import { convertFromRaw } from 'draft-js'
import {Link} from 'react-router-dom'
import Tag from '../Tag/Tag'
import './QuestionSummary.css'

function QuestionSummary(props){

    return(
        <div className="question-container">
            <Link to={'/questions/' + props.question._id} className="question-title">{props.question.title}</Link>
            <div className="question-description" dangerouslySetInnerHTML={{__html: convertToHTML(convertFromRaw(JSON.parse(props.question.description)))}}></div>
            {props.question.tags && <div className="tags-container"> {props.question.tags.map((tag, index)=>{return <Tag key={index} tag={tag} showCloseBtn={false}></Tag>})} </div>}
            <div className="display-flex">
                {props.question.answers && <div className="answers">{props.question.answers.length} Answers</div>}
                <a className="user-link" href={'/users/' + props.question.user._id}>{props.question.user.nickname ? props.question.user.nickname : props.question.user.name + ' ' + props.question.user.surname}</a>
            </div>
        </div>
    )
}

export default QuestionSummary