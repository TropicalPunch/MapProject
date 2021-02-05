import React,{useState,useEffect, useContext} from "react";
import ReactMapGL,{NavigationControl, Marker, Popup} from 'react-map-gl';
import { withStyles } from "@material-ui/core/styles";
import differenceInMinutes from 'date-fns/difference_in_minutes'
// import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import {useClient} from '../client'; //homemade HOOK
import{ GET_PINS_QUERY } from '../graphql/queries';
import PinIcon from './PinIcon';
import Blog from "./Blog";
import Context from "../context";

const INITIAL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 15
}
const Map = ({ classes }) => {
  const client = useClient(); //homemade hook
  const {state, dispatch} = useContext(Context)
  
  useEffect(()=>{
    getPins()
  },[]); //when map mounts

  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState(null);

  useEffect(()=>{
    getUserPosition()
  },[]); //when map mounts

  const [popup, setPopup] = useState(null)


 const getUserPosition =() =>{
   if("geolocation" in navigator){
     navigator.geolocation.getCurrentPosition( position =>{

      const {latitude,longitude} = position.coords
      setViewport({...viewport, latitude, longitude})
      setUserPosition({latitude, longitude})
     })
   }

 }

 const getPins = async () => {
  const {getPins}  = await client.request(GET_PINS_QUERY) //destructure specific data from the request
  //console.log(getPins) //will show all pins i have ever created.
  dispatch({ type: "GET_PINS", payload: getPins})
}

 const handleMapClick = ({lngLat, leftButton /*destructured from the  event object */}) =>{
  //  console.log("click is working"+lngLat)
   if(!leftButton) return;
   if(!state.draft){ //if state.draft is null
     dispatch({type: "CREATE_DRAFT"})
   }
   const [longitude, latitude] = lngLat //array destructuring -latLong of where the user left clicked map
   dispatch({
     type: "UPDATE_DRAFT_PIN_LOCATION",
     payload: { longitude,  latitude }
   })
 }

 const highlightNewPin = pin =>{
  const isNewPin =  differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30
  return isNewPin ? "limegreen" : 'darkblue';

 }

 const handleSelectPin = ( pin )=>{
   setPopup(pin)

   dispatch({type:"SET_PIN", payload: pin})

 }
 
  return (
    <div className={classes.root}>
      <ReactMapGL
      width= "100vw"
      height="calc(100vh - 64px)"
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxApiAccessToken="pk.eyJ1Ijoib3Jpc3MiLCJhIjoiY2s4NmI4eHRtMGNqdzNtbzh1ZmQwMHk1bCJ9.2rHwi6-RJR9Y7zPcBFwmEw"
      onViewportChange={ newViewport => setViewport(newViewport)}
      onClick = {handleMapClick}
      {...viewport}
      >
        <div  className={classes.navigationControl}>
         <NavigationControl onViewportChange={ newViewport => setViewport(newViewport)}/>  
        </div>
        
        {/*pin for user's current loaction */}
        {userPosition && (
          <Marker
          latitude = {userPosition.latitude}
          longitude = {userPosition.longitude}
          offsetLeft = {-19}
          offsetTop = {-37}
          >
            <PinIcon size = {40} color = "red" />

          </Marker>
        )}

        {/*2nd marker--DraftPin= when user left click the screen */}
        {state.draft && (
          <Marker
          latitude = {state.draft.latitude}
          longitude = {state.draft.longitude}
          offsetLeft = {-19}
          offsetTop = {-37}
          >
            <PinIcon size = {40} color = "hotpink" />

          </Marker>
        )}

          {/*lets create all created pins /// dont forget to add a key prop!*/}
          
          {state.pins.map(pin =>(
             <Marker
              key={pin._id}
              latitude = {pin.latitude}
              longitude = {pin.longitude}
              offsetLeft = {-19}
              offsetTop = {-37}
             >
               <PinIcon onClick = {()=>{handleSelectPin(pin)}} size = {40} color = {highlightNewPin(pin)} />
   
             </Marker>
          ))}
        {/*popupdialog*/}
        {popup && (
         <Popup
           anchor = "top"
           latitude={popup.latitude}  
           longitude={popup.longitude} 
           closeOnClick={false} 
           onClose={()=> setPopup(null)} 
           >
             <img className={classes.popupimage} src={popup.image} alt={popup.title} />
            <div className={classes.popupTab}>
        <Typography> {popup.latitude.toFixed(6)},{popup.longitude.toFixed(6)}</Typography>
            </div>
         </Popup> 
        )}
      </ReactMapGL>
      {/*blog area when pin added */}
      <Blog/>
    </div>
  )
  
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
