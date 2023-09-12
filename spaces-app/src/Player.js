import React, { useEffect, useRef, useState } from "react";
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import Header from "./Header";
import UP_ARROW from "./assets/Icons/upGreen.png";
import DOWN_ARROW from "./assets/Icons/redDown.png";
import './PlayerViewList.css';
import { setLogInOut } from './redux/reducers/logInOutReducer';
import { useLocation } from 'react-router-dom';

import { LineChart, PieChart } from 'react-chartkick';
import 'chartkick/chart.js'
import { globalApolloClient } from "./App";
import {GET_OVERALL_STATS_FOR_PLAYERS, GET_PLAYER_AUCTION_HISTORY, BID_FOR_AUCTION, OPEN_BID} from "./graphqlResolverTemplate"


const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// import {
//   BrowserRouter as Router,
//   Switch,
//   Route
// } from 'react-router-dom';

  // spaceWorthChartPerRound
  // estimatedViewTimeCharPerRound
  // averageRoundViewTimePercentage
  // momentsViewTimeChart
  // percentageOfOpponentTeamKilledChart

  function convertToKFormat(num) {
    // Ensure it's a 4, 5, or 6-digit number
    if (num < 1000 || num >= 1000000) {
      throw new Error('The number must be between 4 and 6 digits.');
    }
  
    // Divide the number by 1,000 to convert to "K" format
    const inKs = num / 1000;
  
    // Use toFixed(1) to round to 1 decimal place, but remove trailing ".0"
    return `${parseFloat(inKs.toFixed(1))}K`;
  }

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Player() {


  let query = useQuery();
  let queryPlayerId = query.get("playerId");
  // let age = query.get("age");

  const logInOutStatus = useSelector((state) => state.logInOutReducer);
  const [playerData, setPlayerData] = useState(null);
  const [auctionHistory,setAuctionHistory] = useState(null);
  const [bidPlaceError, setBidPlaceError] = useState({status:false,message:null})

  // console.log('reload',reload)

  let currentSponsorId = null//'cllxzoze10003is4goel5n0lf'//'cllxzozec0005is4gf3n66xjr';
  console.log('logInOutStatus.type')
  console.log(logInOutStatus.type)
  console.log('logInOutStatus.logInId')
  console.log(logInOutStatus.logInId)
  console.log('auctionHistory',auctionHistory)

  if(logInOutStatus.type == 'SPONSOR'){
    currentSponsorId = logInOutStatus.logInId
  }

  useEffect(()=>{
    getOverallPlayerStats()
    getAuctionHistoryOfPlayer()

  },[])

  async function getOverallPlayerStats(){
      let response = await globalApolloClient.query({
        query: GET_OVERALL_STATS_FOR_PLAYERS,
        variables:{playerId:queryPlayerId},
        fetchPolicy: 'network-only'
      })
  
      console.log('response',response.data.GetOverallStatsForPlayers)

      setPlayerData(
      {
      playerId:response.data.GetOverallStatsForPlayers.playerId,
      playerImage:response.data.GetOverallStatsForPlayers.profilePic,
      last10MatchGrowth:5,
      playerName:response.data.GetOverallStatsForPlayers.name,
      totalViewTimeGenerated:response.data.GetOverallStatsForPlayers.overallViewTime.toFixed(2),
      averageTournamentReach:response.data.GetOverallStatsForPlayers.tournamentReach*100,
      averageEstimatedViewTimePerRound:response.data.GetOverallStatsForPlayers.overallRoundEstimatedViewTime.toFixed(2),
      averageRoundViewTimePercentage:(response.data.GetOverallStatsForPlayers.overallRoundViewPercentage*100).toFixed(2),
      momentsViewTimeCreated:response.data.GetOverallStatsForPlayers.overallMomentsViewTime.toFixed(2),
      clutches:response.data.GetOverallStatsForPlayers.overallClutch,
      aces:response.data.GetOverallStatsForPlayers.overallAce,
      numberOfMatchesPlayed:response.data.GetOverallStatsForPlayers.numberOfMatches,
      numberOfRoundsPlayed:response.data.GetOverallStatsForPlayers.numberOfRounds,
      averagePercentageOpponentTeamKilled:(response.data.GetOverallStatsForPlayers.overallPercentageOfOpponentTeamKilled*100).toFixed(2),
      kills:response.data.GetOverallStatsForPlayers.kills,
      overallDamage:response.data.GetOverallStatsForPlayers.overallDamageDealt,
      auctionAvailable:true,
      nextAuction:"Date",
      }
      )


  }

  async function getAuctionHistoryOfPlayer(){
    let response = await globalApolloClient.query({
      query: GET_PLAYER_AUCTION_HISTORY,
      variables:{playerId:queryPlayerId},
      fetchPolicy: 'network-only'
    })
    console.log('response player Auction History',response.data.PlayerAuctionHistory)

    let playerAuctionHistory = []


    for(let m=0; m<=response.data.PlayerAuctionHistory.length-1; m++){

      let endDate = new Date(response.data.PlayerAuctionHistory[m].endDate);
      let tenureStartDate = new Date(response.data.PlayerAuctionHistory[m].tenureStartDate);
      let tenureEndDate = tenureStartDate.setMonth(endDate.getMonth()+response.data.PlayerAuctionHistory[m].term);
      playerAuctionHistory.push({
            winningBidValue:response.data.PlayerAuctionHistory[m].winningBid,
            auctionId:response.data.PlayerAuctionHistory[m].auctionId,
            startDate:response.data.PlayerAuctionHistory[m].tenureStartDate.split("T")[0],
            tenureEndDate:tenureEndDate,
            endDate:endDate,
            sponsorId:response.data.PlayerAuctionHistory[m].sponsorId,
            sponsorName:response.data.PlayerAuctionHistory[m].sponsorName,
            term:response.data.PlayerAuctionHistory[m].term,
            auctionStatus:response.data.PlayerAuctionHistory[m].auctionStatus
      })


    }

    console.log('playerAuctionHistory',playerAuctionHistory)

    setAuctionHistory(playerAuctionHistory);

  }

  async function bidForAuction(auctionId,bidValue){

    let response = await globalApolloClient.mutate({mutation:BID_FOR_AUCTION,
    variables:{auctionId:auctionId,bidValue:parseInt(bidValue),sponsorId:currentSponsorId}
    });

    console.log('response',response)
    // setBidPlaceError({status:})
    if(response.data.BidForAuction.message == 'Bid not sufficient'){
      let leastValue = null;
      if(auctionHistory[auctionHistory.length-1].winningBidValue > 500000)
      {
        leastValue = auctionHistory[auctionHistory.length-1].winningBidValue + 50000
      }
      else{
        leastValue = auctionHistory[auctionHistory.length-1].winningBidValue + 10000
      }
      setBidPlaceError({status:!response.data.BidForAuction.success, message:response.data.BidForAuction.message+", atleast "+leastValue+"$"});
      setTimeout(()=>{setBidPlaceError({status:false,message:null})},3000);
    }

    if(response.data.BidForAuction.message == 'Auction is CLOSED and does not accept bids.'){
      setBidPlaceError({status:!response.data.BidForAuction.success, message:'Auction has been closed'});
      setTimeout(()=>{setBidPlaceError({status:false,message:null})},3000);
    }

    getOverallPlayerStats();
    getAuctionHistoryOfPlayer();
    

  }


    const [bidAmount, setBidAmount] = useState(null);
    const [isCurrentMatchButtonHover,setIsCurrentMatchButtonHover] = useState(false);
    const [isOverallButtonHover,setIsOverallButtonHover] = useState(false);
    const [isGrowthButtonHover,setIsGrowthButtonHover] = useState(false);
  
  
  
  const handleMouseEnterOverallButton = () => {
    setIsOverallButtonHover(true);
  };
  const handleMouseLeaveOverallButton = () => {
    setIsOverallButtonHover(false);
  };

  // let currentWinningBid = null;
  let currentSpaceValueData = null
  let currentSpaceWorth = null;
  if(auctionHistory != null && auctionHistory.length !=0 ){
    console.log('auctionHistory[auctionHistory.length-1]',auctionHistory[auctionHistory.length-1])
    // if(auctionHistory[auctionHistory.length-1].status == 'OPEN'){
    //   currentWinningBid =  auctionHistory[auctionHistory.length-1].winningBidValue
    // }
    currentSpaceValueData ={}
    let previousSpaceWorth = 0;
    for(let m=0; m<=auctionHistory.length-1; m++){
      currentSpaceValueData[auctionHistory[m].startDate] = (auctionHistory[m].winningBidValue/parseInt(auctionHistory[m].term)).toFixed(2)
      if(auctionHistory[m].auctionStatus == 'CLOSED'){
        currentSpaceWorth = auctionHistory[m].winningBidValue/parseInt(auctionHistory[m].term)
        currentSpaceWorth = convertToKFormat(parseInt(currentSpaceWorth));
      }
    }

  }

  let eventsCoveredInTenure = [
    {
      name:"CCT Central Europe Series 8",
      date:"Sep 2nd - Sep 16th",
      previousViewsAchieved:300000,
    },
    {
      name:"BLAST Premier Fall Showdown 2023",
      date:"Oct 4th - Oct 8th",
      previousViewsAchieved:1500000,
    },
    {
      name:"IEM Sydney 2023",
      date:"Oct 16th - Oct22nd",
      previousViewsAchieved:2000000,
    },
    {
      name:"Thunderpick World Championship 2023",
      date:"Oct 27th - Nov5th",
      previousViewsAchieved:250000,
    },
    {
      name:"BLAST Premier Fall Final 2023",
      date:"Nov 22nd - Nov 26th",
      previousViewsAchieved:2500000,
    },
    {
      name:"Elisa Masters Espoo 2023",
      date:"Dec 29th - Dec 3rd",
      previousViewsAchieved:300000
    }
  ]

  let tenureEstimatedViews = null

  for(let m=0; m<=eventsCoveredInTenure.length-1; m++){
    tenureEstimatedViews = tenureEstimatedViews + eventsCoveredInTenure[m].previousViewsAchieved
  }


 function AuctionList({ data }) {

  let dataCopy = data.slice();

  dataCopy.reverse();

    return (
      <div  className="sponsorlist-container"> 
        {dataCopy.map((auction, index) => (
          (auction.auctionStatus == 'CLOSED')?
          <div 
            key={index}
            style={{
              display: 'flex',
              width: '100%',
              flexDirection: 'row',
              marginTop: '5px'
            }}
          >
            <div 
              style={{
                display: 'flex',
                width:'35%',
                height: '50px',
                flexDirection: 'row',
                backgroundColor: 'rgba(218, 238, 1,1)',
                borderRadius: '7px',
                justifyContent: 'center',
                alignSelf: 'center',
              }}
            >
              <span 
                style={{
                  display: 'flex',
                  alignSelf: 'center',
                  fontFamily: 'Tektur',
                  fontWeight: 'bold',
                  fontSize: '20px',
                  color: '#000000',
                }}
              >
                {auction.sponsorName}
              </span>
            </div>
  
            <div 
              style={{
                display: 'flex',
                width: '25%',
                height: '50px',
                flexDirection: 'row',
                backgroundColor: 'rgba(218, 238, 1,1)',
                borderRadius: '7px',
                justifyContent: 'center',
                alignSelf: 'center',
                marginLeft: '12px'
              }}
            >
              <span 
                style={{
                  display: 'flex',
                  alignSelf: 'center',
                  fontFamily: 'Tektur',
                  fontWeight: 'bold',
                  fontSize: '20px',
                  color: '#000000',
                }}
              >
                {`${auction.winningBidValue.toLocaleString()}$`}
              </span>
            </div>
  
            <div 
              style={{
                display: 'flex',
                width: '35%',
                height: '50px',
                flexDirection: 'row',
                backgroundColor: 'rgba(218, 238, 1,1)',
                borderRadius: '7px',
                justifyContent: 'center',
                alignSelf: 'center',
                marginLeft: '12px'
              }}
            >
              <span 
                style={{
                  display: 'flex',
                  alignSelf: 'center',
                  fontFamily: 'Tektur',
                  fontWeight: 'bold',
                  fontSize: '20px',
                  color: '#000000',
                }}
              >
                {`${new Date(auction.startDate).toLocaleString('default', { month: 'short' })} - ${new Date(auction.tenureEndDate).toLocaleString('default', { month: 'short' })} ${new Date(auction.tenureEndDate).getFullYear()}`}
              </span>
            </div>
          </div>:null
        ))}
      </div>
    );
  }

  function EventsList({ events }) {
    return (
      <div className="eventslist-container">
        {events.map((event, index) => (
          <div 
            key={index}
            style={{
              display: 'flex',
              width: '100%',
              height: '50px',
              flexDirection: 'row',
              backgroundColor: 'rgba(218, 238, 1,1)',
              borderRadius: '10px',
              marginTop: '10px',
              justifyContent: 'space-between'
            }}
          >
            <span 
              style={{
                display: 'flex',
                alignSelf: 'center',
                fontFamily: 'Tektur',
                fontWeight: 'bold',
                fontSize: '13px',
                color: '#000000',
                marginLeft: '10px'
              }}
            >
              {event.name}
            </span>
            <span 
              style={{
                display: 'flex',
                alignSelf: 'center',
                fontFamily: 'Tektur',
                fontWeight: 'bold',
                fontSize: '14px',
                color: '#000000'
              }}
            >
              {`${event.previousViewsAchieved.toLocaleString()} views`}
            </span>
            <span 
              style={{
                display: 'flex',
                alignSelf: 'center',
                fontFamily: 'Tektur',
                fontWeight: 'bold',
                fontSize: '13px',
                color: '#000000',
                marginRight: '10px'
              }}
            >
              {event.date}
            </span>
          </div>
        ))}
      </div>
    );
  }



  const renderMessage = (message) => (
    <div style={{ display: "flex", width: "100%", height: "50px", justifyContent: "center", alignItems: "center", fontFamily: "Tektur", fontWeight: "bold", fontSize: "17px", color: "rgba(218, 238, 1,1)" }}>
      {message}
    </div>
  );

    return (
  
      <div style={{display: 'flex', backgroundColor: '#000000', width: '100vw', height: '100vh', flexDirection:'column', alignSelf:'center', justifyContent: 'flex-start'}}>
  

        {/* <div style={{display:'flex', width:'100%', height:'90px', flexDirection:"row"}}>
          <div style={{display:'flex', width:'235px', height:'90px', position:'relative',alignSelf:'center', marginTop:'30px', marginLeft:'30px'}}>
            <span style={{display:'flex', position:'absolute',alignSelf:'center', fontFamily:'Black Ops One', fontWeight:'regular', fontSize:'60px', color:'rgba(218, 238, 1,1)', zIndex:2, left:0, top:0}}>spaces</span>
            <span style={{display:'flex', position:'absolute',alignSelf:'center', fontFamily:'Black Ops One', fontWeight:'regular', fontSize:'60px', color:'rgba(82, 154, 89, 0.6)', zIndex:1, left:4, top:2}}>spaces</span>
          </div>
  
          <div style={{display:'flex', width:'100vw', height:'50px', flexDirection:'row', justifyContent:'center',marginTop:'30px',}}>
            <div style={{display:'flex', width:'30vw', height:'50px',flexDirection:'row', justifyContent:'flex-start',  borderColor:'rgba(218, 238, 1,1)', borderWidth:'2px', alignSelf:'center', borderRadius:'20px', borderStyle: "solid",marginRight:'50px'}}>
              <img src={SEARCH_ICON} style={{display:'flex', alignSelf:'center', width:'20px', height:'20px', marginLeft:'20px'}}></img>
              <input
                    style={{display:'flex', width:'50%', height:'40px', backgroundColor:'transparent', borderColor:'transparent', outline:'none', WebkitAppearance:'none', borderRadius:'16px', alignSelf:'center',
                    fontFamily:'Tektur', fontWeight:'bold', fontSize:'17px', color:'rgba(218, 238, 1,1)',borderRadius:'20px', justifyContent:'flex-start', textAlign:'start', marginLeft:'10px',}}
                    value={playerSearchValue}
                    placeholder={""}
                    onChange={(e) => {
                      setPlayerSearchValue(e.target.value);
                      }}
                      />
            </div>
            <button style={{display:'flex', width:'250px', height:'50px',borderRadius:'20px',backgroundColor:isKeyMomentsButtonHover?'rgba(218, 238, 1,1)':'#000000', marginRight:'50px',borderWidth:'2px',borderColor:isKeyMomentsButtonHover?'transparent':'rgba(218, 238, 1,1)',borderStyle: "solid", justifyContent:'center', cursor:'pointer'}}
            onMouseEnter={handleMouseEnterKeyMomentsButton}
            onMouseLeave={handleMouseLeaveKeyMomentsButton}>
              <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px', color:isKeyMomentsButtonHover?'#000000':'rgba(218, 238, 1,1)'}}>key moments tool</span>
            </button>
            <button style={{display:'flex', width:'250px', height:'50px',borderRadius:'20px',backgroundColor:isYourMetricsButtonHover?'rgba(218, 238, 1,1)':'#000000', borderWidth:'2px',borderColor:isYourMetricsButtonHover?'transparent':'rgba(218, 238, 1,1)',borderStyle: "solid", justifyContent:'center', cursor:'pointer'}}
            onMouseEnter={handleMouseEnterYourMetricsButton}
            onMouseLeave={handleMouseLeaveYourMetricsButton}>
              <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px', color:isYourMetricsButtonHover?'#000000':'rgba(218, 238, 1,1)'}}>your metrics</span>
            </button>
          </div>
        </div> */}
        <Header/>

        {(playerData != null)?
        <div style ={{display:'flex', width:"98%", height:'57%', flexDirection:'row', marginTop:'20px', alignSelf:'center', borderRadius:'10px',}}>
          <div style={{display:'flex', width:'28%', marginLeft:"2px", marginRight:'10px'}}>
          <img src={playerData.playerImage} style={{display:'flex',width:'100%', height:'98%', borderRadius:'10px',}}></img>
          </div>

          <div style={{display:'flex', width:'68%', flexDirection:'column', backgroundColor:'rgba(218, 238, 1,1)', marginLeft:'10px', borderRadius:'10px', paddingLeft:"10px", paddingRight:'10px', paddingBottom:'10px ' }}>
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px', marginTop:'10px'}}>{playerData.playerName}</span>
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>current space worth</span>

          {(currentSpaceWorth!=null)?
          <div style={{display:'flex', width:'100%', flexDirection:'row', marginBottom:'10px'}}>
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'40px', color:'#000000', marginLeft:'10px'}}>${currentSpaceWorth}<span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginTop:'25px', marginLeft:"5px"}}>per month</span></span>
          </div>:null}
                    
          
          {(currentSpaceValueData!=null)?
          <LineChart data={currentSpaceValueData} />:null}


          <div style={{display:'flex', width:'100%', flexDirection:'row', marginTop:'10px'}}>
          <div style={{display:'flex', marginLeft:'0px', flexDirection:'column'}}>
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>total view time</span>  
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{playerData.totalViewTimeGenerated}<span style={{fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px',marginTop:'10px', magrinLeft:'5px'}}>s</span></span>
          </div>

          <div style={{display:'flex', marginLeft:'15px', flexDirection:'column'}}>
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>tournament reach</span> 
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{playerData.averageTournamentReach}<span style={{fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px',marginTop:'10px', magrinLeft:'5px'}}>%</span></span>
          </div> 
          
          <div style={{display:'flex', marginLeft:'15px', flexDirection:'column'}}>
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>estimated round view time </span>  
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{playerData.averageEstimatedViewTimePerRound}<span style={{fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px',marginTop:'10px', magrinLeft:'5px'}}>s</span></span>
          </div>
          
          <div style={{display:'flex', marginLeft:'15px', flexDirection:'column'}}>
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>moments view time</span>  
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{playerData.momentsViewTimeCreated}<span style={{fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px',marginTop:'10px', magrinLeft:'5px'}}>s</span></span>
          </div>
          
          <div style={{display:'flex', marginLeft:'15px', flexDirection:'column'}}>
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>round view time occcupied</span>  
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{playerData.averageRoundViewTimePercentage}<span style={{fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px',marginTop:'10px', magrinLeft:'5px'}}>%</span></span>
          </div>

          </div>

          <div style={{display:'flex', width:'100%', flexDirection:'row', marginTop:"10px"}}>
          <div style={{display:'flex', marginLeft:'0px', flexDirection:'column'}}>
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>matches</span>  
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{playerData.numberOfMatchesPlayed}</span>
          </div>

          <div style={{display:'flex', marginLeft:'15px', flexDirection:'column'}}>
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>rounds</span> 
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{playerData.numberOfRoundsPlayed}</span>
          </div> 
          
          <div style={{display:'flex', marginLeft:'15px', flexDirection:'column'}}>
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>ace/clutch</span>  
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{playerData.aces}/{playerData.clutches}</span>
          </div>
          
          <div style={{display:'flex', marginLeft:'15px', flexDirection:'column'}}>
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>percentage of team killed</span>  
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{playerData.averagePercentageOpponentTeamKilled}%<span style={{fontSize:'15px', marginLeft:'10px', marginTop:'15px'}}>per round</span></span>
          </div>
          
          <div style={{display:'flex', marginLeft:'15px', flexDirection:'column'}}>
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>kills</span>  
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{playerData.kills}</span>
          </div>

          <div style={{display:'flex', marginLeft:'15px', flexDirection:'column', marginBottom:'10px'}}>
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>damage</span>  
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{playerData.overallDamage}</span>
          </div>
          </div>
          </div>
            
        </div>:
        null
        }

        {(playerData != null)?
        <div style={{display:'flex', width:'98%', height:'25%',marginTop:'10px', alignSelf:'center', borderRadius:'10px'}}>
        

        {(auctionHistory != null && auctionHistory.length!=0 && auctionHistory[auctionHistory.length-1].auctionStatus == 'OPEN')?
        <div style={{display:'flex', width:'28%', height:'100%', flexDirection:'column', borderRadius:'20px'}}>
          
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'18px', color:'rgba(218, 238, 1,1)', marginLeft:'10px', marginTop:'10px'}}>ends {monthNames[new Date(auctionHistory[auctionHistory.length-1].endDate).getMonth()]} {new Date(auctionHistory[auctionHistory.length-1].endDate).getDate()} - tenure {auctionHistory[auctionHistory.length-1].term} months</span>
          
          <div style={{display:'flex', width:'100%', height:'50px', flexDirection:'row', backgroundColor:'rgba(218, 238, 1,1)', borderRadius:'10px', marginTop:'10px', justifyContent:'space-between'}}>
          <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'20px',}}>current winning bid</span>
          <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'28px', color:'#000000', marginRight:'20px',}}>{auctionHistory[auctionHistory.length-1].winningBidValue}$</span>
          </div>

          <div style={{display:'flex', width:'100%', height:'50px', flexDirection:'row', backgroundColor:'rgba(218, 238, 1,1)', borderRadius:'10px', marginTop:'10px', justifyContent:'space-between'}}>
          <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'20px',}}>tenure estimated views</span>
          <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'28px', color:'#000000', marginRight:'20px',}}>{tenureEstimatedViews}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "row", marginTop: "20px" }}>
            {currentSponsorId === null ? (
              renderMessage("log in as sponsor & place bid")
            ) : currentSponsorId === auctionHistory[auctionHistory.length-1].sponsorId?
              renderMessage("you own the winning bid")
            :bidPlaceError.status ? (
              renderMessage(bidPlaceError.message)
            ) : (
              <>
                <div style={{ display: "flex" , width: "50%", height: "50px", flexDirection: "row", justifyContent: "flex-start", borderColor: "rgba(218, 238, 1,1)", borderWidth: "2px", alignSelf: "center", borderRadius: "20px", borderStyle: "solid" }}>
                  <input
                    style={{ display: "flex", width: "100%", height: "40px", backgroundColor: "transparent", borderColor: "transparent", outline: "none", WebkitAppearance: "none", borderRadius: "16px", alignSelf: "center", fontFamily: "Tektur", fontWeight: "bold", fontSize: "17px", color: "rgba(218, 238, 1,1)", borderRadius: "20px", justifyContent: "flex-start", textAlign: "center" }}
                    value={bidAmount}
                    type="number"
                    placeholder={"enter amount"}
                    onChange={(e) => {
                      setBidAmount(e.target.value);
                    }}
                  />
                </div>
                <button
                  style={{ display: "flex", width: "50%", height: "50px", borderRadius: "20px", backgroundColor: isOverallButtonHover ? "rgba(218, 238, 1,1)" : "#000000", marginLeft: "20px", borderWidth: "2px", borderColor: isOverallButtonHover ? "transparent" : "rgba(218, 238, 1,1)", borderStyle: "solid", justifyContent: "center", cursor: "pointer" }}
                  onClick={()=>{
                    if((bidAmount)>0){
                      bidForAuction(auctionHistory[auctionHistory.length-1].auctionId,bidAmount)
                    }
                  }}
                  onMouseEnter={handleMouseEnterOverallButton}
                  onMouseLeave={handleMouseLeaveOverallButton}
                >
                  <span style={{ display: "flex", alignSelf: "center", fontFamily: "Tektur", fontWeight: "bold", fontSize: "20px", color: isOverallButtonHover ? "#000000" : "rgba(218, 238, 1,1)" }}>bid</span>
                </button>
              </>
            )}
          </div>
          
        </div>
        :null}

        {(auctionHistory != null && auctionHistory.length!=0 )?
        <div style={{display:'flex', width:'40%', height:'100%', flexDirection:'column', borderRadius:'20px', marginLeft:'20px'}}>
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'18px', color:'rgba(218, 238, 1,1)', marginLeft:'10px', marginTop:'10px'}}>previous sponsors</span>
            <AuctionList data={auctionHistory}/>          
        </div>:null}

        {(eventsCoveredInTenure != null)?
        <div style={{display:'flex', width:'40%', height:'100%', flexDirection:'column', borderRadius:'20px', marginLeft:'20px'}}>
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'18px', color:'rgba(218, 238, 1,1)', marginLeft:'10px', marginTop:'10px'}}>events covered in upcoming tenure</span>
             <EventsList events={eventsCoveredInTenure}/>       
        </div>:null}

        </div>:
        null}
  
      </div>
  
    );
}

export default Player;
  