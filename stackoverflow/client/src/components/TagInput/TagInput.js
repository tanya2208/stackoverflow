import React, {useEffect, useState} from "react";
import Tag from "../../components/Tag/Tag";
import './TagInput.css'

function TagInput({filterTags, setFilterTags, showTags = true, border = true}){
    const [tags, setTags] = useState([])
    const [filteredTags, setFilteredTags] = useState([])
    const [tagsCopy, setTagsCopy] = useState([])
    const [chosenTags, setChosenTags] = useState([])
    const [openDropdown, setOpenDropdown] = useState(false)

    async function getTags(){
        const req = await fetch('http://localhost:1337/tags')

		const data = await req.json()
		if (data.status === 'ok') {
			setTags([...data.tags])
			setTagsCopy([...data.tags])
		} else {
			alert(data.error)
		}
    }

    useEffect(() => {
        getTags()
    }, [])

    function inputChangeHandler(e){
        let value = e.target.value;
        let filteredArray = tags.filter(tag => tag.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
        setFilteredTags(filteredArray)
        if(filteredArray.length > 0){
            openDropdownHandler()
        }
        if(!value){
            closeDropdownHandler()
        }
    }

    function chooseTagHandler(e){
        let tag = e.target.innerHTML
        let tagsArr = chosenTags
        tagsArr.push(tag)
        if(showTags){
            setChosenTags([...tagsArr])
        } else{
            setFilterTags([...tagsArr])
        }
        let index = tags.findIndex(i => i.name == tag)
        tags.splice(index, 1)
        closeDropdownHandler()
        document.querySelector('.tag-input').value = ''
        console.log(chosenTags)
    }

    function closeDropdownHandler(){
        setOpenDropdown(false)
    }

    function openDropdownHandler(){
        if(document.querySelector('.tag-input').value !== ''){
            setOpenDropdown(true)
        }
    }

    function preventClose(e){
        e.preventDefault()
    }

    function keyHandler(e){
        //backspace
        if(e.keyCode === 8 && showTags){
            if(document.querySelector('.tag-input').value === ''){
                let chosenTagsArr = [...chosenTags]
                chosenTagsArr.splice(chosenTagsArr.length-1, 1)
                setChosenTags(chosenTagsArr)
            }
        }
    }

    function deleteTag(index){
        let deletedTag = tagsCopy.find(tag => tag.name === chosenTags[index])
        let chosenCopy = [...chosenTags]
        chosenCopy.splice(index, 1)
        setChosenTags([...chosenCopy])
        setTags([...tags, deletedTag])
    }

    return(
        <div className={showTags ? 'relative-position tag-container' : 'static-position tag-container' }>
                <div className="tag-input-container">
                    <input type="text" className={border ? 'custom-input tag-input' : 'custom-input tag-input no-border'} placeholder="Search by tags" onChange={inputChangeHandler} onFocus={openDropdownHandler} onBlur={closeDropdownHandler} onKeyDown={keyHandler}/>
                    {chosenTags.length > 0 && showTags && chosenTags.map((tag, index)=>{
                        return <Tag key={index} tag={tag} deleteTag={deleteTag} index={index}></Tag>
                    })}
                </div>
                {openDropdown && <div className={showTags ? 'absolute-position dropdown' : 'dropdown' }>
                    {filteredTags.map((tag)=>{
                        return <div className="dropdown-item" onMouseDown={preventClose} onClick={chooseTagHandler} key={tag._id}>{tag.name}</div>
                    })}
                </div>}
        </div>
    )
}

export default TagInput