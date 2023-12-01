import React, { useEffect, useState } from "react"
import MangaProfileImage from "../MangaProfileImage/MangaProfileImage"
import ForumPost from "../ForumPost/ForumPost"
import { isFavorite } from "../../../helper/helper"


import "./MangaInfo.css"

function MangaInfo({mangaData, userData}) {
    const {title, author, genres, synopsis, image, __id} = mangaData[0] || {}
    // console.log(mangaData[0])
    const genresArray = genres ? Object.values(genres).map(genre => genre.name) : []
    const authorNames= author ? author.split(',').reverse().join(' '): ''
    const mangaImage= image && image.jpg && image.jpg.default

    const [chapter, setChapter] = useState('')
    const [isMenuOpen, setMenuOpen] =useState(false)

    const [reading, setReading] = useState(false)

    const handleAddClick = () => {
        setMenuOpen(!isMenuOpen)
    }


    const handleChapterChange = (e) =>{
        const input = e.target.value
        const validInput= input.replace(/[^0-9\b]/g,"")
        setChapter(validInput)
    }


    const handleAddListClick = () => {
        // console.log(`clicked on ${item}`)
        setMenuOpen(false)
    }

    const handleReadingClick = async () => {
        //define headers 
        const myHeaders = new Headers();
        
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', `Bearer ${localStorage.getItem("jwtToken")}`);
        
        //if current manga is in reading 
        if (reading){ 
          try { 
            const response3 = await fetch(`${process.env.REACT_APP_BACKEND_URL}/protected/user/delete/currentlyreading/${__id}`, {
              method: "DELETE",
              headers: myHeaders
            })
            const data3 = await response3.json()
            console.log(data3) 
          } catch (error) {
            console.error("Error fetching or accessing db in delete", error)
          }
        }
        else{ // if current manga is not in reading 
            const mangaData={
                title: title,
                image: mangaImage,
                __id: __id,
                authorName: authorNames,
                authorImage: "N/A"
            }
          try {
            const response3 = await fetch(`${process.env.REACT_APP_BACKEND_URL}/protected/user/add/currentlyreading`, {
              method: "POST",
              headers: myHeaders, 
              body: JSON.stringify(mangaData)
            })
            const data3 = await response3.json()
            console.log(data3) 
          } catch (error) {
            console.error("Error fetching or accessing db", error)
          }
        }
        console.log(userData)
        setReading(!reading); 
      }
    // //determine if the manga is currently favorite or not 
    // useEffect(() => {
    //     console.log(userData)
    //     if (isFavorite(userData["curretlyReading"], __id)){
    //         setReading(true) 
    //     }else{
    //         setReading(false)
    //     }
    //     console.log(userData)
    // }, [])

    return (
        <div className= "MangaInfo-container">
            <h1> {title} </h1>
            <div className= "MangaInfo-main">
                <div className="MangaInfo-left">
                    {mangaImage && <MangaProfileImage name={title} imgLink= {mangaImage} mangaId={__id} userData={userData}/>}
                    <div className= "MangaInfo-add">
                        <button onClick={handleAddClick}>+ Add to List</button>
                            {isMenuOpen && (
                                <ul className="menu">
                                    <button onClick={() => handleReadingClick('Reading')}>Reading</button>
                                    <button onClick={() => handleAddListClick('Want to Read')}>Want to Read</button>
                                    <button onClick={() => handleAddListClick('Already Read')}>Already Read</button>
                                </ul>
                            )}
                    </div>
                </div>
                <div className= "MangaInfo-right">
                    <div className= "MangaInfo-content">
                        <div className= "MangaInfo-chapter-tracker">
                            <label> Chapter: </label>
                            <input
                                type="text"
                                id="chapterInput"
                                value={chapter}
                                placeholder="0"
                                onChange={handleChapterChange}
                            />
                        </div>
                        <h3> Author: </h3>
                        <p>  {authorNames} </p>
                        <h3> Genres: </h3>
                        <p> {genresArray.join (', ')} </p>
                        <h3> Synopsis: </h3>
                        <p> {synopsis} </p>
                    </div>
                </div>
            </div>
            <div className="MangaInfo-comments">
                <h3> Comments: </h3>
                <ForumPost username= "Username goes here"/>  
            </div>
        </div>
    )
}

export default MangaInfo