import {useState, useEffect} from 'react';
import{GraphQLClient} from 'graphql-request';

export const BASE_URL = process.env.NODE_ENV === "production" ? "<insert-production-url>" : "http://localhost:4000/graphql"

// this will be a home made hook-  because there is a duplicate code for client , both in Login.js and CreatePin.js
// client configuration needs- a URL, an endpoint (such as headers) and a token
export const useClient = () =>{
    const [idToken, setIdToken] = useState('')
    useEffect(()=>{ //will go only once the component is ready, meaning the window object is ready and we can access the id token.
        const token = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
        setIdToken(token)
    },[])

return new GraphQLClient(BASE_URL, {
    headers: { authorization: idToken } 
})

}