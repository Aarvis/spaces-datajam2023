import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setEvent } from '../../redux/reducers/eventTimelineReducer.js';
import { setLineWidth } from '../../redux/reducers/lineWidthReducer.js';
import { setMaxWidthReached } from '../../redux/reducers/maxWidthReachedReducer.js';
import { setReceivedDots } from '../../redux/reducers/receivedDotsReducer.js';
import { setRoundEnded } from '../../redux/reducers/roundEndedReducer.js';
import { setRoundStarted } from '../../redux/reducers/roundStartedReducer.js';
import './EventTimeline.css';


function waitForTimeout(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve("Timeout finished");
        }, ms);
    });
}

function timeDifference(timestamp1, timestamp2) {
// Parse the timestamps into Date objects
const date1 = new Date(timestamp1);
const date2 = new Date(timestamp2);

// Compute the difference in milliseconds
const differenceInMillis = Math.abs(date2 - date1);

// Convert the difference to seconds
const differenceInSeconds = differenceInMillis / 1000;

return differenceInSeconds;
}

let MAX_LINE_WIDTH = 1200;

const EventTimeline = () => {
  console.log('Event Timeline entered');
  // const [receivedDots, setReceivedDots] = useState([]);
  // const [lineWidth, setLineWidth] = useState(0);
//   const [event, setEvent] = useState(null);
  const event = useSelector(state=> state.eventTimelineReducer);
  const roundStarted = useSelector(state=> state.roundStartedReducer);
  const roundEnded = useSelector(state=> state.roundEndedReducer);
  const maxWidthReached = useSelector(state=>state.maxWidthReachedReducer);
  const receivedDots = useSelector(state=>state.receivedDotsReducer);
  const receivedDotsRef = useRef(receivedDots);
  const lineWidth = useSelector(state=>state.lineWidthReducer);
  const lineWidthRef = useRef(lineWidth);
  const dispatch = useDispatch();
  // console.log('event',event)
  // const [roundStarted, setRoundStarted] = useState(false);
  // const [roundEnded, setRoundEnded] = useState(false);
  const roundEndedRef = useRef(roundEnded);
  // const [maxWidthReached, setMaxWidthReached] = useState(false);
  let previousMaxWidthReached = useRef(null);
  const intervalRef = useRef(null);
  let roundTime = useRef(0);

  //new Round

  useEffect(() => {
    roundEndedRef.current = roundEnded;
  }, [roundEnded]);

  useEffect(() => {
    receivedDotsRef.current = receivedDots;
  }, [receivedDots]);

  useEffect(() => {
    lineWidthRef.current = lineWidth;
  }, [lineWidth]);
  


  async function shrinkEvents(){
    while(true){
        console.log('In Loop')
        console.log('roundEnded',roundEnded)
        roundTime.current = roundTime.current + 100;

        const newDots = receivedDotsRef.current.map((dot, index) => {
            return {
            ...dot,
            position: parseInt((((dot.position/MAX_LINE_WIDTH)*((roundTime.current-100)/1000))*MAX_LINE_WIDTH)/(roundTime.current/1000)),
            };
            });
        // setDots(newDots.slice());
        dispatch(setReceivedDots(newDots.slice()))

        if(roundEndedRef.current){
            console.log('breaking shrink events')
            break;
        }

        let wait = await waitForTimeout(100);
    }
    }

    if(maxWidthReached == true && previousMaxWidthReached.current != maxWidthReached){
        console.log('running shrink events')
        shrinkEvents()
    }

    if(previousMaxWidthReached.current != maxWidthReached){
        previousMaxWidthReached.current = maxWidthReached
    }

  useEffect(() => {
    if(roundStarted == true){
    // Increase the width of the line smoothly over time
    const increaseWidthInterval = setInterval(() => {
        // console.log('increaseWidthInterval running'+roundTime.current)

        if (lineWidthRef.current < MAX_LINE_WIDTH) {
          roundTime.current = roundTime.current + 100;
          lineWidthRef.current = lineWidthRef.current + 1
          let tempWidth = lineWidthRef.current;
          console.log("tempWidth",tempWidth)
          dispatch(setLineWidth(tempWidth));
        }
        else{
            roundTime.current = roundTime.current + 100;
            dispatch(setMaxWidthReached(true));
            dispatch(setLineWidth(MAX_LINE_WIDTH));
        }}, 100);

    intervalRef.current = increaseWidthInterval

    // async function runEventSamples(){
     
    //     let currentTimestamp = null;
    //     let previousTimestamp = null;

    //     for (let n=0; n<=eventSamples.length-1; n++){
    //         if(currentTimestamp ==null){
    //             currentTimestamp = eventSamples[n].timestamp
    //             previousTimestamp = eventSamples[n].timestamp
    //             setEvent(eventSamples[n])
    //         }
    //         else{
    //             currentTimestamp = eventSamples[n].timestamp
    //             console.log('event processing',eventSamples[n])
    //             await waitForTimeout((timeDifference(currentTimestamp,previousTimestamp))*1000);
    //             setEvent(eventSamples[n])
    //             if(eventSamples[n].type == 'GAME_ENDED_ROUND'){
    //                 setRoundEnded(true);
    //                 console.log('GAME_ENDED_ROUND')
    //                 clearInterval(intervalRef.current);
    //             }
    //             previousTimestamp = eventSamples[n].timestamp
    //         }
    //     }
        
    // }

    // runEventSamples();

    return () => {
      clearInterval(increaseWidthInterval);
    };
    }
  }, [roundStarted]);

  useEffect(() => {
    if (event) {
      console.log('inside2')
        if(event.eventType == 'GAME_STARTED_ROUND'){

          console.log('inside1')
          previousMaxWidthReached.current = null;
          console.log(' previousMaxWidthReached.current', previousMaxWidthReached.current)
          intervalRef.current = null;
          console.log('intervalRef.current', intervalRef.current)
          lineWidthRef.current = 0;
          console.log('lineWidthRef.current', lineWidthRef.current)
          receivedDotsRef.current = [];
          console.log('receivedDots.current', receivedDots.current)
          console.log('0')
          dispatch(setMaxWidthReached(false));
          console.log('1')
          dispatch(setLineWidth(0));
          console.log('2')
          dispatch(setReceivedDots([{ type: event.eventType, position: 0}]));
          console.log('3')
          dispatch(setRoundEnded(false));
          console.log('4')
          dispatch(setRoundStarted(true));
          console.log('5')
          console.log('GAME_STARTED_ROUND')
        }
        else if(event.eventType == 'GAME_ENDED_ROUND'){
          if (lineWidth < MAX_LINE_WIDTH) {
            dispatch(setReceivedDots([...receivedDots, { type: event.eventType, position: lineWidth-5 }]))
          }
          else{
            dispatch(setReceivedDots([...receivedDots, { type: event.eventType, position: MAX_LINE_WIDTH-5 }]))
          }
          clearInterval(intervalRef.current);  
          dispatch(setRoundEnded(true));
          dispatch(setRoundStarted(false));
          console.log('GAME_ENDED_ROUND')
        }
        else {
          if (lineWidth < MAX_LINE_WIDTH) {
            dispatch(setReceivedDots([...receivedDots, { type: event.eventType, position: lineWidth-5 }]))
          }
          else{
            dispatch(setReceivedDots([...receivedDots, { type: event.eventType, position: MAX_LINE_WIDTH-5 }]))
          }
        }
    }
  }, [event]);


  return (
    <div className="timeline-container">
      <div className="timeline-line" style={{ width: `${lineWidth}px` }}>
        {receivedDots.map((dot, index) => (
          <div
            key={index}
            className={`timeline-dot ${dot.type}`}
            style={{ left: `${dot.position}px` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default EventTimeline;