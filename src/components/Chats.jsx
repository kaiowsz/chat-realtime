import React, { useEffect, useState, useContext } from "react";
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";


export default function Chats() {

    const [chats, setChats] = useState([])

    const {currentUser} = useContext(AuthContext)
    const {dispatch} = useContext(ChatContext)

    useEffect(() => {
        function getChats() {

            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                setChats(doc.data())
                if(doc.data() === undefined || null) {
                    setChats([])
                }
            })
            
            return () => { unsub() };
        };

        currentUser.uid && getChats()

    }, [currentUser.uid])

    function handleSelect(u) {
        dispatch({type: "CHANGE_USER", payload: u })
    }

    return (
    <div className="chats">

        {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (

            <div key={chat[0]} className="userChat" onClick={() => handleSelect(chat[1].userInfo)}>
            <img src={chat[1]?.userInfo.photoURL} alt="" />
            <div className="userChatInfo">
                <span>{chat[1].userInfo.displayName}</span>
                <p>{chat[1].lastMessage?.text}</p>
            </div>
        </div>
        ))}

    </div>
    )
}