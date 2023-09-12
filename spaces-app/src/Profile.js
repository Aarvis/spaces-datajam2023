import React, { useEffect, useRef, useState } from "react";
import './App.css';
import Header from "./Header";
import UP_ARROW from "./assets/Icons/upGreen.png";
import DOWN_ARROW from "./assets/Icons/redDown.png";
import './PlayerViewList.css';

import { LineChart, PieChart } from 'react-chartkick';
import 'chartkick/chart.js'
import { globalApolloClient } from "./App";
import {GET_OVERALL_STATS_FOR_PLAYERS, 
  GET_PLAYER_AUCTION_HISTORY, 
  GET_BIDS_FROM_AUCTION, 
  BID_FOR_AUCTION,OPEN_BID, 
  GET_AUCTIONS_WON_BY_SPONSOR, 
  GET_BIDS_FROM_AUCTION_SPONSOR_PARTICIPATED, 
  GET_SPONSOR_TENURE_STATS,
  GET_SPONSOR_DETAILS} from "./graphqlResolverTemplate"
import { current } from "@reduxjs/toolkit";
import { useNavigate } from 'react-router-dom';
import { setHeaderUI } from "./redux/reducers/headerUIReducer";
import { useDispatch } from "react-redux";
import amd_aug from './assets/Images/CSGO gun/amd_aug.jpg';
import amd_aug_ortho from './assets/Images/CSGO gun/amd_aug_ortho.jpg';
import amd_awp from './assets/Images/CSGO gun/amd_awp.jpg';
import amd_awp_ortho from './assets/Images/CSGO gun/amd_awp_ortho.jpg';
import amd_smg from './assets/Images/CSGO gun/amd_smg.jpg';
import amd_smg_ortho from './assets/Images/CSGO gun/amd_smg_ortho.jpg';
import aws_aug from './assets/Images/CSGO gun/aws_aug.jpg';
import aws_aug_ortho from './assets/Images/CSGO gun/aws_aug_ortho.jpg';
import aws_awp from './assets/Images/CSGO gun/aws_awp.jpg';
import aws_awp_ortho from './assets/Images/CSGO gun/aws_awp_ortho.jpg';
import aws_smg from './assets/Images/CSGO gun/aws_Smg.jpg';
import aws_smg_ortho from './assets/Images/CSGO gun/aws_smg_ortho.jpg';
import dhl_aug from './assets/Images/CSGO gun/dhl_aug.jpg';
import dhl_aug_ortho from './assets/Images/CSGO gun/dhl_aug_ortho.jpg';
import dhl_awp from './assets/Images/CSGO gun/dhl_awp.jpg';
import dhl_awp_ortho from './assets/Images/CSGO gun/dhl_awp_ortho.jpg';
import dhl_smg from './assets/Images/CSGO gun/dhl_smg.jpg';
import dhl_smg_ortho from './assets/Images/CSGO gun/dhl_smg_ortho.jpg';
import intel_awp from './assets/Images/CSGO gun/intel_awp.jpg';
import intel_smg from './assets/Images/CSGO gun/intel_smg.jpg';
import intel_aug from './assets/Images/CSGO gun/intel_aug.jpeg';
import intel_aug_ortho from './assets/Images/CSGO gun/intel_aug_ortho.jpeg';
import intel_smg_ortho from './assets/Images/CSGO gun/intel_smg_ortho.jpg';
import microsoft_aug from './assets/Images/CSGO gun/microsoft_aug.jpg';
import microsoft_aug_ortho from './assets/Images/CSGO gun/microsoft_aug_ortho.jpg';
import microsoft_awp from './assets/Images/CSGO gun/microsoft_awp.jpg';
import microsoft_awp_ortho from './assets/Images/CSGO gun/microsoft_awp_ortho.jpg';
import microsoft_smg from './assets/Images/CSGO gun/microsoft_smg.jpg';
import microsoft_smg_ortho from './assets/Images/CSGO gun/microsoft_smg_ortho.jpg';
import monster_aug from './assets/Images/CSGO gun/monster_aug.jpg';
import monster_aug_ortho from './assets/Images/CSGO gun/monster_aug_ortho.jpg';
import monster_awp from './assets/Images/CSGO gun/monster_awp.jpg';
import monster_awp_ortho from './assets/Images/CSGO gun/monster_awp_ortho.jpg';
import monster_smg from './assets/Images/CSGO gun/monster_smg.jpg';
import monster_smg_ortho from './assets/Images/CSGO gun/monster_smg_ortho.jpg';
import nvidia_aug from './assets/Images/CSGO gun/nvidia_aug.jpg';
import nvidia_aug_ortho from './assets/Images/CSGO gun/nvidia_aug_ortho.jpg';
import nvidia_awp from './assets/Images/CSGO gun/nvidia_awp.jpg';
import nvidia_awp_ortho from './assets/Images/CSGO gun/nvidia_awp_ortho.jpg';
import nvidia_smg from './assets/Images/CSGO gun/nvidia_smg.jpg';
import nvidia_smg_ortho from './assets/Images/CSGO gun/nvidia_smg_ortho.jpg';
import prime_awp from './assets/Images/CSGO gun/prime_awp.jpg';
import prime_smg from './assets/Images/CSGO gun/prime_smg.jpg';
import prime_smg_ortho from './assets/Images/CSGO gun/prime_smg_ortho.jpg';
import prime_aug from './assets/Images/CSGO gun/prime_aug.jpeg';
import prime_aug_ortho from './assets/Images/CSGO gun/prime_aug_ortho.jpeg';
import redbull_aug from './assets/Images/CSGO gun/redbull_aug.jpg';
import redbull_aug_ortho from './assets/Images/CSGO gun/redbull_aug_ortho.jpg';
import redbull_awp from './assets/Images/CSGO gun/redbull_awp.jpg';
import redbull_awp_ortho from './assets/Images/CSGO gun/redbull_awp_ortho.jpg';
import redbull_smg from './assets/Images/CSGO gun/redbull_smg.jpg';
import redbull_smg_ortho from './assets/Images/CSGO gun/redbull_smg_ortho.jpg';
import samsung_aug from './assets/Images/CSGO gun/samsung_Aug.jpg';
import samsung_aug_ortho from './assets/Images/CSGO gun/samsung_aug_ortho.jpg';
import samsung_awp from './assets/Images/CSGO gun/samsung_awp.jpg';
import samsung_awp_ortho from './assets/Images/CSGO gun/samsung_awp_ortho.jpg';
import samsung_smg from './assets/Images/CSGO gun/samsung_smg.jpg';
import samsung_smg_ortho from './assets/Images/CSGO gun/samsung_smg_ortho.jpg';


const sponsorImages = {
  amd_aug,
  amd_aug_ortho,
  amd_awp,
  amd_awp_ortho,
  amd_smg,
  amd_smg_ortho,
  aws_aug,
  aws_aug_ortho,
  aws_awp,
  aws_awp_ortho,
  aws_smg,
  aws_smg_ortho,
  dhl_aug,
  dhl_aug_ortho,
  dhl_awp,
  dhl_awp_ortho,
  dhl_smg,
  dhl_smg_ortho,
  intel_awp,
  intel_smg,
  intel_smg_ortho,
  intel_aug,
  intel_aug_ortho,
  microsoft_aug,
  microsoft_aug_ortho,
  microsoft_awp,
  microsoft_awp_ortho,
  microsoft_smg,
  microsoft_smg_ortho,
  monster_aug,
  monster_aug_ortho,
  monster_awp,
  monster_awp_ortho,
  monster_smg,
  monster_smg_ortho,
  nvidia_aug,
  nvidia_aug_ortho,
  nvidia_awp,
  nvidia_awp_ortho,
  nvidia_smg,
  nvidia_smg_ortho,
  prime_awp,
  prime_smg,
  prime_smg_ortho,
  prime_aug,
  prime_aug_ortho,
  redbull_aug,
  redbull_aug_ortho,
  redbull_awp,
  redbull_awp_ortho,
  redbull_smg,
  redbull_smg_ortho,
  samsung_aug,
  samsung_aug_ortho,
  samsung_awp,
  samsung_awp_ortho,
  samsung_smg,
  samsung_smg_ortho,
  prime_aug,
  prime_aug_ortho
};

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



const IMAGE_PATH = './assets/Images/';
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const SponsorImages = ({ sponsorName }) => {
    // Sample list of guns for simplicity. You can make it dynamic if needed.
    const guns = ['awp','aug','smg'];
  
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', width:"100%", height:"100%", marginTop:'20px' }}>
        <div className="sponsorImages-container" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: "100%", overflowX: 'auto' }}>
            {guns.map((gun) => {
              const imageName = `${sponsorName.toLowerCase()}_${gun}`;
              const orthoImageName = `${imageName}_ortho`;
              return (
                <div key={imageName} style={{display:'flex', flexDirection:'row', marginRight: '10px'}}>
                {(sponsorImages[imageName]!= null && sponsorImages[imageName]!= undefined)?
                  <img
                    src={sponsorImages[imageName]}
                    style={{ width: '534px', height: '300px', borderRadius: '15px', marginRight: '10px' }} 
                  />:null}
                  {(sponsorImages[orthoImageName]!= null && sponsorImages[orthoImageName]!= undefined)?
                  <img
                    src={sponsorImages[orthoImageName]}
                    style={{ width: '534px', height: '300px', borderRadius: '15px' }} 
                  />:null}
                </div>
              );
            })}
        </div>
      </div>
    );
  };

function Profile() {

  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [playerData, setPlayerData] = useState(null);
  const [sponsorName, setSponsorName] = useState(null);
  const [auctionHistory,setAuctionHistory] = useState(null);
  const [sponsorAuctionsWon, setSponsorAuctionsWon] = useState(null);
  const [tenureDuration, setTenureDuration] = useState(null);
  const [openAuctionError, setOpenAuctionError] = useState({status:false, message:null});
  const [openAuctionUI, setOpenAuctionUI] = useState(false);
  const [currentAuctionTab, setCurrentAuctionTab] = useState('ON_GOING')
  const [sponsorListTab, setSponsorListTab] = useState('SPONSORSHIPS');
  const [currentAuctionBids, setCurrentAuctionBids] = useState(null);
  const [startingValue,setStartingValue] = useState(null);
  const [sponsorBidValueInOpenAuction,setSponsorBidValueInOpenAuction] = useState(null);
  const [sponsorTenureStatsData,setSponsorTenureStatsData] = useState('INITIATED');
  const [bidsFromOpenAuctionSponsorParticipated,setBidsFromOpenAuctionSponsorParticipated] = useState(null);
  let currentSponsorId = null;
  let logInTypeGlobal = null;

  try{
    logInTypeGlobal = localStorage.getItem('loginType')
  }catch(e){
    console.log('error',e)
  }

  console.log('auctionHistory',auctionHistory)

  useEffect(()=>{
    getLogInPlayerIdAndPopulatedData()
  },[])

  async function getLogInPlayerIdAndPopulatedData(){
    let logInId = await localStorage.getItem('loginId') 
    let logInType = await localStorage.getItem('loginType')
    // console.log('loginId', logInId)
    // console.log('loginType', logInType) 
    if(logInType == 'PLAYER'){
        console.log('-----------------IN-----------------')
        getOverallPlayerStats(logInId)
        getAuctionHistoryOfPlayer(logInId)
    }
    else{
      getSponsorName(logInId)
      getAuctionWonBySponsor(logInId)
      getBidsFromOpenAuctionsSponsorParticipated(logInId)
    }
  }

  async function getSponsorName(logInId){

    let response = await globalApolloClient.query({
      query: GET_SPONSOR_DETAILS,
      variables:{sponsorId:logInId},
      fetchPolicy: 'network-only'
    })

    console.log('sponsorName',response.data.GetSponsorDetails.sponsorName)
    setSponsorName(response.data.GetSponsorDetails.sponsorName)

  }

  async function getBidsFromAuction(auctionId){

    let response = await globalApolloClient.query({
      query: GET_BIDS_FROM_AUCTION,
      variables:{auctionId:auctionId},
      fetchPolicy: 'network-only'
    })

    console.log('response',response.data.GetBidsFromAuction[0].bids)
    setCurrentAuctionBids(response.data.GetBidsFromAuction[0].bids)

  }

  async function getOverallPlayerStats(playerId){
      let response = await globalApolloClient.query({
        query: GET_OVERALL_STATS_FOR_PLAYERS,
        variables:{playerId:playerId},
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
      momentsViewTimeCreated:(response.data.GetOverallStatsForPlayers.overallMomentsViewTime).toFixed(2),
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

  async function getAuctionHistoryOfPlayer(playerId){
    let response = await globalApolloClient.query({
      query: GET_PLAYER_AUCTION_HISTORY,
      variables:{playerId:playerId},
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

    if(playerAuctionHistory[playerAuctionHistory.length-1].auctionStatus == 'OPEN'){
      await getBidsFromAuction(playerAuctionHistory[playerAuctionHistory.length-1].auctionId)
    }
    else{
      setCurrentAuctionTab('PREVIOUS')
    }

    setAuctionHistory(playerAuctionHistory);

  }

  async function getAuctionWonBySponsor(sponsorId){
    let response = await globalApolloClient.query({
      query: GET_AUCTIONS_WON_BY_SPONSOR,
      variables:{sponsorId:sponsorId},
      fetchPolicy: 'network-only'
    })

    console.log('response',response)
    console.log('response.data.GetAuctionsWonBySponsor.auctionsWon',response.data.GetAuctionsWonBySponsor.auctionsWon)


    
    let auctionsWon = []

    for(let m=0; m<=response.data.GetAuctionsWonBySponsor.auctionsWon.length-1; m++){

      let endDate = new Date(response.data.GetAuctionsWonBySponsor.auctionsWon[m].endDate);
      let tenureStartDate = new Date(response.data.GetAuctionsWonBySponsor.auctionsWon[m].tenureStartDate);
      let tenureEndDate = tenureStartDate.setMonth(endDate.getMonth()+response.data.GetAuctionsWonBySponsor.auctionsWon[m].term);
      auctionsWon.push({
            winningBidValue:response.data.GetAuctionsWonBySponsor.auctionsWon[m].winningBidValue,
            auctionId:response.data.GetAuctionsWonBySponsor.auctionsWon[m].auctionId,
            startDate:response.data.GetAuctionsWonBySponsor.auctionsWon[m].tenureStartDate.split("T")[0],
            tenureEndDate:tenureEndDate,
            endDate:endDate,
            term:response.data.GetAuctionsWonBySponsor.auctionsWon[m].term,
            auctionStatus:response.data.GetAuctionsWonBySponsor.auctionsWon[m].auctionStatus,
            player:response.data.GetAuctionsWonBySponsor.auctionsWon[m].player,
            winningSponsorTenureStats:response.data.GetAuctionsWonBySponsor.auctionsWon[m].winningSponsorTenureStats,
            sponsorTenureStatsId:response.data.GetAuctionsWonBySponsor.auctionsWon[m].sponsorTenureStatsId,
      })


    }

    setSponsorAuctionsWon(auctionsWon)
  }

  async function getBidsFromOpenAuctionsSponsorParticipated(sponsorId){
    let response = await globalApolloClient.query({
      query: GET_BIDS_FROM_AUCTION_SPONSOR_PARTICIPATED,
      variables:{sponsorId:sponsorId},
      fetchPolicy: 'network-only'
    })

    let bidsOpenAuctionSponsor = []
    let sponsorBidValueInOpenAuctions = []

    let index = 0;

    for(let m=0; m<=response.data.GetBidsFromOpenAuctionSponsorParticipated.length-1; m++){
      if(response.data.GetBidsFromOpenAuctionSponsorParticipated[m].auction.auctionStatus == 'OPEN'){
        bidsOpenAuctionSponsor.push(response.data.GetBidsFromOpenAuctionSponsorParticipated[m].auction); 
        for(let n=response.data.GetBidsFromOpenAuctionSponsorParticipated[m].auction.bids.length-1; n>=0; n--){
          if(response.data.GetBidsFromOpenAuctionSponsorParticipated[m].auction.bids[n].sponsorId == sponsorId){
            sponsorBidValueInOpenAuctions.push({
              bidValue:response.data.GetBidsFromOpenAuctionSponsorParticipated[m].auction.bids[n].bidValue,
              sponsorId:response.data.GetBidsFromOpenAuctionSponsorParticipated[m].auction.bids[n].sponsorId,
              auctionId:response.data.GetBidsFromOpenAuctionSponsorParticipated[m].auction.auctionId
            })
            break;
          }
        }
        index = index + 1
      }
    }

    console.log('bidsOpenAuctionSponsor',bidsOpenAuctionSponsor);
    console.log('sponsorBidValueInOpenAuctions',sponsorBidValueInOpenAuctions);

    setSponsorBidValueInOpenAuction(sponsorBidValueInOpenAuctions)
    setBidsFromOpenAuctionSponsorParticipated(bidsOpenAuctionSponsor)

  }

  async function openAuction(playerId,startingValue,term){
    console.log('playerId',playerId)
    console.log('startingValue',startingValue)
    console.log('term',term)
    console.log('new Date()',new Date())
    let logInId = await localStorage.getItem('loginId') 

    let response = await globalApolloClient.mutate({mutation:OPEN_BID,
      variables:{playerId:playerId,startingValue:parseInt(startingValue),term:parseInt(term), startDate:String(new Date())}
      });

      console.log('response',response)
      
      if(response.data.OpenBid.success == true){
        getAuctionHistoryOfPlayer(logInId)
      }
  }

  async function getSponsorTenureStats(sponsorTenureStatsId){
    console.log('sponsorTenureStatsId',sponsorTenureStatsId)
    if(sponsorTenureStatsId!=null){
    let response = await globalApolloClient.query({query:GET_SPONSOR_TENURE_STATS, variables:{
      sponsorTenureStatsId:sponsorTenureStatsId,
    },fetchPolicy:'network-only'})

    console.log('response',response)

    setSponsorTenureStatsData(  {
      playerId:response.data.GetSponsorTenureStats.playerId,
      // playerImage:response.data.GetSponsorTenureStats.player.profilePic,
      playerName:response.data.GetSponsorTenureStats.player.name,
      totalViewTimeGenerated:response.data.GetSponsorTenureStats.overallViewTime.toFixed(2),
      averageTournamentReach:response.data.GetSponsorTenureStats.tournamentReach*100,
      averageEstimatedViewTimePerRound:response.data.GetSponsorTenureStats.overallRoundEstimatedViewTime.toFixed(2),
      averageRoundViewTimePercentage:(response.data.GetSponsorTenureStats.overallRoundViewPercentage*100).toFixed(2),
      momentsViewTimeCreated:response.data.GetSponsorTenureStats.overallMomentsViewTime,
      clutches:response.data.GetSponsorTenureStats.overallClutch,
      aces:response.data.GetSponsorTenureStats.overallAce,
      numberOfMatchesPlayed:response.data.GetSponsorTenureStats.numberOfMatches,
      numberOfRoundsPlayed:response.data.GetSponsorTenureStats.numberOfRounds,
      averagePercentageOpponentTeamKilled:(response.data.GetSponsorTenureStats.overallPercentageOfOpponentTeamKilled*100).toFixed(2),
      kills:response.data.GetSponsorTenureStats.kills,
      headshots:response.data.GetSponsorTenureStats.headshots,
      killAssistsReceived:response.data.GetSponsorTenureStats.killAssistsReceived,
      killAssistsGiven:response.data.GetSponsorTenureStats.killAssistsGiven,
      overallDamage:response.data.GetSponsorTenureStats.overallDamageDealt,
    })
    }
    else{
      setSponsorTenureStatsData(null);
    }

  }

  // async function bidForAuction(auctionId,bidValue){

  //   let response = await globalApolloClient.mutate({mutation:BID_FOR_AUCTION,
  //   variables:{auctionId:auctionId,bidValue:parseInt(bidValue),sponsorId:currentSponsorId}
  //   });

  //   console.log('response',response)
  //   // setBidPlaceError({status:})
  //   if(response.data.BidForAuction.message == 'Bid not sufficient'){
  //     let leastValue = null;
  //     if(auctionHistory[auctionHistory.length-1].winningBidValue > 500000)
  //     {
  //       leastValue = auctionHistory[auctionHistory.length-1].winningBidValue + 50000
  //     }
  //     else{
  //       leastValue = auctionHistory[auctionHistory.length-1].winningBidValue + 10000
  //     }
  //     setBidPlaceError({status:!response.data.BidForAuction.success, message:response.data.BidForAuction.message+", atleast "+leastValue+"$"});
  //     setTimeout(()=>{setBidPlaceError({status:false,message:null})},3000);
  //   }

  //   getOverallPlayerStats();
  //   getAuctionHistoryOfPlayer();
    

  // }

  const [bidAmount, setBidAmount] = useState(null);
  const [isCurrentMatchButtonHover,setIsCurrentMatchButtonHover] = useState(false);
  const [isOverallButtonHover,setIsOverallButtonHover] = useState(false);
  const [isBackAuctionButtonHover,setIsBackAuctionButtonHover] = useState(false);
  const [isGrowthButtonHover,setIsGrowthButtonHover] = useState(false);
  const [isPrevAuctionButtonHover,setPrevAuctionButtonHover] = useState(false);
  
  
  const handleMouseEnterPrevAuctionButton = () => {
    setPrevAuctionButtonHover(true);
  };
  const handleMouseLeavePrevAuctionButton = () => {
    setPrevAuctionButtonHover(false);
  };
    

  
  
  const handleMouseEnterBackAuctionButton = () => {
    setIsBackAuctionButtonHover(true);
  };
  const handleMouseLeaveBackAuctionButton = () => {
    setIsBackAuctionButtonHover(false);
  };

  const handleMouseEnterOverallButton = () => {
    setIsOverallButtonHover(true);
  };
  const handleMouseLeaveOverallButton = () => {
    setIsOverallButtonHover(false);
  };

  // let currentWinningBid = null;
  let currentSpaceValueData = {}
  let currentSpaceWorth = null;
  if(auctionHistory != null ){
    console.log('auctionHistory[auctionHistory.length-1]',auctionHistory[auctionHistory.length-1])
    // if(auctionHistory[auctionHistory.length-1].status == 'OPEN'){
    //   currentWinningBid =  auctionHistory[auctionHistory.length-1].winningBidValue
    // }
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
      name:"IEM Katowice 2021",
      date:"Feb 16th - Feb 28th",
      previousViewsAchieved:1000000,
    },
    {
      name:"ESL Pro League Season 13",
      date:"Mar 8th - Apr 11th",
      previousViewsAchieved:750000,
    },
    {
      name:"Flashpoint Season 3",
      date:"May 10th - May 30th",
      previousViewsAchieved:400000,
    },
    {
      name:"IEM Summer 2021",
      date:"Jun 3rd - Jun 13th",
      previousViewsAchieved:650000,
    },
    {
      name:"BLAST Premier Spring Final 2021",
      date:"Jun 15th - Jun 20th",
      previousViewsAchieved:900000,
    },
    {
      name:"IEM Cologne 2021",
      date:"Jul 6th - Jul 18th",
      previousViewsAchieved:1100000,
    },
    {
      name:"ESL Pro League Season 14",
      date:"Aug 16th - Sep 12th",
      previousViewsAchieved:800000,
    },
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
    },
    {
      name:"Winter Rumble 2021",
      date:"Dec 5th - Dec 20th",
      previousViewsAchieved:700000,
    },
    {
      name:"Global Showdown 2022",
      date:"Feb 10th - Feb 25th",
      previousViewsAchieved:1200000,
    },
    {
      name:"Champions League 2022",
      date:"Mar 8th - Mar 23rd",
      previousViewsAchieved:1400000,
    },
    {
      name:"BLAST Premier Spring Showdown 2022",
      date:"Apr 5th - Apr 19th",
      previousViewsAchieved:1500000,
    },
    {
      name:"Global Invitational 2022",
      date:"May 2nd - May 17th",
      previousViewsAchieved:1000000,
    },
    {
      name:"Champion's Trophy 2023",
      date:"Jan 3rd - Jan 18th",
      previousViewsAchieved:1250000,
    },
    {
      name:"Global Championship 2023",
      date:"Mar 5th - Mar 22nd",
      previousViewsAchieved:1550000,
    },
    {
      name:"Summer Blast 2023",
      date:"Jun 6th - Jun 20th",
      previousViewsAchieved:950000,
    },
    {
      name:"World Finals 2024",
      date:"Feb 4th - Feb 19th",
      previousViewsAchieved:2000000,
    },
    {
      name:"Spring Invitational 2024",
      date:"Apr 2nd - Apr 16th",
      previousViewsAchieved:1350000,
    },
    {
      name:"Master's Cup 2024",
      date:"Jun 10th - Jun 25th",
      previousViewsAchieved:1100000,
    }
  ];
  
  // Now, sort them chronologically
  eventsCoveredInTenure.sort((a, b) => {
    let dateA = new Date(a.date.split(" - ")[0]);
    let dateB = new Date(b.date.split(" - ")[0]);
    return dateA - dateB;
  });
  
  let tenureEstimatedViews = null

  for(let m=0; m<=eventsCoveredInTenure.length-1; m++){
    tenureEstimatedViews = tenureEstimatedViews + eventsCoveredInTenure[m].previousViewsAchieved
  }


 function AuctionList({ data }) {

  let dataCopy = data.slice();
  dataCopy.pop();
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

  function CurrentBids({ data }) {

    let dataCopy = data.slice();
  
    dataCopy.reverse();
    console.log('dataCopy')
    console.log(dataCopy)
  
      return (
        <div  className="sponsorlist-container"> 
          {dataCopy.map((bid, index) => (
            <div 
              key={index}
              style={{
                display: 'flex',
                width: '100%',
                flexDirection: 'row',
                marginTop: '5px',
                justifyContent:'center'
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
                  {bid.bidValue}$
                </span>
              </div>

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
                  marginLeft:'20px'
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
                  **********
                </span>
              </div>
  
            </div>
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

  function AuctionSponsorList({ data }) {

    console.log('AuctionSponsorList data',data);
    let dataCopy = data.slice();
    dataCopy.reverse();

    const [selectedItemIndex,setSelectedItemIndex] = useState(null);
    // console.log('selectedItemIndex',selectedItemIndex)
    // let selectedItemIndex = null;


      return (
        <div  className="sponsorlist-container-sponsor"> 
          {dataCopy.map((auction, index) => {


            function TenureButton ({data,itemIndex}){
              const [isTenureButtonHover, setTenureButtonHover] = useState(false);
              console.log('itemIndex',itemIndex)

              const handleMouseEnterTenureButton = () => {
                setTenureButtonHover(true);
              };
              const handleMouseLeaveTenureButton = () => {
                setTenureButtonHover(false);
              };

              console.log('playerData', playerData)

              return(
                <button 
              key={itemIndex}
              style={{
                display: 'flex',
                width: '100%',
                flexDirection: 'row',
                marginTop: '5px',
                borderRadius:'20px',
                backgroundColor:isTenureButtonHover || (selectedItemIndex ==itemIndex)?'rgba(218, 238, 1,1)':'#000000',
                borderColor:isTenureButtonHover|| (selectedItemIndex ==itemIndex)?'#000000':'rgba(218, 238, 1,1)',
                borderWidth:'2px',
                borderStyle:'solid'
              }}

              onMouseEnter={handleMouseEnterTenureButton}
              onMouseLeave={handleMouseLeaveTenureButton}

              onClick={()=>{
                getSponsorTenureStats(data.sponsorTenureStatsId);
                setSelectedItemIndex(itemIndex);
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  width:'30%',
                  height: '50px',
                  flexDirection: 'row',
                  backgroundColor:isTenureButtonHover|| (selectedItemIndex == itemIndex)?'rgba(218, 238, 1,1)':'#000000',
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
                    color: isTenureButtonHover|| (selectedItemIndex == itemIndex)?'#000000':'rgba(218, 238, 1,1)',
                  }}
                >
                  {data.player.name}
                </span>
              </div>
    
              <div 
                style={{
                  display: 'flex',
                  width: '25%',
                  height: '50px',
                  flexDirection: 'row',
                  backgroundColor:isTenureButtonHover|| (selectedItemIndex == itemIndex)?'rgba(218, 238, 1,1)':'#000000',
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
                    color: isTenureButtonHover|| (selectedItemIndex == itemIndex)?'#000000':'rgba(218, 238, 1,1)',
                  }}
                >
                  {`${data.winningBidValue.toLocaleString()}$`}
                </span>
              </div>
    
              <div 
                style={{
                  display: 'flex',
                  width: '45%',
                  height: '50px',
                  flexDirection: 'row',
                  backgroundColor:isTenureButtonHover|| (selectedItemIndex ==itemIndex)?'rgba(218, 238, 1,1)':'#000000',
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
                    color: isTenureButtonHover|| (selectedItemIndex ==itemIndex)?'#000000':'rgba(218, 238, 1,1)',
                  }}
                >
                {`${new Date(data.startDate).toLocaleString('default', { month: 'short' })} - ${new Date(data.tenureEndDate).toLocaleString('default', { month: 'short' })} ${new Date(data.tenureEndDate).getFullYear()}`}
              </span>
              </div>
            </button>
              );

              }

            return(
            (auction.auctionStatus == 'CLOSED')?
            <TenureButton data={auction} itemIndex={index}/>:null)
            })}
        </div>
      );
  }

  function AuctionSponsorCurrentlyParticipated({ data, data2 }) {

    console.log('AuctionSponsorList data',data);
    let dataCopy = data.slice();
    dataCopy.reverse();
    let dataCopy2 = data2.slice();
    dataCopy2.reverse();
  
      return (
        <div  className="sponsorlist-container-sponsor"> 
          {dataCopy.map((auction, index) => {


            function BidButton ({playerData}){
              const [isBidButtonHover, setBidButtonHover] = useState(false);

              const handleMouseEnterBidButton = () => {
                setBidButtonHover(true);
              };
              const handleMouseLeaveBidButton = () => {
                setBidButtonHover(false);
              };

              console.log('playerData', playerData)

            return(
              <button 
                style={{
                  display: 'flex',
                  width: '10%',
                  height: '45px',
                  flexDirection: 'row',
                  backgroundColor:isBidButtonHover ? "rgba(218, 238, 1,1)" : "#000000",
                  borderColor:isBidButtonHover ? "#000000":"rgba(218, 238, 1,1)",
                  borderWidth:'2px',
                  borderStyle:'solid',
                  borderRadius: '7px',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginLeft: '12px',
                  cursor:'pointer',
                }}
                onMouseEnter={handleMouseEnterBidButton}
                onMouseLeave={handleMouseLeaveBidButton}
                
                onClick={()=>{
                  navigate(`/player?playerId=${playerData.playerId}`);
                  dispatch(setHeaderUI('PLAYER'));
                }}
              >
              <span 
                  style={{
                    display: 'flex',
                    alignSelf: 'center',
                    fontFamily: 'Tektur',
                    fontWeight: 'bold',
                    fontSize: '20px',
                    color:isBidButtonHover ? "#000000":"rgba(218, 238, 1,1)",
                  }}
                >
                  bid
              </span>
              </button>
            );

            }
              

            return(
            (index==0)?
            <div style={{display:'flex',flexDirection:'column'}}>
            <div 
              key={index}
              style={{
                display: 'flex',
                width: '100%',
                height:'45px',
                flexDirection: 'row',
                marginTop: '5px',
                borderRadius:'5px',
              }}
            >

              <div 
                style={{
                  display: 'flex',
                  width: '20%',
                  height: '45px',
                  marginBottom:'5px',
                  flexDirection: 'row',
                  backgroundColor: 'rgba(218, 238, 1,1)',
                  borderColor:'rgba(218, 238, 1,1)',
                  borderStyle:'solid',
                  borderWidth:'2px',
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
                    marginRight:'10px',
                    color: '#000000',
                  }}
                >
                  winning bid
              </span>

              </div>

              <div 
                style={{
                  display: 'flex',
                  width: '20%',
                  height: '45px',
                  marginBottom:'5px',
                  flexDirection: 'row',
                  backgroundColor: 'rgba(218, 238, 1,1)',
                  borderColor:'rgba(218, 238, 1,1)',
                  borderStyle:'solid',
                  borderWidth:'2px',
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
                    marginRight:'10px',
                    color: '#000000',
                  }}
                >
                  player name
                </span>
              </div>
              <div 
                style={{
                  display: 'flex',
                  width: '20%',
                  height: '45px',
                  marginBottom:'5px',
                  flexDirection: 'row',
                  backgroundColor: 'rgba(218, 238, 1,1)',
                  borderColor:'rgba(218, 238, 1,1)',
                  borderStyle:'solid',
                  borderWidth:'2px',
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
                    justifyContent:'center'
                  }}
                >
                auction end date</span>
              </div>

              <div 
                style={{
                  display: 'flex',
                  width: '20%',
                  height: '45px',
                  marginBottom:'5px',
                  flexDirection: 'row',
                  backgroundColor: 'rgba(218, 238, 1,1)',
                  borderColor:'rgba(218, 238, 1,1)',
                  borderStyle:'solid',
                  borderWidth:'2px',
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
                    marginRight:'10px',
                    color: '#000000',
                  }}
                >
                 your bid
              </span>
              </div>


            </div>
            <div 
              key={index}
              style={{
                display: 'flex',
                width: '100%',
                height:'45px',
                flexDirection: 'row',
                marginTop: '7px',
                borderRadius:'5px',
              }}
            >

              <div 
                style={{
                  display: 'flex',
                  width: '20%',
                  height: '45px',
                  flexDirection: 'row',
                  borderColor:'rgba(218, 238, 1,1)',
                  backgroundColor:(dataCopy2[index].bidValue==auction.bids[auction.bids.length-1].bidValue)?'rgba(218, 238, 1,1)':'transparent',
                  borderWidth:'2px',
                  borderStyle:'solid',
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
                    marginRight:'10px',
                    color: (dataCopy2[index].bidValue==auction.bids[auction.bids.length-1].bidValue)?'black':'rgba(218, 238, 1,1)',
                  }}
                >
                  {`${auction.bids[auction.bids.length-1].bidValue.toLocaleString()}$`}
              </span>

              </div>

              <div 
                style={{
                  display: 'flex',
                  width: '20%',
                  height: '45px',
                  flexDirection: 'row',
                  borderColor:'rgba(218, 238, 1,1)',
                  backgroundColor:(dataCopy2[index].bidValue==auction.bids[auction.bids.length-1].bidValue)?'rgba(218, 238, 1,1)':'transparent',
                  borderWidth:'2px',
                  borderStyle:'solid',
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
                    marginRight:'10px',
                    color: (dataCopy2[index].bidValue==auction.bids[auction.bids.length-1].bidValue)?'black':'rgba(218, 238, 1,1)',
                  }}
                >
                  {`${auction.player.name.toLocaleString()}`}
                </span>
              </div>

              <div 
                style={{
                  display: 'flex',
                  width: '20%',
                  height: '45px',
                  flexDirection: 'row',
                  borderColor:'rgba(218, 238, 1,1)',
                  backgroundColor:(dataCopy2[index].bidValue==auction.bids[auction.bids.length-1].bidValue)?'rgba(218, 238, 1,1)':'transparent',
                  borderWidth:'2px',
                  borderStyle:'solid',
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
                    color: (dataCopy2[index].bidValue==auction.bids[auction.bids.length-1].bidValue)?'black':'rgba(218, 238, 1,1)',
                  }}
                >
                {`${new Date(auction.endDate).toLocaleString('default', { month: 'short' })} ${new Date(auction.endDate).getDate()} ${new Date(auction.endDate).getFullYear()}`}
              </span>
              </div>

              <div 
                style={{
                  display: 'flex',
                  width: '20%',
                  height: '45px',
                  flexDirection: 'row',
                  borderColor:'rgba(218, 238, 1,1)',
                  backgroundColor:(dataCopy2[index].bidValue==auction.bids[auction.bids.length-1].bidValue)?'rgba(218, 238, 1,1)':'transparent',
                  borderWidth:'2px',
                  borderStyle:'solid',
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
                    marginRight:'10px',
                    color: (dataCopy2[index].bidValue==auction.bids[auction.bids.length-1].bidValue)?'black':'rgba(218, 238, 1,1)',
                  }}
                >
                  {`${dataCopy2[index].bidValue}$`}
              </span>
              </div>

              {(dataCopy2[index].bidValue<auction.bids[auction.bids.length-1].bidValue)?
                <BidButton playerData={auction.player}/>:null}


            </div>
            </div>
            :<div 
              key={index}
              style={{
                display: 'flex',
                width: '100%',
                height:'45px',
                flexDirection: 'row',
                marginTop: '12px',
                borderRadius:'5px',
              }}
            >

              <div 
                style={{
                  display: 'flex',
                  width: '20%',
                  height: '45px',
                  flexDirection: 'row',
                  borderColor:'rgba(218, 238, 1,1)',
                  backgroundColor:(dataCopy2[index].bidValue==auction.bids[auction.bids.length-1].bidValue)?'rgba(218, 238, 1,1)':'transparent',
                  borderWidth:'2px',
                  borderStyle:'solid',
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
                    marginRight:'10px',
                    color: (dataCopy2[index].bidValue==auction.bids[auction.bids.length-1].bidValue)?'black':'rgba(218, 238, 1,1)',
                  }}
                >
                  {`${auction.bids[auction.bids.length-1].bidValue.toLocaleString()}$`}
              </span>

              </div>

              <div 
                style={{
                  display: 'flex',
                  width: '20%',
                  height: '45px',
                  flexDirection: 'row',
                  borderColor:'rgba(218, 238, 1,1)',
                  backgroundColor:(dataCopy2[index].bidValue==auction.bids[auction.bids.length-1].bidValue)?'rgba(218, 238, 1,1)':'transparent',
                  borderWidth:'2px',
                  borderStyle:'solid',
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
                    marginRight:'10px',
                    color: (dataCopy2[index].bidValue==auction.bids[auction.bids.length-1].bidValue)?'black':'rgba(218, 238, 1,1)',
                  }}
                >
                  {`${auction.player.name.toLocaleString()}`}
                </span>
              </div>

              <div 
                style={{
                  display: 'flex',
                  width: '20%',
                  height: '45px',
                  flexDirection: 'row',
                  backgroundColor:(dataCopy2[index].bidValue==auction.bids[auction.bids.length-1].bidValue)?'rgba(218, 238, 1,1)':'transparent',
                  borderColor:'rgba(218, 238, 1,1)',
                  borderWidth:'2px',
                  borderStyle:'solid',
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
                    color: (dataCopy2[index].bidValue==auction.bids[auction.bids.length-1].bidValue)?'black':'rgba(218, 238, 1,1)',
                  }}
                >
                {`${new Date(auction.endDate).toLocaleString('default', { month: 'short' })} ${new Date(auction.endDate).getDate()} ${new Date(auction.endDate).getFullYear()}`}
              </span>
              </div>

              <div 
                style={{
                  display: 'flex',
                  width: '20%',
                  height: '45px',
                  flexDirection: 'row',
                  backgroundColor:(dataCopy2[index].bidValue==auction.bids[auction.bids.length-1].bidValue)?'rgba(218, 238, 1,1)':'transparent',
                  borderColor:'rgba(218, 238, 1,1)',
                  borderWidth:'2px',
                  borderStyle:'solid',
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
                    marginRight:'10px',
                    color: (dataCopy2[index].bidValue==auction.bids[auction.bids.length-1].bidValue)?'black':'rgba(218, 238, 1,1)',
                  }}
                >
                  {`${dataCopy2[index].bidValue}$`}
              </span>
              </div>

              
              {(dataCopy2[index].bidValue<auction.bids[auction.bids.length-1].bidValue)?
              <BidButton playerData={auction.player}/> :null}

            </div>)


          })}
        </div>
      );
  }

  function GunSkinTemplates({sponsorName}){
            
    return(
      <SponsorImages sponsorName={sponsorName}/>
    )

  }




  const renderMessage = (message) => (
    <div style={{ display: "flex", width: "100%", height: "50px", justifyContent: "center", alignItems: "center", fontFamily: "Tektur", fontWeight: "bold", fontSize: "17px", color: "rgba(218, 238, 1,1)" }}>
      {message}
    </div>
  );

    return (
  
      <div style={{display: 'flex', backgroundColor: '#000000', width: '100vw', height: '100vh', flexDirection:'column', alignSelf:'center', justifyContent: 'flex-start'}}>

        <Header/>

        {(logInTypeGlobal == 'PLAYER')?
        <>
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
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'40px', color:'#000000', marginLeft:'10px'}}>${currentSpaceWorth}<span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginTop:'25px', marginLeft:"5px"}}> per month</span></span>
          </div>:null}
                    
          
          {(currentSpaceValueData!={})?
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
        null}

        {(playerData != null)?
        <div style={{display:'flex', width:'98%', height:'25%',marginTop:'10px', alignSelf:'center', borderRadius:'10px'}}>
        

        {(auctionHistory != null && auctionHistory[auctionHistory.length-1].auctionStatus == 'OPEN')?
        <div style={{display:'flex', width:'28%', height:'100%', flexDirection:'column', borderRadius:'20px'}}>
          

          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'18px', color:'rgba(218, 238, 1,1)', marginLeft:'10px', marginTop:'10px'}}>your current auction</span>
          
          <div style={{display:'flex', width:'100%', height:'50px', flexDirection:'row', backgroundColor:'rgba(218, 238, 1,1)', borderRadius:'10px', marginTop:'10px', justifyContent:'space-between'}}>
          <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'20px',}}>current winning bid</span>
          <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'28px', color:'#000000', marginRight:'20px',}}>{auctionHistory[auctionHistory.length-1].winningBidValue}$</span>
          </div>


          <div style={{display:'flex', width:'100%', height:'50px', flexDirection:'row', backgroundColor:'rgba(218, 238, 1,1)', borderRadius:'10px', marginTop:'10px', justifyContent:'space-between'}}>
          <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'20px',}}>auction closes on</span>
          <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'25px', color:'#000000', marginRight:'20px',}}>{String(new Date(auctionHistory[auctionHistory.length-1].endDate)).split(" ")[1]+" "+String(new Date(auctionHistory[auctionHistory.length-1].endDate)).split(" ")[2]+" "+String(new Date(auctionHistory[auctionHistory.length-1].endDate)).split(" ")[3]}</span>
          </div>
          {/* <div style={{display:'flex', width:'100%', height:'50px', flexDirection:'row', backgroundColor:'rgba(218, 238, 1,1)', borderRadius:'10px', marginTop:'10px', justifyContent:'space-between'}}>
          <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'20px',}}>winning bidder</span>
          <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'28px', color:'#000000', marginRight:'20px',}}>{auctionHistory[auctionHistory.length-1].sponsorName}</span>
          </div> */}
            {/* 
            <div style={{ display: "flex", flexDirection: "row", marginTop: "20px" }}>
              {currentSponsorId === null ? (
                renderMessage("auction closes on "+String(auctionHistory[auctionHistory.length-1].endDate).split(" ")[1]+" "+String(auctionHistory[auctionHistory.length-1].endDate).split(" ")[2])
              ) : currentSponsorId === auctionHistory[auctionHistory.length-1].sponsorId?
                renderMessage("you own the winning bid")
              :bidPlaceError.status ? (
                renderMessage(bidPlaceError.message)
              ) : (
                <>
                  <div style={{ display: "flex", width: "50%", height: "50px", flexDirection: "row", justifyContent: "flex-start", borderColor: "rgba(218, 238, 1,1)", borderWidth: "2px", alignSelf: "center", borderRadius: "20px", borderStyle: "solid" }}>
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
            </div> */}
          
        </div>
        :
        (auctionHistory != null && auctionHistory[auctionHistory.length-1].auctionStatus == 'CLOSED')?
        (openAuctionUI == false)?
        <div style={{display:'flex', width:'28%', height:'100%', flexDirection:'column', borderRadius:'20px'}}>
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'18px', color:'rgba(218, 238, 1,1)', marginLeft:'10px', marginTop:'10px'}}>tenure details</span>
          
          {(new Date(auctionHistory[auctionHistory.length-1].tenureEndDate).getTime() > new Date().getTime())?
          <div style={{display:'flex', width:'100%', height:'50px', flexDirection:'row', backgroundColor:'rgba(218, 238, 1,1)', borderRadius:'10px', marginTop:'10px', justifyContent:'space-between'}}>
          <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'20px',}}>current tenure ends</span>
          <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'25px', color:'#000000', marginRight:'20px',}}>{String(new Date(auctionHistory[auctionHistory.length-1].tenureEndDate)).split(" ")[1]+" "+String(new Date(auctionHistory[auctionHistory.length-1].tenureEndDate)).split(" ")[2]+" "+String(new Date(auctionHistory[auctionHistory.length-1].tenureEndDate)).split(" ")[3]}</span>
          </div>:
          <div style={{display:'flex', width:'100%', height:'50px', flexDirection:'row', backgroundColor:'rgba(218, 238, 1,1)', borderRadius:'10px', marginTop:'10px', justifyContent:'space-between'}}>
          <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'20px',}}>tenure ended at</span>
          <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'25px', color:'#000000', marginRight:'20px',}}>{String(new Date(auctionHistory[auctionHistory.length-1].tenureEndDate)).split(" ")[1]+" "+String(new Date(auctionHistory[auctionHistory.length-1].tenureEndDate)).split(" ")[2]+" "+String(new Date(auctionHistory[auctionHistory.length-1].tenureEndDate)).split(" ")[3]}</span>
          </div>
          }

          <div style={{display:'flex', width:'100%', height:'50px', flexDirection:'row', backgroundColor:'rgba(218, 238, 1,1)', borderRadius:'10px', marginTop:'10px', justifyContent:'space-between'}}>
          <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'25px', color:'#000000', marginLeft:'20px',}}>{auctionHistory[auctionHistory.length-1].sponsorName}</span>
          <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'25px', color:'#000000', marginRight:'20px',}}>{auctionHistory[auctionHistory.length-1].winningBidValue}$</span>
          </div>

          <div style={{ display: "flex", flexDirection: "row", marginTop: "20px" }}>
            { openAuctionError.status ? (
              renderMessage(openAuctionError.message)
            ) : (
              <>
                <button
                  style={{ display: "flex", width: "100%", height: "50px", borderRadius: "20px", backgroundColor: isOverallButtonHover ? "rgba(218, 238, 1,1)" : "#000000", borderWidth: "2px", borderColor: isOverallButtonHover ? "transparent" : "rgba(218, 238, 1,1)", borderStyle: "solid", justifyContent: "center", cursor: "pointer" }}
                  onClick={()=>{
                    if(new Date().getTime() > new Date(new Date(auctionHistory[auctionHistory.length-1].tenureEndDate).getTime() - 10 * 24 * 60 * 60 * 1000).getTime()){
                      console.log('Auction UI')
                      setOpenAuctionUI(true)
                    }
                    else{
                      console.log('Auction Error')
                      setOpenAuctionError({status:true, message:"auction can't be started before "+String(new Date(auctionHistory[auctionHistory.length-1].tenureEndDate)).split(" ")[1]+" "+String(new Date(auctionHistory[auctionHistory.length-1].tenureEndDate)).split(" ")[2]})
                      setTimeout(()=>{setOpenAuctionError({status:false, message:null})},1800)
                    }
                  }}
                  onMouseEnter={handleMouseEnterOverallButton}
                  onMouseLeave={handleMouseLeaveOverallButton}
                >
                  <span style={{ display: "flex", alignSelf: "center", fontFamily: "Tektur", fontWeight: "bold", fontSize: "20px", color: isOverallButtonHover ? "#000000" : "rgba(218, 238, 1,1)" }}>open auction</span>
                </button>
              </>
            )}
          </div>
          
        </div>:
        <div style={{display:'flex', width:'28%', height:'100%', flexDirection:'column', borderRadius:'20px'}}>
          
        <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'18px', color:'rgba(218, 238, 1,1)', marginLeft:'10px', marginTop:'10px', marginBottom:'20px'}}>start a new auction</span>

          <div style={{ display: "flex" , width: "100%", height: "50px", flexDirection: "row", justifyContent: "flex-start", borderColor: "rgba(218, 238, 1,1)", borderWidth: "2px", alignSelf: "center", borderRadius: "20px", borderStyle: "solid" }}>
            <input
              style={{ display: "flex", width: "100%", height: "40px", backgroundColor: "transparent", borderColor: "transparent", outline: "none", WebkitAppearance: "none", borderRadius: "16px", alignSelf: "center", fontFamily: "Tektur", fontWeight: "bold", fontSize: "17px", color: "rgba(218, 238, 1,1)", borderRadius: "20px", justifyContent: "flex-start", textAlign: "center" }}
              value={tenureDuration}
              type="number"
              placeholder={"enter tenure in months"}
              onChange={(e) => {
                setTenureDuration(e.target.value);
              }}
            />
          </div>

          <div style={{ display: "flex" , width: "100%", height: "50px", flexDirection: "row", justifyContent: "flex-start", borderColor: "rgba(218, 238, 1,1)", borderWidth: "2px", alignSelf: "center", borderRadius: "20px", borderStyle: "solid", marginTop:'10px' }}>
            <input
              style={{ display: "flex", width: "100%", height: "40px", backgroundColor: "transparent", borderColor: "transparent", outline: "none", WebkitAppearance: "none", borderRadius: "16px", alignSelf: "center", fontFamily: "Tektur", fontWeight: "bold", fontSize: "17px", color: "rgba(218, 238, 1,1)", borderRadius: "20px", justifyContent: "flex-start", textAlign: "center" }}
              value={startingValue}
              type="number"
              placeholder={"starting value"}
              onChange={(e) => {
                setStartingValue(e.target.value);
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "row", marginTop: "1  0px", alignSelf:'center' }}>
            { openAuctionError.status ? (
              renderMessage(openAuctionError.message)
            ) : (
                <>
                <button
                  style={{ display: "flex", width: "150px", height: "50px", borderRadius: "20px", backgroundColor: isBackAuctionButtonHover ? "rgba(218, 238, 1,1)" : "#000000", borderWidth: "2px", borderColor: isBackAuctionButtonHover ? "transparent" : "rgba(218, 238, 1,1)", borderStyle: "solid", justifyContent: "center", cursor: "pointer", alignSelf:'center',marginRight:'10px' }}
                  onClick={()=>{
                    setOpenAuctionUI(false)
                  }}
                  onMouseEnter={handleMouseEnterBackAuctionButton}
                  onMouseLeave={handleMouseLeaveBackAuctionButton}
                >
                  <span style={{ display: "flex", alignSelf: "center", fontFamily: "Tektur", fontWeight: "bold", fontSize: "20px", color: isBackAuctionButtonHover ? "#000000" : "rgba(218, 238, 1,1)" }}>back</span>
                </button>
                <button
                  style={{ display: "flex", width: "150px", height: "50px", borderRadius: "20px", backgroundColor: isOverallButtonHover ? "rgba(218, 238, 1,1)" : "#000000", borderWidth: "2px", borderColor: isOverallButtonHover ? "transparent" : "rgba(218, 238, 1,1)", borderStyle: "solid", justifyContent: "center", cursor: "pointer", alignSelf:'center' }}
                  onClick={()=>{
                    if(new Date().getTime() > new Date(new Date(auctionHistory[auctionHistory.length-1].tenureEndDate).getTime() - 10 * 24 * 60 * 60 * 1000).getTime()){
                      console.log('Open an Auction in Server')
                      openAuction(playerData.playerId,startingValue,tenureDuration);
                    }
                    else{
                      console.log('Auction Error')
                      setOpenAuctionError({status:true, message:"auction can't be started before "+String(new Date(auctionHistory[auctionHistory.length-1].tenureEndDate)).split(" ")[1]+" "+String(new Date(auctionHistory[auctionHistory.length-1].tenureEndDate)).split(" ")[2]})
                      setTimeout(()=>{setOpenAuctionError({status:false, message:null})},1800)
                    }
                  }}
                  onMouseEnter={handleMouseEnterOverallButton}
                  onMouseLeave={handleMouseLeaveOverallButton}
                >
                  <span style={{ display: "flex", alignSelf: "center", fontFamily: "Tektur", fontWeight: "bold", fontSize: "20px", color: isOverallButtonHover ? "#000000" : "rgba(218, 238, 1,1)" }}>open</span>
                </button>
                </>
            )}
          </div>
          
        </div>
        :null
        }

        {(eventsCoveredInTenure != null && auctionHistory != null)?
        <div style={{display:'flex', width:'40%', height:'100%', flexDirection:'column', borderRadius:'20px', marginLeft:'20px'}}>
          <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'18px', color:'rgba(218, 238, 1,1)', marginLeft:'10px', marginTop:'10px'}}>events covered in tenure {monthNames[parseInt((auctionHistory[auctionHistory.length-1].startDate).split("-")[1])-1]} {String(auctionHistory[auctionHistory.length-1].startDate).split("-")[2]} to {String(new Date(auctionHistory[auctionHistory.length-1].tenureEndDate)).split(" ")[1]} {String(new Date(auctionHistory[auctionHistory.length-1].tenureEndDate)).split(" ")[2]}</span>
             <EventsList events={eventsCoveredInTenure}/>       
        </div>:null}

        {(auctionHistory != null)?
        <div style={{display:'flex', width:'40%', height:'100%', flexDirection:'column', borderRadius:'20px', marginLeft:'20px'}}>
          
          <div style={{display:"flex", width:'100%', height:'40px', marginTop:'5px'}}>
            
              {(currentAuctionBids != null && currentAuctionBids != [])?
              <button
                  style={{ display: "flex",  width:'220px',borderRadius: "20px", backgroundColor: isPrevAuctionButtonHover || currentAuctionTab == 'ON_GOING' ? "rgba(218, 238, 1,1)" : "#000000", marginLeft: "10px", borderWidth: "2px", borderColor: isPrevAuctionButtonHover || currentAuctionTab == 'ON_GOING' ? "transparent" : "rgba(218, 238, 1,1)", borderStyle: "solid", alignSelf:'flex-start',justifyContent: "center", cursor: "pointer", paddingLeft:'10px', paddingRight:'10px', paddingTop:'5px', paddingBottom:'5px' }}
                  onClick={()=>{
                    setCurrentAuctionTab('ON_GOING')
                    // getBidsFromAuction(auctionHistory[auctionHistory.length-1].auctionId)
                  }}
                  onMouseEnter={handleMouseEnterPrevAuctionButton}
                  onMouseLeave={handleMouseLeavePrevAuctionButton}
                >
                  <span style={{ display: "flex", alignSelf: "center", fontFamily: "Tektur", fontWeight: "bold", fontSize: "20px", color: isPrevAuctionButtonHover || currentAuctionTab == 'ON_GOING' ? "#000000" : "rgba(218, 238, 1,1)" }}>on going auction</span>
              </button>: null}

              <button
                  style={{ display: "flex",  width:'220px',borderRadius: "20px", backgroundColor: isPrevAuctionButtonHover || currentAuctionTab == 'PREVIOUS' ? "rgba(218, 238, 1,1)" : "#000000", marginLeft: "10px", borderWidth: "2px", borderColor: isPrevAuctionButtonHover || currentAuctionTab == 'PREVIOUS' ? "transparent" : "rgba(218, 238, 1,1)", borderStyle: "solid", alignSelf:'flex-start',justifyContent: "center", cursor: "pointer", paddingLeft:'10px', paddingRight:'10px', paddingTop:'5px', paddingBottom:'5px' }}
                  onClick={()=>{
                    setCurrentAuctionTab('PREVIOUS')
                  }}
                  onMouseEnter={handleMouseEnterPrevAuctionButton}
                  onMouseLeave={handleMouseLeavePrevAuctionButton}
                >
                  <span style={{ display: "flex", alignSelf: "center", fontFamily: "Tektur", fontWeight: "bold", fontSize: "20px", color: isPrevAuctionButtonHover || currentAuctionTab == 'PREVIOUS' ? "#000000" : "rgba(218, 238, 1,1)" }}>previous auctions</span>
              </button>

          </div>
          
            {(currentAuctionTab == 'PREVIOUS')?
            <AuctionList data={auctionHistory}/>:
            (currentAuctionBids !=null && currentAuctionBids != [])?
            <CurrentBids data={currentAuctionBids}/>:null
            } 
        </div>:null}

        </div>:
        null}
        </>:
        
        <div style ={{display:'flex', width:"98%", height:'85%', flexDirection:'row', marginTop:'20px', alignSelf:'center', borderRadius:'10px',}}>
          <div style={{display:'flex', width:'28%', height:'100%',marginLeft:"2px", marginRight:'10px', flexDirection:'column'}}>

          <div style={{display:'flex', width:'100%', height:'8%', flexDirection:'row', backgroundColor:'rgba(218, 238, 1,1)', borderRadius:'10px', marginTop:'10px', justifyContent:'space-between'}}>
            <span style={{display:'flex', width:'100%',alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'25px', color:'#000000', textAlign:'center', justifyContent:'center'}}>{sponsorName}</span>
          </div>

          <div style={{display:'flex', width:'100%', flexDirection:'row',borderRadius:'10px', marginTop:'10px', justifyContent:'space-between'}}>

              <button
                  style={{ display: "flex",  width:'220px',borderRadius: "20px", backgroundColor: isPrevAuctionButtonHover || sponsorListTab == 'SPONSORSHIPS' ? "rgba(218, 238, 1,1)" : "#000000", marginLeft: "10px", borderWidth: "2px", borderColor: isPrevAuctionButtonHover || sponsorListTab == 'SPONSORSHIPS' ? "transparent" : "rgba(218, 238, 1,1)", borderStyle: "solid", alignSelf:'flex-start',justifyContent: "center", cursor: "pointer", paddingLeft:'10px', paddingRight:'10px', paddingTop:'5px', paddingBottom:'5px' }}
                  onClick={()=>{
                    setSponsorListTab('SPONSORSHIPS')
                    // getBidsFromAuction(auctionHistory[auctionHistory.length-1].auctionId)
                  }}
                  onMouseEnter={handleMouseEnterPrevAuctionButton}
                  onMouseLeave={handleMouseLeavePrevAuctionButton}
                >
                  <span style={{ display: "flex", alignSelf: "center", fontFamily: "Tektur", fontWeight: "bold", fontSize: "20px", color: isPrevAuctionButtonHover || sponsorListTab == 'SPONSORSHIPS' ? "#000000" : "rgba(218, 238, 1,1)" }}>sponsorships</span>
              </button>

              <button
                  style={{ display: "flex",  width:'220px',borderRadius: "20px", backgroundColor: isPrevAuctionButtonHover || sponsorListTab == 'BIDS' ? "rgba(218, 238, 1,1)" : "#000000", marginLeft: "10px", borderWidth: "2px", borderColor: isPrevAuctionButtonHover || sponsorListTab == 'BIDS' ? "transparent" : "rgba(218, 238, 1,1)", borderStyle: "solid", alignSelf:'flex-start',justifyContent: "center", cursor: "pointer", paddingLeft:'10px', paddingRight:'10px', paddingTop:'5px', paddingBottom:'5px' }}
                  onClick={()=>{
                    setSponsorListTab('BIDS')
                  }}
                  onMouseEnter={handleMouseEnterPrevAuctionButton}
                  onMouseLeave={handleMouseLeavePrevAuctionButton}
                >
                  <span style={{ display: "flex", alignSelf: "center", fontFamily: "Tektur", fontWeight: "bold", fontSize: "20px", color: isPrevAuctionButtonHover || sponsorListTab == 'BIDS' ? "#000000" : "rgba(218, 238, 1,1)" }}>bids</span>
              </button>

          </div>

          {(sponsorAuctionsWon!=null && sponsorListTab=='SPONSORSHIPS')?
          <div style={{display:'flex', width:'100%', height:'80%', flexDirection:'row', backgroundColor:'transparent', borderRadius:'10px', justifyContent:'space-between', marginTop:'10px'}}>
            <AuctionSponsorList data={sponsorAuctionsWon}/>
          </div>:null}

          </div> 

          {(bidsFromOpenAuctionSponsorParticipated!=null && sponsorListTab=='BIDS')?
          <AuctionSponsorCurrentlyParticipated data={bidsFromOpenAuctionSponsorParticipated} data2={sponsorBidValueInOpenAuction}/> :null}

          {(sponsorListTab=='SPONSORSHIPS')?
          <div style={{display:'flex', width:'70%', height:'100%', flexDirection:'column', justifyContent:'flex-start',}}>
          <span style={{display: 'flex', alignSelf: 'flex-start', fontFamily: 'Tektur', fontWeight: 'bold', fontSize: '25px', color: 'rgba(218, 238, 1,1)', marginLeft:"10px", marginTop:'15px',marginBottom:'15px'}}>brand exposure metrics</span>
          {(sponsorTenureStatsData!=null && sponsorTenureStatsData!='INITIATED')?
          <div style={{display:'flex', width:'100%', height:'43%', marginTop:'10px', flexDirection:'column', justifyContent:'flex-start',backgroundColor:'rgba(218, 238, 1,1)', marginLeft:"5px", borderRadius:'10px', paddingLeft:'5px'}}>

            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px', marginTop:'10px'}}>{sponsorTenureStatsData.playerName}</span>                

            <div style={{display:'flex', width:'100%', flexDirection:'row', marginTop:'10px'}}>
            <div style={{display:'flex', marginLeft:'0px', flexDirection:'column'}}>
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>total view time</span>  
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{sponsorTenureStatsData.totalViewTimeGenerated}<span style={{fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px',marginTop:'10px', magrinLeft:'5px'}}>s</span></span>
            </div>

            {/* <div style={{display:'flex', marginLeft:'15px', flexDirection:'column'}}>
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>tournament reach</span> 
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{sponsorTenureStatsData.averageTournamentReach}<span style={{fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px',marginTop:'10px', magrinLeft:'5px'}}>%</span></span>
            </div>  */}
            
            <div style={{display:'flex', marginLeft:'15px', flexDirection:'column'}}>
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>estimated round view time </span>  
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{sponsorTenureStatsData.averageEstimatedViewTimePerRound}<span style={{fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px',marginTop:'10px', magrinLeft:'5px'}}>s</span></span>
            </div>
            
            <div style={{display:'flex', marginLeft:'15px', flexDirection:'column'}}>
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>moments view time</span>  
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{sponsorTenureStatsData.momentsViewTimeCreated}<span style={{fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px',marginTop:'10px', magrinLeft:'5px'}}>s</span></span>
            </div>
            
            <div style={{display:'flex', marginLeft:'15px', flexDirection:'column'}}>
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>round view time occcupied</span>  
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{sponsorTenureStatsData.averageRoundViewTimePercentage}<span style={{fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px',marginTop:'10px', magrinLeft:'5px'}}>%</span></span>
            </div>

            </div>

            <div style={{display:'flex', width:'100%', flexDirection:'row', marginTop:"10px"}}>
            <div style={{display:'flex', marginLeft:'0px', flexDirection:'column'}}>
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>matches</span>  
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{sponsorTenureStatsData.numberOfMatchesPlayed}</span>
            </div>

            <div style={{display:'flex', marginLeft:'15px', flexDirection:'column'}}>
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>rounds</span> 
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{sponsorTenureStatsData.numberOfRoundsPlayed}</span>
            </div> 
            
            <div style={{display:'flex', marginLeft:'15px', flexDirection:'column'}}>
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>ace/clutch</span>  
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{sponsorTenureStatsData.aces}/{sponsorTenureStatsData.clutches}</span>
            </div>
            
            <div style={{display:'flex', marginLeft:'15px', flexDirection:'column'}}>
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>percentage of team killed</span>  
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{sponsorTenureStatsData.averagePercentageOpponentTeamKilled}%<span style={{fontSize:'15px', marginLeft:'10px', marginTop:'15px'}}>per round</span></span>
            </div>
            
            <div style={{display:'flex', marginLeft:'15px', flexDirection:'column'}}>
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>kills</span>  
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{sponsorTenureStatsData.kills}</span>
            </div>

            <div style={{display:'flex', marginLeft:'15px', flexDirection:'column'}}>
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>headshots</span>  
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{sponsorTenureStatsData.headshots}</span>
            </div>

            <div style={{display:'flex', marginLeft:'15px', flexDirection:'column', marginBottom:'10px'}}>
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>damage</span>  
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{sponsorTenureStatsData.overallDamage}</span>
            </div>
            </div>


            <div style={{display:'flex', width:'100%', flexDirection:'row', marginTop:"10px"}}>
              <div style={{display:'flex',flexDirection:'column'}}>
              <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>assists given/received</span>  
              <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{sponsorTenureStatsData.killAssistsReceived}/{sponsorTenureStatsData.killAssistsGiven}</span>
              </div>
{/* 
              <div style={{display:'flex',flexDirection:'row'}}>
              <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:'#000000', marginLeft:'10px', marginTop:'10px'}}>Tenure Ends at</span>  
              <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px'}}>{sponsorTenureStatsData.killAssistsReceived}/{sponsorTenureStatsData.killAssistsGiven}</span>
              </div> */}

            </div>
          

          </div>:
          <div style={{display:'flex', width:'100%', height:'15%', marginTop:'10px', flexDirection:'column', justifyContent:'flex-start',backgroundColor:'rgba(218, 238, 1,1)', marginLeft:"5px", borderRadius:'10px', paddingLeft:'5px'}}>
            
            {(sponsorTenureStatsData == 'INITIATED')?
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px', marginTop:'10px'}}>select a player to receive ad performance metrics</span>: 
            <span style={{display:'flex', alignSelf:'flex-start', fontFamily:'Tektur', fontWeight:'bold', fontSize:'30px', color:'#000000', marginRight:'30px', marginLeft:'10px', marginTop:'10px'}}>not available at the moment</span>
            }             

          </div>}
          {(sponsorName!=null)?
          <div style={{display:'flex', width:'100%', height:'47%', flexDirection:'column', justifyContent:'flex-start', marginLeft:'5px'}}>
          <GunSkinTemplates sponsorName={sponsorName}/>
          </div>:null}
          </div>
          :null}


        </div>
        }
  
      </div>
  
    );
}

export default Profile;
  