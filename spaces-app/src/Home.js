import React, { useEffect, useRef, useState } from "react";
import './App.css';
import Header from "./Header";
import UP_ARROW from "./assets/Icons/upGreen.png";
import DOWN_ARROW from "./assets/Icons/redDown.png";
import './PlayerViewList.css'
import { useSelector, useDispatch } from 'react-redux';
import { setHeaderUI } from './redux/reducers/headerUIReducer';
import {GET_CURRENTLY_OPEN_AUCTIONS} from "./graphqlResolverTemplate"
import { globalApolloClient } from "./App";
import { useNavigate } from 'react-router-dom';

function formatNumber(num) {
  console.log('num',num)
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function Home() {


  let navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    initializeCurrentlyGoingAuctions()
  }, []);
  
  const [currentAuctionsList, setCurrentAuctionsList] = useState([]);
  const [isCurrentMatchButtonHover,setIsCurrentMatchButtonHover] = useState(true);


  function OverallButtonHover () {

    const [isOverallButtonHover,setIsOverallButtonHover] = useState(false);

    const handleMouseEnterOverallButton = () => {
      setIsOverallButtonHover(true);
    };
    const handleMouseLeaveOverallButton = () => {
      setIsOverallButtonHover(false);
    };

    

    return(
      <button style={{display:'flex', width:'150px', height:'50px',borderRadius:'20px',backgroundColor:isOverallButtonHover?'rgba(218, 238, 1,1)':'#000000', marginRight:'20px',borderWidth:'2px',borderColor:isOverallButtonHover?'transparent':'rgba(218, 238, 1,1)',borderStyle: "solid", justifyContent:'center', cursor:'pointer'}}
      onClick = {()=>{
        console.log('clicked')
        let tempData = currentAuctionsList.slice()
        const sortedData = tempData.sort((a, b) => b.spaceWorthInt - a.spaceWorthInt);
        console.log('sortedData',sortedData)
        setCurrentAuctionsList(sortedData);
      }}
      onMouseEnter={handleMouseEnterOverallButton}
      onMouseLeave={handleMouseLeaveOverallButton}>
      <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px', color:isOverallButtonHover?'#000000':'rgba(218, 238, 1,1)'}}>overall</span>
    </button>
    );
  }

  function GrowthButtonHover () {

    const [isGrowthButtonHover,setIsGrowthButtonHover] = useState(false);
  
    const handleMouseEnterGrowthButton = () => {
      setIsGrowthButtonHover(true);
    };
    const handleMouseLeaveGrowthButton = () => {
      setIsGrowthButtonHover(false);
    };
       

    return(
    <button style={{display:'flex', width:'150px', height:'50px',borderRadius:'20px',backgroundColor:isGrowthButtonHover?'rgba(218, 238, 1,1)':'#000000', marginRight:'20px',borderWidth:'2px',borderColor:isGrowthButtonHover?'transparent':'rgba(218, 238, 1,1)',borderStyle: "solid", justifyContent:'center', cursor:'pointer'}}
        onClick = {()=>{
        console.log('clicked')
        let tempData = currentAuctionsList.slice()
        const sortedData = tempData.sort((a, b) => b.tenureValueGrowth - a.tenureValueGrowth);
        console.log('sortedData',sortedData)
        setCurrentAuctionsList(sortedData);
      }}
      onMouseEnter={handleMouseEnterGrowthButton}
      onMouseLeave={handleMouseLeaveGrowthButton}>
      <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px', color:isGrowthButtonHover?'#000000':'rgba(218, 238, 1,1)'}}>growth</span>
    </button>
    );
  }

  async function initializeCurrentlyGoingAuctions(){
    let response = await globalApolloClient.query({
      query: GET_CURRENTLY_OPEN_AUCTIONS,
      fetchPolicy: 'network-only'
    })

    console.log('response',response.data.CurrentlyOpenAuctions)

    let currentlyOpenAuctionsData = []

    let object = response.data.CurrentlyOpenAuctions

    for (let m=0; m<=object.length-1; m++){
      
      console.log('object[m].player.name',object[m].player.name)
      console.log('tenureValueGrowth',((((object[m].player.auctions[object[m].player.auctions.length-1].winningBidValue/parseInt(object[m].player.auctions[object[m].player.auctions.length-1].term))- (object[m].player.auctions[object[m].player.auctions.length-2].winningBidValue/parseInt(object[m].player.auctions[object[m].player.auctions.length-2].term)))/(object[m].player.auctions[object[m].player.auctions.length-2].winningBidValue/parseInt(object[m].player.auctions[object[m].player.auctions.length-2].term)))*100).toFixed(2))

      currentlyOpenAuctionsData.push({
        playerId:object[m].playerId,
        profilePic:object[m].player.profilePic,
        tenureValueGrowth:((((object[m].player.auctions[object[m].player.auctions.length-1].winningBidValue/parseInt(object[m].player.auctions[object[m].player.auctions.length-1].term))- (object[m].player.auctions[object[m].player.auctions.length-2].winningBidValue/parseInt(object[m].player.auctions[object[m].player.auctions.length-2].term)))/(object[m].player.auctions[object[m].player.auctions.length-2].winningBidValue/parseInt(object[m].player.auctions[object[m].player.auctions.length-2].term)))*100).toFixed(2),
        playerName:object[m].player.name,
        spaceWorthInt:(object[m].player.auctions[object[m].player.auctions.length-1].winningBidValue/parseInt(object[m].player.auctions[object[m].player.auctions.length-1].term)),
        spaceWorth:formatNumber(object[m].player.auctions[object[m].player.auctions.length-1].winningBidValue/parseInt(object[m].player.auctions[object[m].player.auctions.length-1].term)),
        totalViewTimeGenerated:(object[m].player.overallViewTime).toFixed(2),
        averageEstimatedViewTimePerRound:(object[m].player.overallRoundEstimatedViewTime).toFixed(2),
        Clutches:object[m].player.overallClutch,
        Aces:object[m].player.overallAce,
        numberOfMatchesPlayed:object[m].player.numberOfMatches,
        numberOfRoundsPlayed:object[m].player.numberOfRounds
      });

    }
    
    

    console.log('currentlyOpenAuctionsData',currentlyOpenAuctionsData)
    setCurrentAuctionsList(currentlyOpenAuctionsData)
  }


  const handleMouseEnterCurrentMatchButton = () => {
    setIsCurrentMatchButtonHover(true);
  };
  const handleMouseLeaveCurrentMatchButton = () => {
    setIsCurrentMatchButtonHover(true);
  };
  
  function CurrentMatchPlayersList(){
    
    const playersList = currentAuctionsList;

    
    return(
      <div className="listContainer">
      {playersList.map((item,index)=>(
        <button key={index} className="item" onClick={()=>{
          navigate(`/player?playerId=${item.playerId}`)
          dispatch(setHeaderUI('PLAYER'))
        }}>
  
          <div className="watermark-overlay"></div>
  
          <div style={{display:'flex',width:'100%',height:'100%',position:'absolute', zIndex:2, flexDirection:'column', left:0, top:0}}>
            <div style={{display:'flex', width:'95%', height:'50%', flexDirection:'column',borderRadius:'10px', alignSelf:'center'}}>
                <img src={item.profilePic} style={{display:'flex',width:'100%', height:'100%', borderRadius:'10px', marginTop:'10px'}}></img>
            </div>
            <div style={{display:'flex', width:'95%', height:'50%', flexDirection:'column', justifyContent:'flex-end', alignSelf:'center',}}>
  
              <div style={{display:'flex', flexDirection:'column', width:'100%', flexDirection:'row'}}>
                <div style={{display:'flex', flexDirection:'column', width:'62%',}}>
                <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{item.playerName}</span>
                <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginLeft:'10px'}}>${item.spaceWorth}</span>
                </div>
  
                <div style={{display:'flex', flexDirection:'row', width:'38%',}}>
  
                <div style={{display:'flex', flexDirection:'row', backgroundColor:"#000000", borderRadius:'30px', height:'26px', paddingLeft:'8px', paddingRight:"8px", marginTop:'32px'}}>
                  {(item.tenureValueGrowth>0)?
                  <img src={UP_ARROW} style={{display:'flex', width:'12px', height:"12px", alignSelf:'center', marginLeft:"5px"}}></img>:
                  <img src={DOWN_ARROW} style={{display:'flex', width:'12px', height:"12px", alignSelf:'center', marginLeft:"5px", marginTop:"2px"}}></img>}
                  <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'10px', color:(item.tenureValueGrowth>0)?'#04ff00':'#ff0000', alignSelf:'center', marginLeft:"10px"}}>{item.tenureValueGrowth} %</span>
                </div>
  
                </div>
              </div>
  
              <div style={{display:'flex', width:'100%', flexDirection:'row', justifyContent:'space-between', marginTop:'4px'}}>
                <div style={{display:'flex',marginLeft:'10px'}}>
                  <span style={{alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginTop:'5px', marginRight:'10px'}}>Matches</span>
                  <span style={{alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px', color:'#000000', marginTop:'1px',}}>{item.numberOfMatchesPlayed}</span>
                </div>
  
                <div style={{display:'flex',marginRight:'20px'}}>
                <span style={{alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginTop:'5px', marginRight:'10px'}}>Rounds</span>
                <span style={{alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px', color:'#000000', marginTop:'1px',}}>{item.numberOfRoundsPlayed}</span>
                </div>
  
              </div>
  
              <div style={{display:'flex', width:'100%', flexDirection:'row', justifyContent:'space-between', marginTop:'1px'}}>
              <div style={{display:'flex', marginLeft:'10px'}}>
              <span style={{display:'flex',alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginTop:'5px', marginRight:'10px'}}>Aces/Clutches</span>
              <span style={{display:'flex',alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px', color:'#000000', marginTop:'1px',}}>{item.Aces}/{item.Clutches}</span>
              </div>
              </div>
  
              <div style={{display:'flex', width:'100%', flexDirection:'row', justifyContent:'flex-start'}}>
              <span style={{alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginTop:'6px', marginLeft:'10px', marginRight:'10px'}}>round view time</span>
              <span style={{alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px', color:'#000000', marginTop:'3px',}}>{item.averageEstimatedViewTimePerRound}s</span>
              </div>
  
              <div style={{display:'flex', width:'100%', flexDirection:'row', justifyContent:'flex-start', marginBottom:'25px'}}>
              <span style={{alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginTop:'5px', marginLeft:'10px', marginRight:'10px'}}>total view time</span>
              <span style={{alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px', color:'#000000', marginTop:'3px',}}>{item.totalViewTimeGenerated}s</span>
              </div>
  
              
  
            </div>
          </div>
  
  
          <span style={{display:'flex', position:'absolute',alignSelf:'center', fontFamily:'Black Ops One', fontWeight:'regular', fontSize:'20px', color:'rgba(0, 0, 0,0.05)', zIndex:1, left:80, bottom:5}}>spaces</span>
  
  
  
        </button>
      ))}
      </div>
    )
  }
  
  
  
    return (
  
      <div style={{display: 'flex', backgroundColor: '#000000', width: '100vw', height: '100vh', flexDirection:'column', alignSelf:'center', justifyContent: 'flex-start'}}>
  
        <Header/>
  
        <div style={{display:'flex', flexDirection:'row', justifyContent:'center', marginTop:'10px', marginLeft:'35px'}}>
          <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'25px', color:'rgba(218, 238, 1,1)',marginRight:'15px'}}>blended Ads for Esports</span>
          <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'regular', fontSize:'20px', color:'rgba(82, 154, 89, 1)',marginRight:'15px'}}>•</span>
          <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'25px', color:'rgba(218, 238, 1,1)',marginRight:'15px'}}>bid for players</span>
          <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'regular', fontSize:'20px', color:'rgba(82, 154, 89, 1)',marginRight:'15px'}}>•</span>
          <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'25px', color:'rgba(218, 238, 1,1)',}}>sponsor in-game spaces</span>
        </div>
    
        <div style={{display:'flex', width:'90vw', height:'350px',flexDirection:'column', justifyContent:'flex-start', marginTop:'60px', alignSelf:'center', borderRadius:'20px'}}>
          
          <div style={{display:'flex', width:'80vw', height:'50px',flexDirection:'row', marginBottom:'15px', flexDirection:'row',}}>
  
          <button style={{display:'flex', width:'200px', height:'50px',borderRadius:'20px',backgroundColor:isCurrentMatchButtonHover?'rgba(218, 238, 1,1)':'#000000', marginRight:'20px',borderWidth:'2px',borderColor:isCurrentMatchButtonHover?'transparent':'rgba(218, 238, 1,1)',borderStyle: "solid", justifyContent:'center',}}
            onMouseEnter={handleMouseEnterCurrentMatchButton}
            onMouseLeave={handleMouseLeaveCurrentMatchButton}>
            <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px', color:isCurrentMatchButtonHover?'#000000':'rgba(218, 238, 1,1)'}}>currently bidding</span>
          </button>
  
          <OverallButtonHover/>
  
          <GrowthButtonHover/>
  
          </div>
  
          <div style={{display:'flex', width:'90vw', height:'450px',flexDirection:'column', justifyContent:'center', alignSelf:'center', borderRadius:'20px'}}>
            <CurrentMatchPlayersList/>
          </div>
        </div>
  
  
  
        
  
        
      </div>
  
    );
}

export default Home;
  