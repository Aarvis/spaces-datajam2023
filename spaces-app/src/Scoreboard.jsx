import React, { useState, useEffect, useRef } from "react";
import TeamSide from "./components/TeamSide";
import "./Scoreboard.css";
// import Timeline from "./components/timeline-component/Timeline";
import EventTimeline from "./components/timeline-component/EventTimeline";
import { useSelector, useDispatch } from 'react-redux';
import { setScoreboard } from './redux/reducers/scoreboardReducer.js';
import { globalApolloClientSB } from "./App";
import {SCOREBOARD_CHANGED} from './graphqlResolverTemplate';
import BOMBPLANTED from "./assets/bombPlanted.png";
import BOMBEXPLODED from "./assets/explosion.png";
import INTEL from "./assets/Intel.png"
import AMD from "./assets/AMD.png"
import REDBULL from "./assets/RedBull.png"
import DHL from "./assets/Dhl.jpg"
import MICROSOFT from "./assets/microsoft.png"
import SAMSUNG from "./assets/Samsung.png"



function BlinkingBomb() {
  const [opacity, setOpacity] = useState(1);
  const [direction, setDirection] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(prevOpacity => {
          let newOpacity = prevOpacity + (0.02 * direction);
          
          if (newOpacity <= 0.2) {
              newOpacity = 0.2;
              setDirection(1);
          } else if (newOpacity >= 1) {
              newOpacity = 1;
              setDirection(-1);
          }

          return newOpacity;
      });
  }, 15);

  return () => clearInterval(interval);
  }, [direction]);


  return (
    <img src={BOMBPLANTED} style={{display:'flex', width:32, height:32, alignSelf:'center', marginTop:"10px",opacity:opacity}}/>
  );
}


function BlinkingExploded() {
  const [opacity, setOpacity] = useState(1);
  const [direction, setDirection] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(prevOpacity => {
          let newOpacity = prevOpacity + (0.02 * direction);
          
          if (newOpacity <= 0.2) {
              newOpacity = 0.2;
              setDirection(1);
          } else if (newOpacity >= 1) {
              newOpacity = 1;
              setDirection(-1);
          }

          return newOpacity;
      });
  }, 15);

  return () => clearInterval(interval);
  }, [direction]);


  return (
    <div style={{display:"flex", width:"50px", height:'35px', backgroundColor:'orange', justifyContent:'center', borderRadius:'20px', marginTop:'10px', alignSelf:'center', opacity:opacity}}>
      <img src={BOMBEXPLODED} style={{display:'flex', width:25, height:25, alignSelf:'center'}}/>
    </div>
  );
}

function BlinkingDiffused() {
  const [opacity, setOpacity] = useState(1);
  const [direction, setDirection] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(prevOpacity => {
          let newOpacity = prevOpacity + (0.02 * direction);
          
          if (newOpacity <= 0.2) {
              newOpacity = 0.2;
              setDirection(1);
          } else if (newOpacity >= 1) {
              newOpacity = 1;
              setDirection(-1);
          }

          return newOpacity;
      });
  }, 15);

  return () => clearInterval(interval);
  }, [direction]);


  return (
    <div style={{display:"flex", width:"50px", height:'35px', backgroundColor:'transparent', justifyContent:'center', borderRadius:'20px', marginTop:'5px', alignSelf:'center', opacity:opacity, position:'relative'}}>
      <span style={{position:'absolute', zIndex:1, fontSize:28, color:'grey', fontWeight:'bold',}}>X</span>
      <img src={BOMBPLANTED} style={{display:'flex', width:31, height:31, alignSelf:'center', zIndex:0, position:'absolute', opacity:0.4}}/>
    </div>
  );
}

// function BlinkingBombDefusingInProgress() {
// }



function Scoreboard() {


  const [isVisible, setIsVisible] = useState(false);
  const visibilityStartRef = useRef(0);
  const totalVisibleTimeRef = useRef(0);
  
  const componentRef = useRef(null);

  // setInterval(()=>{
  //   console.log('totalVisibleTimeRef',totalVisibleTimeRef)
  // },2000)

  useEffect(() => {
    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !visibilityStartRef.current) {
          setIsVisible(true);
          visibilityStartRef.current = Date.now();
        } else if (!entry.isIntersecting && visibilityStartRef.current) {
          setIsVisible(false);
          const now = Date.now();
          totalVisibleTimeRef.current += now - visibilityStartRef.current;
          visibilityStartRef.current = 0;
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection);
    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, []);


  const scoreboard = useSelector((state) => state.scoreboardReducer);

  let bombExploded = false;
  let bombDiffused = false;
  let bombPlanted = false;

  console.log('scoreboard',scoreboard)

  let team1Players = []
  let team2Players = []

  let matchesWonTeamA = 0;
  let matchesWonTeamB = 0;

  for(let n=0; n<=scoreboard.length-1; n++){
    if(scoreboard[n].scoreboard.roundsWonTeamA > scoreboard[n].scoreboard.roundsWonTeamB && scoreboard.length-1 > n){
      matchesWonTeamA = matchesWonTeamA + 1
    }
    else if(scoreboard[n].scoreboard.roundsWonTeamA < scoreboard[n].scoreboard.roundsWonTeamB && scoreboard.length-1 > n){
      matchesWonTeamB = matchesWonTeamB + 1
    }
  }

  for(let m=0; m<=scoreboard[scoreboard.length-1].scoreboard.scoreboardPlayerCard.length-1; m++){
    if(scoreboard[scoreboard.length-1].scoreboard.scoreboardPlayerCard[m].teamId == scoreboard[scoreboard.length-1].scoreboard.teamAId){
      team1Players.push({
        name:scoreboard[scoreboard.length-1].scoreboard.scoreboardPlayerCard[m].player.name,
        playerId:scoreboard[scoreboard.length-1].scoreboard.scoreboardPlayerCard[m].player.playerId,
        health:scoreboard[scoreboard.length-1].scoreboard.scoreboardPlayerCard[m].health,
        roundStats:[scoreboard[scoreboard.length-1].scoreboard.scoreboardPlayerCard[m].kills, scoreboard[scoreboard.length-1].scoreboard.scoreboardPlayerCard[m].deaths, scoreboard[scoreboard.length-1].scoreboard.scoreboardPlayerCard[m].assists],
        isDead:!scoreboard[scoreboard.length-1].scoreboard.scoreboardPlayerCard[m].alive,
        damageDealtInstant:scoreboard[scoreboard.length-1].scoreboard.scoreboardPlayerCard[m].damageDealtInstant,
        damageTakenInstant:scoreboard[scoreboard.length-1].scoreboard.scoreboardPlayerCard[m].damageTakenInstant,
        itemsOwned:scoreboard[scoreboard.length-1].scoreboard.scoreboardPlayerCard[m].itemsOwned,
        armor:scoreboard[scoreboard.length-1].scoreboard.scoreboardPlayerCard[m].armor,
      })
    }
    else{
      team2Players.push({
        name:scoreboard[scoreboard.length-1].scoreboard.scoreboardPlayerCard[m].player.name,
        playerId:scoreboard[scoreboard.length-1].scoreboard.scoreboardPlayerCard[m].player.playerId,
        health:scoreboard[scoreboard.length-1].scoreboard.scoreboardPlayerCard[m].health,
        roundStats:[scoreboard[scoreboard.length-1].scoreboard.scoreboardPlayerCard[m].kills, scoreboard[scoreboard.length-1].scoreboard.scoreboardPlayerCard[m].deaths, scoreboard[scoreboard.length-1].scoreboard.scoreboardPlayerCard[m].assists],
        isDead:!scoreboard[scoreboard.length-1].scoreboard.scoreboardPlayerCard[m].alive,
        damageDealtInstant:scoreboard[scoreboard.length-1].scoreboard.scoreboardPlayerCard[m].damageDealtInstant,
        damageTakenInstant:scoreboard[scoreboard.length-1].scoreboard.scoreboardPlayerCard[m].damageTakenInstant,
        itemsOwned:scoreboard[scoreboard.length-1].scoreboard.scoreboardPlayerCard[m].itemsOwned,
        armor:scoreboard[scoreboard.length-1].scoreboard.scoreboardPlayerCard[m].armor,
      })
    }
  }
  
  if(scoreboard[scoreboard.length-1].scoreboard.bombExploded == true){

    bombExploded = true;
    bombDiffused = false;
    bombPlanted = false;

  }
  else if (scoreboard[scoreboard.length-1].scoreboard.bombDiffused == true){

    bombExploded = false;
    bombDiffused = true;
    bombPlanted = false;

  }
  else if(scoreboard[scoreboard.length-1].scoreboard.bombPlanted == true){
    bombExploded = false;
    bombDiffused = false;
    bombPlanted = true;
  }


  return (
    <div ref={componentRef} style={{display:'flex', flexDirection:'column', alignSelf:'center', justifyContent:'center', marginTop:'40px' }}>
      <div className="scoreboard">
        <div style={{  display:'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#222',
            borderRadius: '15px',
            padding: '10px',
            width: '100%',
            maxWidth: '1400px',
            // margin: 'auto',
            alignSelf:'center'}}>
        <TeamSide players={team1Players} />
        <div style={{display:"flex", flexDirection:'column',}}>
          <span style={{fontSize:30, fontFamily:'Tektur', fontWeight:'bold',color:'rgba(218, 238, 1,1)'}}> {matchesWonTeamA} - {matchesWonTeamB} </span>
          <span style={{alignSelf:'center', fontFamily:'Tektur', fontWeight:'Regular',color:'rgba(218, 238, 1,1)'}}>{scoreboard[scoreboard.length-1].scoreboard.roundsWonTeamA} - {scoreboard[scoreboard.length-1].scoreboard.roundsWonTeamB}</span>

          {(bombPlanted)?
          <BlinkingBomb/>:
          (bombExploded)?
          <BlinkingExploded/>:
          (bombDiffused)?
          <BlinkingDiffused/>:
          <img src={BOMBPLANTED} style={{display:'flex', width:32, height:32, alignSelf:'center', marginTop:"10px", opacity:0.1}}/>}

        </div>
        <TeamSide players={team2Players} />
        {/* <Timeline/> */}
        </div>
        <div style={{display:'flex', alignSelf:'center', width:'1200px', height:'10px', marginBottom:'5px', justifyContent:'center'}}>
        <EventTimeline/>
        </div>
      </div>
        <div style={{display:'flex', height:'60px', flexDirection:'row', justifyContent:'center', alignSelf:'center', backgroundColor:'#222',borderBottomLeftRadius:'15px', borderBottomRightRadius:'15px', paddingLeft:"10px", paddingRight:'10px'}}>
          {/* <span>intel</span>
          <span>dhl</span>
          <span>aws</span>

          <div style={{display:'flex',flexDirection:'column'}}>
            <div style={{display:'flex',flexDirection:'row'}}>
            <span>forze</span>
            <span>vs</span>
            <span>element</span>
            </div>
            <span>CLT20 Series Final</span>'
          </div>  

            <span>prime</span>
          <span>nvidia</span>
          <span>monster</span> */}
          <div style={{display:'flex', width:'90px', height:'50px', justifyContent:'center', marginRight:'15px', marginLeft:'10px'}}>
          <img src={MICROSOFT} style={{display:'flex', width:'90px', height:'90px', alignSelf:'center', objectFit:'contain'}}/>
          </div>
          <div style={{display:'flex', width:'90px', height:'50px', justifyContent:'center'}}>
          <img src={INTEL} style={{display:'flex', width:'70px', height:'40px', alignSelf:'center', objectFit:'contain'}}/>
          </div>
          <div style={{display:'flex', width:'90px', height:'50px', justifyContent:'center'}}>
          <img src={DHL} style={{display:'flex', width:'70px', height:'40px', alignSelf:'center', objectFit:'contain'}}/>
          </div>
          <div style={{display:'flex', width:'200px', height:'50px', flexDirection:'column', justifyContent:'center'}}>
            <span style={{display:'flex', fontSize:'16px', fontFamily:'Tektur', fontWeight:'bold', alignSelf:'center', color:'rgba(218, 238, 1,1)'}}>CLT20 Series</span>
            <span style={{display:'flex', fontSize:'20px', fontFamily:'Tektur', fontWeight:'bold', alignSelf:'center', color:'rgba(218, 238, 1,1)'}}>{scoreboard[scoreboard.length-1].scoreboard.teamAName} vs {scoreboard[scoreboard.length-1].scoreboard.teamBName}</span>
          </div>
          <div style={{display:'flex', width:'90px', height:'50px', justifyContent:'center'}}>
          <img src={REDBULL} style={{display:'flex', width:'70px', height:'40px', alignSelf:'center', objectFit:'contain'}}/>
          </div>
          <div style={{display:'flex', width:'90px', height:'50px', justifyContent:'center'}}>
          <img src={AMD} style={{display:'flex', width:'70px', height:'40px', alignSelf:'center', objectFit:'contain'}}/>
          </div>
          <div style={{display:'flex', width:'90px', height:'50px', justifyContent:'center',}}>
          <img src={SAMSUNG} style={{display:'flex', width:'90px', height:'80px', alignSelf:'center', objectFit:'contain'}}/>
          </div>


        </div>
    </div>
  );
}

export default Scoreboard;


