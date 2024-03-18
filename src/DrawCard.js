import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./DrawCard.css";

const BASE_URL = "https://deckofcardsapi.com/api"

function DrawCard() {
 
    const [imgSvg, setImgSvg] = useState([]);
    const [draw, setDraw] = useState(false);
    const [cardsDrawn, setCardsDrawn] = useState(0);
    const deckId = useRef(null);

    const handleClick = () => {
        if(cardsDrawn < 52){
            setCardsDrawn(cardsDrawn => cardsDrawn +1);
            setDraw(true);
        } else {
            alert("Error: no cards remaining!");
        };
    };

    const handleShuffle = async () => {
        setImgSvg([]);
        setCardsDrawn(0);
        setDraw(null);
        await axios.get(`${BASE_URL}/deck/${deckId.current}/shuffle/`);
    };

    useEffect(() => {
        async function fetchDeck() {
            const res = await axios.get(`${BASE_URL}/deck/new/shuffle/?deck_count=1`);
            deckId.current = res.data.deck_id;
        }
        fetchDeck();
    }, []);

    useEffect(function fetchNewCard() {
        async function fetchCard() {
            if(draw && cardsDrawn < 52){
                const res = await axios.get(`${BASE_URL}/deck/${deckId.current}/draw/?count=1`);
                setImgSvg(cards => [...cards, res.data.cards[0]]);
            };
    };
    fetchCard();
    }, [draw, cardsDrawn]);

    return (
        <div className="drawCard">  
            <button onClick={handleClick}>Draw a card</button>
            <button onClick={handleShuffle}> Shuffle </button>
            <div className="photoStack" 
                style={{margin:"0", width:"100vw", height:"100vh"}}> 
                    {imgSvg.map((card, idx) => (
                        <div key={idx} className="card"  >
                        <img src={`${card.images.svg}`} 
                            alt="SVG" 
                            style={{transform: `rotate(${idx * 10}deg)`, 
                                zIndex: idx, width:"100%", height:"100%"}} />
                        </div>
                ))}
            </div>
        </div>
    )
}

export default DrawCard