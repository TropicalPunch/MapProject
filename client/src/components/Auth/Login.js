import React,{useContext} from "react";
import {GraphQLClient} from 'graphql-request';
import {GoogleLogin} from 'react-google-login'
import { withStyles } from "@material-ui/core/styles";
import Context from "../../context";


import Typography from "@material-ui/core/Typography";
import {ME_QUERY} from "../../graphql/queries";
import{BASE_URL} from "../../client";


const Login = ({ classes }) => {

  const{dispatch} = useContext(Context)

  const onSuccess = async (googleUser)=>{
    try{
    const idToken =  googleUser.getAuthResponse().id_token;
    console.log({idToken})

      
   const client =  new GraphQLClient(BASE_URL,
   {headers: {authorization: idToken}})
     // instead we use  BASE_URL see client.js
  //  const client =  new GraphQLClient('http://localhost:4000/graphql',
  //   {headers: {authorization: idToken}})

     //const data = await client.request(ME_QUERY)
     const {me} = await client.request(ME_QUERY)
    //console.log({data})
    console.log({me})

    //dispatch({type:"LOGIN_USER", payload: data.me})
    dispatch({type:"LOGIN_USER", payload: me});

    dispatch({type:"IS_LOGGED_IN", payload: googleUser.isSignedIn()});

  }catch(err){

    onFailure(err)
  }
  };

  const onFailure = err =>{
    console.error(" hi ori, you have an error logging in")
  }

  return( 
    
   <div className={classes.root} >
     <Typography component = "h1" variant = "h3" gutterBottom  style={{color:"rgb(66,133,244"}}>
      Welcome Sranger...
     </Typography>
  <GoogleLogin clientId='836223530702-tsq27eci1v7cm96v9aqn828d76798j39.apps.googleusercontent.com' 
  onSuccess={onSuccess}
  onFailure = {onFailure}
  // buttonText = "Login"
  theme = "dark" //google login button
  isSignedIn= {true} />
  </div>
  )
};

const styles = {
  root: {
    height: "50vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
