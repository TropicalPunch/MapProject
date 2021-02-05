import React from "react";
import Header from '../components/Header'
import withRoot from "../withRoot";
import Map from '../components/Map';

const App = () => {
  return(
    <>
    <Header>App</Header>
    <Map/>
    </>
    )
};

export default withRoot(App);
