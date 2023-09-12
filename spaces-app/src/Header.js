import React, { useEffect, useRef, useState } from "react";
import SEARCH_ICON from "./assets/Icons/searchIcon.png";
import { useSelector, useDispatch } from 'react-redux';
import { setLogInOut } from './redux/reducers/logInOutReducer';
import { setHeaderUI, goBack } from './redux/reducers/headerUIReducer';
import {PLAYER_LOGIN,SEARCH_PLAYERS_BY_NAME,SPONSOR_LOGIN} from './graphqlResolverTemplate'
import { globalApolloClient } from "./App";
import { useNavigate, useLocation  } from 'react-router-dom';

function Header(){

    let navigate = useNavigate();
    const location = useLocation();
    console.log('location',location)
    const prevLocation = useRef(location);
    const logInOutStatus = useSelector((state) => state.logInOutReducer);
    let headerUIState = useSelector((state) => state.headerUIReducer);
    let headerUI = headerUIState.current 
    console.log('headerUI',headerUI);
    const dispatch = useDispatch();
    console.log('logInOutStatus',logInOutStatus)
    const [usernameValue, setUsernameValue] = useState(null);
    const [searchResults, setSearchResults] = useState(false);
    const [searchResponse, setSearchResponse] = useState([]);
    const [errorLogin, setErrorLogin] = useState(null);
    const [passwordValue, setPasswordValue] = useState(null);
    const [isKeyMomentsButtonHover,setIsKeyMomentsButtonHover] = useState(false);
    const [isProfileButtonHover,setIsProfileButtonHover] = useState(false);
    const [isLogInButtonHover,setIsLogInButtonHover] = useState(false);
    const [isLogOutButtonHover,setIsLogOutButtonHover] = useState(false);
    const [playerSearchValue, setPlayerSearchValue] = useState("");
    const [isLogInPlayerButtonHover, setIsLogInPlayerButtonHover] = useState(false);
    const [logInType, setLogInType] = useState('PLAYER');
    const [isLogInSponsorButtonHover, setIsLogInSponsorButtonHover] = useState(false);
    const [isBackButtonHover, setIsBackButtonHover] = useState(false);

    async function getCurrentLoginData(){
        let logInId = localStorage.getItem('loginId') 
        let logInType = localStorage.getItem('loginType')
        console.log('getCurrentLoginData loginId', logInId)
        console.log('getCurrentLoginData loginType', logInType) 
        if(logInId != "null"){
          console.log('inside if')
          console.log('inside if logInId',logInId)
          dispatch(setLogInOut({logInId:logInId, type:logInType, status:'LOGGED_IN'}));
        }
        else{
          dispatch(setLogInOut({logInId:null, type:null, status:'LOGGED_OUT'}));
        }
    }

    async function getPlayersFromInputSearch(value){
      console.log('running query')
      console.log('value', value)
      let response = await globalApolloClient.query({query:SEARCH_PLAYERS_BY_NAME, variables:{name:value}, fetchPolicy:'network-only'});
      console.log('response',response);
      if(response.data.SearchPlayersByName.length != 0 && response.data.SearchPlayersByName != null){
        setSearchResults(true);
        setSearchResponse(response.data.SearchPlayersByName);
      }
    }

     useEffect(() => {

      if (!prevLocation.current) {
        prevLocation.current = location;
        return;
      }

      if (prevLocation.current.key > location.key) {  
          console.log('location', location)
          console.log("User navigated back");
          // Detecting back navigation is tricky. 
          // You may want to compare locations or store a history length.
          // But if you want to change state on any navigation:
          // setMyState(newValue);
      }
      prevLocation.current = location;
  }, [location]);

    //  getCurrentLoginData()
    useEffect(()=>{
         getCurrentLoginData()
    },[])

    useEffect(()=>{
      if(playerSearchValue!=null && playerSearchValue!=""){
        getPlayersFromInputSearch(playerSearchValue); 
      }
      else{
        setSearchResults(false);
        setSearchResponse([]);
      }
    },[playerSearchValue])



    async function logInUser(){

        console.log('Executing Login')
        if(logInType == 'PLAYER'){
            let response = await globalApolloClient.mutate({mutation:PLAYER_LOGIN,
            variables:{playerIdentifier:usernameValue, password:passwordValue}})
            console.log('response',response)
            if(response.data.playerLogin.success == true){
                localStorage.setItem('loginId',response.data.playerLogin.playerId );
                localStorage.setItem('loginType','PLAYER');
                dispatch(setLogInOut({logInId:response.data.playerLogin.playerId, type:'PLAYER', status:'LOGGED_IN'}))
            }
            else if(response.data.playerLogin.success == false){
                setErrorLogin(true);
                setTimeout(()=>{setErrorLogin(false)},1800);
            }
        }
        else if(logInType == 'SPONSOR'){
            let response = await globalApolloClient.mutate({mutation:SPONSOR_LOGIN,
                variables:{sponsorIdentifier:usernameValue, password:passwordValue}})
                console.log('response',response)
                if(response.data.sponsorLogin.success == true){
                    localStorage.setItem('loginId',response.data.sponsorLogin.sponsorId );
                    localStorage.setItem('loginType','SPONSOR');
                    dispatch(setLogInOut({logInId:response.data.sponsorLogin.sponsorId, type:'SPONSOR', status:'LOGGED_IN'}))
                }
                else if(response.data.sponsorLogin.success == false){
                    setErrorLogin(true);
                    setTimeout(()=>{setErrorLogin(false)},2500);
                }
        }

    }

    const handleMouseEnterKeyMomentsButton = () => {
        setIsKeyMomentsButtonHover(true);
     };
     const handleMouseLeaveKeyMomentsButton = () => {
      setIsKeyMomentsButtonHover(false);
     };

    const handleMouseEnterProfileButton = () => {
        setIsProfileButtonHover(true);
     };
     const handleMouseLeaveProfileButton = () => {
      setIsProfileButtonHover(false);
     };


     const handleMouseEnterLogInButton = () => {
        setIsLogInButtonHover(true);
     };
     const handleMouseLeaveLogInButton = () => {
      setIsLogInButtonHover(false);
     };

     const handleMouseEnterLogOutButton = () => {
        setIsLogOutButtonHover(true);
     };
     const handleMouseLeaveLogOutButton = () => {
      setIsLogOutButtonHover(false);
     };

     const handleMouseEnterLogInPlayerButton = () => {
        setIsLogInPlayerButtonHover(true);
     };
     const handleMouseLeaveLogInPlayerButton = () => {
        setIsLogInPlayerButtonHover(false);
     };

     const handleMouseEnterLogInSponsorButton = () => {
        setIsLogInSponsorButtonHover(true);
     };
     const handleMouseLeaveLogInSponsorButton = () => {
        setIsLogInSponsorButtonHover(false);
     };

     const handleMouseEnterBackButton = () => {
        setIsBackButtonHover(true);
     };
     const handleMouseLeaveBackButton = () => {
        setIsBackButtonHover(false);
     };


    return(
        <div style={{display:'flex', width:'100%', height:'90px', flexDirection:"row",}}>
        <div style={{display:'flex', width:'235px', height:'90px', position:'relative',alignSelf:'center', marginTop:'30px', marginLeft:'30px'}}>
          <span style={{display:'flex', position:'absolute',alignSelf:'center', fontFamily:'Black Ops One', fontWeight:'regular', fontSize:'60px', color:'rgba(218, 238, 1,1)', zIndex:2, left:0, top:0}}>spaces</span>
          <span style={{display:'flex', position:'absolute',alignSelf:'center', fontFamily:'Black Ops One', fontWeight:'regular', fontSize:'60px', color:'rgba(82, 154, 89, 0.6)', zIndex:1, left:4, top:2}}>spaces</span>
        </div>

        {
        (headerUI == 'HOME')?
        (logInOutStatus.status != 'LOGGING_IN')?
        <div style={{display:'flex', width:'100vw', height:'50px', flexDirection:'row', justifyContent:'center',marginTop:'30px',}}>
          <div style={{display:'flex', width:'30vw', height:'50px',flexDirection:'row', justifyContent:'flex-start',  borderColor:'rgba(218, 238, 1,1)', borderWidth:'2px', alignSelf:'center', borderRadius:'20px', borderStyle: "solid",marginRight:(searchResults && searchResponse!=[])?'20px':'50px'}}>
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

          {(searchResults && searchResponse!=[])?
          <div style={{display:'flex', flexDirection:'row'}}>
            <button style={{display:'flex', width:'100px', height:'50px',borderRadius:'20px',backgroundColor:isKeyMomentsButtonHover?'rgba(218, 238, 1,1)':'#000000', borderWidth:'2px',borderColor:isKeyMomentsButtonHover?'transparent':'rgba(218, 238, 1,1)',borderStyle: "solid", justifyContent:'center', cursor:'pointer', marginRight:"10px"}}
              onClick={()=>{
                  console.log('clicked')
                  navigate(`/player?playerId=${searchResponse[0].playerId}`)
                  dispatch(setHeaderUI('PLAYER'))
              }}
            onMouseEnter={handleMouseEnterKeyMomentsButton}
            onMouseLeave={handleMouseLeaveKeyMomentsButton}>
              <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px', color:isKeyMomentsButtonHover?'#000000':'rgba(218, 238, 1,1)'}}>{searchResponse[0].name}</span>
            </button>
            {(searchResponse.length > 1)?
            <button style={{display:'flex', width:'100px', height:'50px',borderRadius:'20px',backgroundColor:isLogInButtonHover?'rgba(218, 238, 1,1)':'#000000', borderWidth:'2px',borderColor:isLogInButtonHover?'transparent':'rgba(218, 238, 1,1)',borderStyle: "solid", justifyContent:'center', cursor:'pointer', marginRight:"10px", marginLeft:"10px"}}
              onClick={()=>{
                  console.log('clicked')
                  navigate(`/player?playerId=${searchResponse[1].playerId}`)
                  dispatch(setHeaderUI('PLAYER'))
              }}
            onMouseEnter={handleMouseEnterLogInButton}
            onMouseLeave={handleMouseLeaveLogInButton}>
              <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px', color:isLogInButtonHover?'#000000':'rgba(218, 238, 1,1)'}}>{searchResponse[1].name}</span>
            </button>:null}
          </div>
          :
          ((searchResponse.length == 0 || searchResponse == null || searchResponse ==undefined) && searchResults)?
          <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px', color:'rgba(218, 238, 1,1)'}}>No such player</span>
          :null
          }

          {(searchResults == false)?
          <button style={{display:'flex', width:'250px', height:'50px',borderRadius:'20px',backgroundColor:isKeyMomentsButtonHover?'rgba(218, 238, 1,1)':'#000000', marginRight:'50px',borderWidth:'2px',borderColor:isKeyMomentsButtonHover?'transparent':'rgba(218, 238, 1,1)',borderStyle: "solid", justifyContent:'center', cursor:'pointer'}}
          onClick={()=>{
            dispatch(setHeaderUI('SCOREBOARD'));
            navigate('/scoreboard');
          }}
          onMouseEnter={handleMouseEnterKeyMomentsButton}
          onMouseLeave={handleMouseLeaveKeyMomentsButton}>
            <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px', color:isKeyMomentsButtonHover?'#000000':'rgba(218, 238, 1,1)'}}>scoreboard</span>
          </button>:null}

          {(logInOutStatus.status == 'LOGGED_IN' && searchResults == false)?
          <button style={{display:'flex', width:'250px', height:'50px',borderRadius:'20px',backgroundColor:isProfileButtonHover?'rgba(218, 238, 1,1)':'#000000', borderWidth:'2px',borderColor:isProfileButtonHover?'transparent':'rgba(218, 238, 1,1)',borderStyle: "solid", justifyContent:'center', cursor:'pointer'}}
          onClick={()=>{dispatch(setHeaderUI('PROFILE'));
          navigate('/profile'); }}
          onMouseEnter={handleMouseEnterProfileButton}
          onMouseLeave={handleMouseLeaveProfileButton}>
            <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px', color:isProfileButtonHover?'#000000':'rgba(218, 238, 1,1)'}}>profile</span>
          </button>:
          (searchResults == false)?
          <button style={{display:'flex', width:'150px', height:'50px',borderRadius:'20px',backgroundColor:isLogInButtonHover?'rgba(218, 238, 1,1)':'#000000', borderWidth:'2px',borderColor:isLogInButtonHover?'transparent':'rgba(218, 238, 1,1)',borderStyle: "solid", justifyContent:'center', cursor:'pointer'}}
            onClick={()=>{
                console.log('clicked')
                if(logInOutStatus.status == 'LOGGED_OUT'){
                    dispatch(setLogInOut({logInId:null, type:null, status:'LOGGING_IN'}))
                }

                // setLogInUI(true);
            }}

          onMouseEnter={handleMouseEnterLogInButton}
          onMouseLeave={handleMouseLeaveLogInButton}>
            <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px', color:isLogInButtonHover?'#000000':'rgba(218, 238, 1,1)'}}>log in</span>
          </button>:null
          }

        </div>:
        <div style={{display:'flex', width:'100vw', height:'50px', flexDirection:'row', justifyContent:'flex-end',marginTop:'30px', marginRight:'50px'}}>
          
         <button style={{display:'flex', width:'100px', marginRight:'50px', height:'50px',borderRadius:'20px',backgroundColor:isBackButtonHover?'rgba(218, 238, 1,1)':'#000000', borderWidth:'2px',borderColor:isBackButtonHover?'transparent':'rgba(218, 238, 1,1)',borderStyle: "solid", justifyContent:'center', cursor:'pointer'}}
          onClick={()=>{
            dispatch(setLogInOut({logInId:null, type:null, status:'LOGGED_OUT'}));
            // navigate(-1);
          }}
          onMouseEnter={handleMouseEnterBackButton}
          onMouseLeave={handleMouseLeaveBackButton}>
            <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px', color:isBackButtonHover?'#000000':'rgba(218, 238, 1,1)'}}>back</span>
         </button>

          {(errorLogin == true)?
            <div style={{display:'flex', width:'30vw', height:'50px',flexDirection:'row', justifyContent:'center', borderWidth:'2px', borderRadius:'20px', borderStyle: "solid",marginRight:'35px'}}>
                <span style={{display:'flex', width:'100%',alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px', color:'red', justifyContent:'center', textAlign:'center'}}>invalid credentials</span>
            </div>
          :
          <>
          <div style={{display:'flex', width:'15vw', height:'50px',flexDirection:'row', justifyContent:'flex-start',  borderColor:'rgba(218, 238, 1,1)', borderWidth:'2px', alignSelf:'center', borderRadius:'20px', borderStyle: "solid",marginRight:'25px'}}>
            <input
                  style={{display:'flex', width:'100%', height:'40px', backgroundColor:'transparent', borderColor:'transparent', outline:'none', WebkitAppearance:'none', borderRadius:'16px', alignSelf:'center',
                  fontFamily:'Tektur', fontWeight:'bold', fontSize:'17px', color:'rgba(218, 238, 1,1)',borderRadius:'20px', justifyContent:'flex-start', textAlign:'center'}}
                  value={usernameValue}
                  placeholder={"enter username"}
                  onChange={(e) => {
                    setUsernameValue(e.target.value);
                    }}
                    />
          </div>

          <div style={{display:'flex', width:'15vw', height:'50px',flexDirection:'row', justifyContent:'flex-start',  borderColor:'rgba(218, 238, 1,1)', borderWidth:'2px', alignSelf:'center', borderRadius:'20px', borderStyle: "solid",marginRight:'10px'}}>
            <input
                  style={{display:'flex', width:'100%', height:'40px', backgroundColor:'transparent', borderColor:'transparent', outline:'none', WebkitAppearance:'none', borderRadius:'16px', alignSelf:'center',
                  fontFamily:'Tektur', fontWeight:'bold', fontSize:'17px', color:'rgba(218, 238, 1,1)',borderRadius:'20px', justifyContent:'flex-start', textAlign:'center'}}
                  type="password"
                  value={passwordValue}
                  hidden={true}
                  placeholder={"your password"}
                  onChange={(e) => {
                    setPasswordValue(e.target.value);
                    }}
                    />
          </div>
          </>}





          <div style={{display:'flex', width:'10vw', height:'60px',flexDirection:'column', justifyContent:'center',marginRight:'30px', alignSelf:'center'}}>
            
          <button style={{display:'flex', width:'50%', height:'30px',borderRadius:'20px',backgroundColor:isLogInPlayerButtonHover || logInType == 'PLAYER' ?'rgba(218, 238, 1,1)':'#000000', borderWidth:'2px',borderColor:isLogInPlayerButtonHover || logInType == 'PLAYER' ?'transparent':'rgba(218, 238, 1,1)',borderStyle: "solid", justifyContent:'center', cursor:'pointer', alignSelf:'center'}}
          onClick={() => {setLogInType('PLAYER')}}
          onMouseEnter={handleMouseEnterLogInPlayerButton}
          onMouseLeave={handleMouseLeaveLogInPlayerButton}>
            <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:isLogInPlayerButtonHover || logInType == 'PLAYER' ?'#000000':'rgba(218, 238, 1,1)'}}>player</span>
          </button>

          <button style={{display:'flex', width:'65%', height:'30px',borderRadius:'20px',backgroundColor:isLogInSponsorButtonHover || logInType == 'SPONSOR'?'rgba(218, 238, 1,1)':'#000000', borderWidth:'2px',borderColor:isLogInSponsorButtonHover || logInType == 'SPONSOR'?'transparent':'rgba(218, 238, 1,1)',borderStyle: "solid", justifyContent:'center', cursor:'pointer', marginTop:'10px', alignSelf:'center'}}
          onClick={() => {setLogInType('SPONSOR')}}
          onMouseEnter={handleMouseEnterLogInSponsorButton}
          onMouseLeave={handleMouseLeaveLogInSponsorButton}>
            <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'15px', color:isLogInSponsorButtonHover || logInType == 'SPONSOR'?'#000000':'rgba(218, 238, 1,1)'}}>sponsor</span>
          </button>

          </div>


          <button style={{display:'flex', width:'150px', height:'50px',borderRadius:'20px',backgroundColor:isLogInButtonHover?'rgba(218, 238, 1,1)':'#000000', borderWidth:'2px',borderColor:isLogInButtonHover?'transparent':'rgba(218, 238, 1,1)',borderStyle: "solid", justifyContent:'center', cursor:'pointer'}}
            onClick={()=>{
                logInUser()
            }}
          onMouseEnter={handleMouseEnterLogInButton}
          onMouseLeave={handleMouseLeaveLogInButton}>
            <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px', color:isLogInButtonHover?'#000000':'rgba(218, 238, 1,1)'}}>log in</span>
          </button>

        </div>:

        (headerUI == 'PROFILE')?
        <div style={{display:'flex', width:'100vw', height:'50px', flexDirection:'row', justifyContent:'flex-end',marginTop:'30px', marginRight:'50px'}}>
{/*           
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
            </div> */}

          <button style={{display:'flex', width:'100px', marginRight:'50px', height:'50px',borderRadius:'20px',backgroundColor:isBackButtonHover?'rgba(218, 238, 1,1)':'#000000', borderWidth:'2px',borderColor:isBackButtonHover?'transparent':'rgba(218, 238, 1,1)',borderStyle: "solid", justifyContent:'center', cursor:'pointer'}}
           onClick={()=>{
             navigate(-1);
             dispatch(goBack());
           }}
           onMouseEnter={handleMouseEnterBackButton}
           onMouseLeave={handleMouseLeaveBackButton}>
             <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px', color:isBackButtonHover?'#000000':'rgba(218, 238, 1,1)'}}>back</span>
          </button>
 
           <button style={{display:'flex', width:'150px', height:'50px',borderRadius:'20px',backgroundColor:isLogOutButtonHover?'rgba(218, 238, 1,1)':'#000000', borderWidth:'2px',borderColor:isLogOutButtonHover?'transparent':'rgba(218, 238, 1,1)',borderStyle: "solid", justifyContent:'center', cursor:'pointer'}}
             onClick={async ()=>{
                 await localStorage.setItem('loginId',null);
                 await localStorage.setItem('loginType', null);
                 dispatch(setLogInOut({logInId:null, type:null, status:'LOGGED_OUT'}));
                 dispatch(setHeaderUI('HOME'));
                 navigate('/')
             }}
           onMouseEnter={handleMouseEnterLogOutButton}
           onMouseLeave={handleMouseLeaveLogOutButton}>
             <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px', color:isLogOutButtonHover?'#000000':'rgba(218, 238, 1,1)'}}>log out</span>
           </button>
 
        </div>:

        (headerUI == 'PLAYER')?
        <div style={{display:'flex', width:'100vw', height:'50px', flexDirection:'row', justifyContent:'flex-end',marginTop:'30px', marginRight:'50px'}}>
          
          {/* <div style={{display:'flex', width:'30vw', height:'50px',flexDirection:'row', justifyContent:'flex-start',  borderColor:'rgba(218, 238, 1,1)', borderWidth:'2px', alignSelf:'center', borderRadius:'20px', borderStyle: "solid",marginRight:'50px'}}>
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
          </div> */}

        <button style={{display:'flex', width:'100px', height:'50px',borderRadius:'20px',backgroundColor:isBackButtonHover?'rgba(218, 238, 1,1)':'#000000', borderWidth:'2px',borderColor:isBackButtonHover?'transparent':'rgba(218, 238, 1,1)',borderStyle: "solid", justifyContent:'center', cursor:'pointer'}}
         onClick={()=>{
           navigate(-1);
           dispatch(goBack());
         }}
         onMouseEnter={handleMouseEnterBackButton}
         onMouseLeave={handleMouseLeaveBackButton}>
           <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px', color:isBackButtonHover?'#000000':'rgba(218, 238, 1,1)'}}>back</span>
        </button>
      </div>
        :
        (headerUI == 'SCOREBOARD')?
        <div style={{display:'flex', width:'100vw', height:'50px', flexDirection:'row', justifyContent:'flex-end',marginTop:'30px', marginRight:'50px'}}>
          
          {/* <div style={{display:'flex', width:'30vw', height:'50px',flexDirection:'row', justifyContent:'flex-start',  borderColor:'rgba(218, 238, 1,1)', borderWidth:'2px', alignSelf:'center', borderRadius:'20px', borderStyle: "solid",marginRight:'50px'}}>
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
          </div> */}

        <button style={{display:'flex', width:'100px', height:'50px',borderRadius:'20px',backgroundColor:isBackButtonHover?'rgba(218, 238, 1,1)':'#000000', borderWidth:'2px',borderColor:isBackButtonHover?'transparent':'rgba(218, 238, 1,1)',borderStyle: "solid", justifyContent:'center', cursor:'pointer'}}
         onClick={()=>{
           navigate(-1);
           dispatch(goBack());
         }}
         onMouseEnter={handleMouseEnterBackButton}
         onMouseLeave={handleMouseLeaveBackButton}>
           <span style={{display:'flex', alignSelf:'center', fontFamily:'Tektur', fontWeight:'bold', fontSize:'20px', color:isBackButtonHover?'#000000':'rgba(218, 238, 1,1)'}}>back</span>
        </button>
        </div>:
        null
        }

      </div>
    );
}

export default Header;