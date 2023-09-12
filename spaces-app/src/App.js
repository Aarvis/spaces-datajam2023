import React, { useEffect, useRef, useState } from "react";
import './App.css';
import SEARCH_ICON from "./assets/Icons/searchIcon.png";
import UP_ARROW from "./assets/Icons/upGreen.png";
import DOWN_ARROW from "./assets/Icons/redDown.png";
import './PlayerViewList.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { WebSocketLink } from "@apollo/client/link/ws";
import {SCOREBOARD_CHANGED} from './graphqlResolverTemplate';
import {getMainDefinition} from '@apollo/client/utilities';
import { useSelector, useDispatch } from 'react-redux';
import { setScoreboard } from './redux/reducers/scoreboardReducer.js';
import { setEvent } from "./redux/reducers/eventTimelineReducer";
import Home from './Home';
import Player from './Player';
import Profile from './Profile';
import Scoreboard from "./Scoreboard";
import Header from "./Header";



const { ApolloClient, InMemoryCache, ApolloProvider, gql, fromPromise } = require('@apollo/client/core');
const {split, HttpLink,from} = require ('@apollo/client/core');
const { onError } = require("@apollo/client/link/error");
const {fetch} = require("cross-fetch");

export let globalApolloClient = null;
export let globalApolloClientSB = null;

const errorLink = onError( ({ graphQLErrors, networkError, operation, forward }) => {
    console.log('In Error Link')
    if (graphQLErrors) {
    }
    else if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
    else{
      console.log('Something Else is Wrong');
    }
  });

const serverEndpoint = '192.168.56.1:80'

const scoreBoardServerEndpoint = '192.168.56.1:81'

const httpLink = new HttpLink({
    uri: 'http://'.concat(serverEndpoint), 
    fetch:fetch,
});

const httpLinkSB = new HttpLink({
  uri: 'http://'.concat(scoreBoardServerEndpoint),
  fetch:fetch,
});

const wsLinkSB = new WebSocketLink({
  uri:'ws://'.concat(scoreBoardServerEndpoint),
  options:{
    reconnect: true,
    // subscriptions: '/subscription',
  }}
);


const splitLinkSB = split(
  ({query}) => {
    // uploadMutation.current = false;
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLinkSB,
  httpLinkSB, 
);

const apolloClientSB = new ApolloClient({
  link: from([errorLink,splitLinkSB]),
  cache: new InMemoryCache(),
  });

const apolloClient = new ApolloClient({
link: from([errorLink,httpLink]),
cache: new InMemoryCache(),
});

// console.log('apolloClient')
// console.log(apolloClient)

globalApolloClientSB = apolloClientSB;
globalApolloClient = apolloClient;



function App(){
  
  let dispatch = useDispatch();
  let subscription = globalApolloClientSB.subscribe({query: SCOREBOARD_CHANGED,variables:{tournamentId:"2579089"}}).subscribe({
    async next(data) {
      // console.log('data in Subscription:',JSON.stringify(data))
      if(data.data.scoreBoardChanged.eventCreated!=null){
        console.log('event dispatched',data.data.scoreBoardChanged.eventCreated)
        dispatch(setEvent(data.data.scoreBoardChanged.eventCreated))
      }
      dispatch(setScoreboard(data.data.scoreBoardChanged.tournamentScoreboard.matches));
    },
  
    error(err) { 
      console.error('err', err); 
    },
  
  });

  dispatch(setScoreboard([
    {
      "matchId": "c5c7500c-6db8-45c8-b6ab-2be01b401ef7",
      "scoreboard": {
        "scoreBoardId": "clmceubj8000bisi0ohii0v9q",
        "matchId": "c5c7500c-6db8-45c8-b6ab-2be01b401ef7",
        "match": {
          "tournamentId": "2579089"
        },
        "scoreboardPlayerCard": [
          {
            "player": {
              "name": "Jerry",
              "playerId": "76561198026088156"
            },
            "kills": 2,
            "deaths": 1,
            "assists": 1,
            "health": 10,
            "alive": true,
            "armor": 100,
            "itemsOwned": [
              {
                "id": "knife",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "knife"
                  }
                ]
              },
              {
                "id": "glock",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "glock"
                  }
                ]
              },
              {
                "id": "galilar",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "galilar"
                  }
                ]
              },
              {
                "id": "kevlarVest",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "kevlarVest"
                  }
                ]
              },
              {
                "id": "helm",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "helm"
                  }
                ]
              },
              {
                "id": "molotov",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "molotov"
                  }
                ]
              },
              {
                "id": "hegrenade",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "hegrenade"
                  }
                ]
              },
              {
                "id": "smokeGrenade",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "smokeGrenade"
                  }
                ]
              },
              {
                "id": "flashbang",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "flashbang"
                  }
                ]
              }
            ],
            "teamId": "47336",
            "damageDealtInstant": true,
            "damageTakenInstant": false,
            "bombDefusing": false
          },
          {
            "player": {
              "name": "Krad",
              "playerId": "76561198031908632"
            },
            "kills": 0,
            "deaths": 0,
            "assists": 0,
            "health": 100,
            "alive": true,
            "armor": 100,
            "itemsOwned": [
              {
                "id": "knife",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "knife"
                  }
                ]
              },
              {
                "id": "glock",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "glock"
                  }
                ]
              },
              {
                "id": "galilar",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "galilar"
                  }
                ]
              },
              {
                "id": "kevlarVest",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "kevlarVest"
                  }
                ]
              },
              {
                "id": "helm",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "helm"
                  }
                ]
              },
              {
                "id": "smokeGrenade",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "smokeGrenade"
                  }
                ]
              },
              {
                "id": "hegrenade",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "hegrenade"
                  }
                ]
              },
              {
                "id": "molotov",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "molotov"
                  }
                ]
              }
            ],
            "teamId": "47336",
            "damageDealtInstant": false,
            "damageTakenInstant": false,
            "bombDefusing": false
          },
          {
            "player": {
              "name": "kraghen",
              "playerId": "76561198047198945"
            },
            "kills": 0,
            "deaths": 1,
            "assists": 0,
            "health": 100,
            "alive": true,
            "armor": 100,
            "itemsOwned": [
              {
                "id": "knife",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "knife"
                  }
                ]
              },
              {
                "id": "elite",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "elite"
                  }
                ]
              },
              {
                "id": "kevlarVest",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "kevlarVest"
                  }
                ]
              },
              {
                "id": "helm",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "helm"
                  }
                ]
              },
              {
                "id": "incgrenade",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "incgrenade"
                  }
                ]
              },
              {
                "id": "smokeGrenade",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "smokeGrenade"
                  }
                ]
              }
            ],
            "teamId": "3128",
            "damageDealtInstant": false,
            "damageTakenInstant": false,
            "bombDefusing": false
          },
          {
            "player": {
              "name": "maNkz",
              "playerId": "76561198042070812"
            },
            "kills": 1,
            "deaths": 1,
            "assists": 0,
            "health": 100,
            "alive": true,
            "armor": 100,
            "itemsOwned": [
              {
                "id": "knife",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "knife"
                  }
                ]
              },
              {
                "id": "deagle",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "deagle"
                  }
                ]
              },
              {
                "id": "kevlarVest",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "kevlarVest"
                  }
                ]
              },
              {
                "id": "helm",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "helm"
                  }
                ]
              },
              {
                "id": "smokeGrenade",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "smokeGrenade"
                  }
                ]
              },
              {
                "id": "flashbang",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "flashbang"
                  }
                ]
              },
              {
                "id": "incgrenade",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "incgrenade"
                  }
                ]
              }
            ],
            "teamId": "3128",
            "damageDealtInstant": false,
            "damageTakenInstant": false,
            "bombDefusing": false
          },
          {
            "player": {
              "name": "Nodios",
              "playerId": "76561198070876270"
            },
            "kills": 0,
            "deaths": 1,
            "assists": 0,
            "health": 100,
            "alive": true,
            "armor": 100,
            "itemsOwned": [
              {
                "id": "knife",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "knife"
                  }
                ]
              },
              {
                "id": "kevlarVest",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "kevlarVest"
                  }
                ]
              },
              {
                "id": "deagle",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "deagle"
                  }
                ]
              },
              {
                "id": "helm",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "helm"
                  }
                ]
              },
              {
                "id": "smokeGrenade",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "smokeGrenade"
                  }
                ]
              }
            ],
            "teamId": "3128",
            "damageDealtInstant": false,
            "damageTakenInstant": false,
            "bombDefusing": false
          },
          {
            "player": {
              "name": "Queenix",
              "playerId": "76561198030545997"
            },
            "kills": 0,
            "deaths": 1,
            "assists": 0,
            "health": 100,
            "alive": true,
            "armor": 100,
            "itemsOwned": [
              {
                "id": "knife",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "knife"
                  }
                ]
              },
              {
                "id": "fiveseven",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "fiveseven"
                  }
                ]
              },
              {
                "id": "kevlarVest",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "kevlarVest"
                  }
                ]
              },
              {
                "id": "helm",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "helm"
                  }
                ]
              },
              {
                "id": "smokeGrenade",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "smokeGrenade"
                  }
                ]
              },
              {
                "id": "flashbang",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "flashbang"
                  }
                ]
              }
            ],
            "teamId": "3128",
            "damageDealtInstant": false,
            "damageTakenInstant": false,
            "bombDefusing": false
          },
          {
            "player": {
              "name": "r3salt",
              "playerId": "76561198350362302"
            },
            "kills": 0,
            "deaths": 0,
            "assists": 0,
            "health": 100,
            "alive": true,
            "armor": 100,
            "itemsOwned": [
              {
                "id": "knife",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "knife"
                  }
                ]
              },
              {
                "id": "glock",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "glock"
                  }
                ]
              },
              {
                "id": "kevlarVest",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "kevlarVest"
                  }
                ]
              },
              {
                "id": "helm",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "helm"
                  }
                ]
              },
              {
                "id": "mac10",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "mac10"
                  }
                ]
              },
              {
                "id": "molotov",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "molotov"
                  }
                ]
              },
              {
                "id": "smokeGrenade",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "smokeGrenade"
                  }
                ]
              },
              {
                "id": "hegrenade",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "hegrenade"
                  }
                ]
              },
              {
                "id": "flashbang",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "flashbang"
                  }
                ]
              }
            ],
            "teamId": "47336",
            "damageDealtInstant": false,
            "damageTakenInstant": false,
            "bombDefusing": false
          },
          {
            "player": {
              "name": "salazar",
              "playerId": "76561198102263776"
            },
            "kills": 1,
            "deaths": 0,
            "assists": 0,
            "health": 70,
            "alive": true,
            "armor": 100,
            "itemsOwned": [
              {
                "id": "knife",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "knife"
                  }
                ]
              },
              {
                "id": "kevlarVest",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "kevlarVest"
                  }
                ]
              },
              {
                "id": "ssg08",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "ssg08"
                  }
                ]
              },
              {
                "id": "usp_silencer",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "usp_silencer"
                  }
                ]
              }
            ],
            "teamId": "3128",
            "damageDealtInstant": false,
            "damageTakenInstant": true,
            "bombDefusing": false
          },
          {
            "player": {
              "name": "shalfey",
              "playerId": "76561198365697700"
            },
            "kills": 1,
            "deaths": 1,
            "assists": 0,
            "health": 100,
            "alive": true,
            "armor": 100,
            "itemsOwned": [
              {
                "id": "knife",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "knife"
                  }
                ]
              },
              {
                "id": "glock",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "glock"
                  }
                ]
              },
              {
                "id": "kevlarVest",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "kevlarVest"
                  }
                ]
              },
              {
                "id": "helm",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "helm"
                  }
                ]
              },
              {
                "id": "galilar",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "galilar"
                  }
                ]
              },
              {
                "id": "molotov",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "molotov"
                  }
                ]
              },
              {
                "id": "smokeGrenade",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "smokeGrenade"
                  }
                ]
              },
              {
                "id": "hegrenade",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "hegrenade"
                  }
                ]
              }
            ],
            "teamId": "47336",
            "damageDealtInstant": false,
            "damageTakenInstant": false,
            "bombDefusing": false
          },
          {
            "player": {
              "name": "zorte",
              "playerId": "76561198059614402"
            },
            "kills": 1,
            "deaths": 0,
            "assists": 0,
            "health": 100,
            "alive": true,
            "armor": 100,
            "itemsOwned": [
              {
                "id": "knife",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "knife"
                  }
                ]
              },
              {
                "id": "glock",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "glock"
                  }
                ]
              },
              {
                "id": "flashbang",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "flashbang"
                  }
                ]
              },
              {
                "id": "bomb",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "bomb"
                  }
                ]
              },
              {
                "id": "kevlarVest",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "kevlarVest"
                  }
                ]
              },
              {
                "id": "helm",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "helm"
                  }
                ]
              },
              {
                "id": "galilar",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "galilar"
                  }
                ]
              },
              {
                "id": "smokeGrenade",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "smokeGrenade"
                  }
                ]
              },
              {
                "id": "flashbang",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "flashbang"
                  }
                ]
              },
              {
                "id": "molotov",
                "stashed": false,
                "equipped": true,
                "statePath": [
                  {
                    "id": "molotov"
                  }
                ]
              }
            ],
            "teamId": "47336",
            "damageDealtInstant": false,
            "damageTakenInstant": false,
            "bombDefusing": false
          }
        ],
        "teamAId": "3128",
        "teamBId": "47336",
        "teamAName":"forze",
        "teamBName":"element",
        "roundsWonTeamA": 0,
        "roundsWonTeamB": 1,
        "wonTeamId": null,
        "bombPlanted": false,
        "bombExploded": false,
        "bombDiffused": false
      }
    }]));
    
  console.log('subscription',subscription)


  return(
    <Router>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/player" element={<Player/>} />
                <Route path="/profile" element={<Profile/>} />
                <Route path='/scoreboard' element={<div style={{display: 'flex', backgroundColor: 'black', width: '100vw', height: '100vh', flexDirection:'column', alignSelf:'center', justifyContent: 'flex-start'}}><Header/><Scoreboard/></div>}/>
            </Routes>
    </Router>
  )
}

export default App;
