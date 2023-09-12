import React from "react";
import bullet from "../assets/bullet.png";
import injury from "../assets/injury.png";
import { useNavigate, useLocation  } from 'react-router-dom';
import { setHeaderUI } from "../redux/reducers/headerUIReducer";
import { useSelector, useDispatch } from 'react-redux';

function PlayerCard({ player }) {
  
  const dispatch = useDispatch();

  let navigate = useNavigate();
  const { name, playerId, health, roundStats, isDead, armor} = player;

  let health_ = 90 / health;
  health_ = `${health}%`;

  let armor_ = parseInt(90*armor/100);
  armor_ = `${armor_}%`;

  console.log('armor', armor)


  return (
    <button style={{display:'flex', flexDirection:'column',opacity:isDead?0.2:1, backgroundColor:'rgba(218, 238, 1,1)', borderRadius:'10px', justifyContent:'center', paddingRight:'2px', paddingLeft:'2px', paddingTop:'2px', paddingBottom:'2px', cursor:'pointer'}} 
    onClick={()=>{
      dispatch(setHeaderUI('PLAYER'));
      navigate(`/player?playerId=${playerId}`)
    }}>
      <span style={{display:'flex', fontFamily:'Tektur', fontSize:'15px', alignSelf:"center", textAlign:'center', marginTop:'5px', fontWeight:'bold'}}>{name}</span>
      <div style={{display:'flex', flexDirection:'row', marginTop:'5px', alignSelf:'center', justifyContent:'center'}}>
      <span style={{fontFamily:'Tektur', fontSize:'13px', paddingRight:'2px', marginLeft:"5px"}}>K/D/A</span>
      <span style={{display:'flex',fontFamily:'Tektur', marginLeft:'2px', fontWeight:'bold', fontSize:'13px', marginRight:'5px'}}>{roundStats[0]}/{roundStats[1]}/{roundStats[2]}</span>
      </div>

      <div style={{display:'flex', width:'90%', height:'20px', borderColor:'black', borderWidth:'2px', borderStyle:'solid', borderRadius:'4px', marginTop:'2px', alignSelf:'center', flexDirection:'row',  }}>
      <div style={{display:'flex', width:health_, height:'20px', backgroundColor:'red', borderRadius:'2px', alignSelf:'flex-start', flexDirection:'row' }}>
      <span style={{display:'flex', fontFamily:'Tektur', fontSize:'12px', alignSelf:"center", textAlign:'center', fontWeight:'bold', width:'100%', marginLeft:"5px"}}>{health}</span>
      </div>
      </div>

      <div style={{display:'flex', width:armor_, height:'10px', backgroundColor:'black', borderRadius:'10px', marginTop:'3px', alignSelf:'center', flexDirection:'row', }}>
      </div>

      {/* <div style={{display:'flex', flexDirection:'row'}}>
      <span>Kevlar</span>
      <span>kit</span>
      <span>Gun</span>
      </div> */}
    </button>
  );
}

export default PlayerCard;
