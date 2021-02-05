import React, {useState, useContext} from "react";
//import { GraphQLClient } from 'graphql-request'; no need because of the home made HOOK
import axios from 'axios';
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";

//homemade hook see client.js:
import {useClient} from "../../client";

import Context from "../../context";
import {CREATE_PIN_MUTATION} from '../../graphql/mutations';

const CreatePin = ({ classes }) => {
  //homemade HOOK 
  const client = useClient()

  const{state, dispatch} = useContext(Context)

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] =  useState(false);

  const addTitle = event => setTitle(event.target.value);
  const addImage = event => setImage(event.target.files[0]);
  const addContent= event => setContent(event.target.value);

  const handleImageUpload = async () =>{ //from cloudinary.com API
    const data = new FormData()
   // data.append("api_key","165343933115993")
    data.append("file", image)
    data.append("upload_preset", "geopins-sesh-in")
    data.append("cloud_name", "dzbnv0tix")

    const res = await axios.post('https://api.cloudinary.com/v1_1/dzbnv0tix/image/upload', data)

    return res.data.url

  }

  const handleSubmit = async event =>{
    
    try{
      event.preventDefault()
      setSubmitting(true)

      //instead we use client from our homemade HOOK which give us access to both id token & creates a new client
      // const idToken = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
      // const client =  new GraphQLClient('http://localhost:4000/graphql',{
      //   headers:{ authorization: idToken}
      // })

      const url = await handleImageUpload();

      const {latitude, longitude} = state.draft //destructure fron state

      const variables = {title, image: url, content, latitude, longitude}
      
      //const data = await client.request(CREATE_PIN_MUTATION, variables)
      const { createPin } = await client.request(CREATE_PIN_MUTATION, variables) //client is now in  reache from the home made hook!!!
      console.log('pin created',{ createPin } )
      // console.log({title,image, url ,content})

      dispatch({type: "CREATE_PIN", payload: createPin})

      handleDeleteDraft()

    }catch(err){
      setSubmitting(false)
      console.error("error creating Pin" , err)
    }

   
  
  }

  const handleDeleteDraft = ()=>{
    setTitle("")
    setImage("")
    setContent('')
    dispatch({
      type: "DELETE_DRAFT"
    })
  }



  

  return(
    <form className={classes.form}>
     <Typography
     className={classes.alignCenter}
     component="h2"
     varient="h4"
     color="secondary"
     >
      <LandscapeIcon className={classes.iconLarge}/>
      Pin A SESH
     </Typography>
     <div>
       <TextField onChange={addTitle} name="title" label="SESH Type" placeholder="Insert SESH title" />
       <input onChange={addImage} accept="image/*" id="image" type="file" className={classes.input} />
       <label htmlFor="image" >
         <Button style={{color: image && "green"}} component="span" size="small" className={classes.button}>
            <AddAPhotoIcon/>
         </Button>
       </label>
     </div>
     <div className={classes.contentField} >
       <TextField onChange={addContent} name="content" label="Your SESH info" multiline rows="6" margin="normal" fullwidth variant="outlined"  />
     </div>
     <div>
       <Button onClick={handleDeleteDraft} className={classes.button} varient="contained" color="primary" >
         <ClearIcon className={classes.leftIcon }/>
         Discard
       </Button>

       <Button disabled={!title.trim || !content.trim || !image || submitting} onClick={handleSubmit} type="submit" className={classes.button} varient="contained" color="secondary" >
         Submit
         <SaveIcon className={classes.rightIcon }/>
       </Button>
     </div>
    </form>);
};

const styles = theme => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing.unit
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "95%"
  },
  input: {
    display: "none"
  },
  alignCenter: {
    display: "flex",
    alignItems: "center"
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0
  }
});

export default withStyles(styles)(CreatePin);
