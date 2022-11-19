import React, { useEffect, useState } from "react";
import {decodeToken} from 'react-jwt'
import { useNavigate } from 'react-router-dom'
import QuestionSummary from '../../components/QuestionSummary/QuestionSummary';
import TagInput from "../../components/TagInput/TagInput";
import Tag from "../../components/Tag/Tag";
import arrow from '../../images/arrow.svg'
import plus from '../../images/plus.svg'
import './Home.css'

function Home(){
	const [questions, setQuestions] = useState([])
	const [userId, setUserId] = useState('')
	const [openTags, setOpenTags] = useState(false)
	const [chosenTags, setChosenTags] = useState([])
	const [searchString, setSearchString] = useState('')
	const navigate = useNavigate();

    async function getQuestions() {
		const req = await fetch('http://localhost:1337/questions/filtered', {
			method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: searchString ? searchString : 'null',
                tags: chosenTags.length > 0 ? JSON.stringify(chosenTags) : 'null',
            })
		})

		const data = await req.json()
		if (data.status === 'ok') {
			console.log(data.questions)
			setQuestions(data.questions)
		} else {
			console.log(data.error)
		}
	}

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
			setUserId('')
		}
		getQuestions('')
	}, [chosenTags, searchString])

	function searchHandler(e){
		setSearchString(e.target.value)
	}

	function toggleTagsDropdown(){
		setOpenTags(!openTags)
		document.querySelector('.tags-filter-btn img').classList.toggle('rotate')
	}

	window.addEventListener('click', function(e){   
		if(document.getElementById('tags-dropdown') && !e.target.classList.contains('dropdown-item')){
			if (!document.getElementById('tags-dropdown').contains(e.target)){
				setOpenTags(false)
				document.querySelector('.tags-filter-btn img').classList.remove('rotate')
			} 
		}	
	});

	function deleteTag(index){
        let tags = [...chosenTags]
        tags.splice(index, 1)
        setChosenTags([...tags])
    }

    return(
        <div className="home-container">
			<h1>Questions</h1>
			<div className="actions-container">
				<div className="filter-container">
					<input placeholder="Search" className="search-input" onChange={searchHandler}/>
					<div className="tags-filter-container" id="tags-dropdown">
						<button className="tags-filter-btn" onClick={toggleTagsDropdown}><div>Tags <span><img src={arrow} alt="Open"/></span></div></button>
						{openTags && <div  className="tags-filter-dropdown">
							<TagInput filterTags={chosenTags} setFilterTags={setChosenTags} showTags={false}></TagInput>
						</div>}
					</div>
				</div>
				<button className="new-question-btn simple-btn" onClick={()=> {userId ? navigate('/question') :  navigate('/login')}}><div><span><img src={plus} alt="Plus"/></span>Create New Question</div></button>
			</div>
			<div className="tags">
                    {chosenTags.length > 0 && chosenTags.map((tag, index)=>{
                        return <Tag key={index} tag={tag} deleteTag={deleteTag} index={index}></Tag>
                    })}
            </div>
			<div className="questions-container">
				{questions.map((item,index)=>{
					return <QuestionSummary key={index} question={item}></QuestionSummary>
				})}
			</div>
		</div>
    )
}

export default Home