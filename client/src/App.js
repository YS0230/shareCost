import React,{useState} from 'react';
import { Container } from '@material-ui/core';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import FromProject from './components/FromProject/FromProject'
import Consumption from './components/Consumption/Consumption'
import FromProjectCost from './components/FromProjectCost/FromProjectCost'
import FinalTable from './components/FinalTable/FinalTable'

import PrimarySearchAppBar from './components/PrimarySearchAppBar/PrimarySearchAppBar'

import Fab from '@material-ui/core/Fab';
import ReplyIcon from '@material-ui/icons/Reply';
import AddIcon from '@material-ui/icons/Add';
import useStyles from './Appstyles';
import {PullToRefresh} from "react-js-pull-to-refresh";
import {PullDownContent, ReleaseContent, RefreshContent} from "react-js-pull-to-refresh";


const App = () => {
  const [addVisible,SetAddVissible] = useState(true);
  const classes = useStyles();
  const onRefresh = ()=> {
    return new Promise((resolve) => {
      window.location.reload();
    });
  }
  const Visiable =()=>{
    let path = window.location.pathname;
    if(path==='/fromProjectCost' || path==='/fromProject' || path==='/finalTable'){
      SetAddVissible(false);
    }else{
      SetAddVissible(true);
    }
  };
  const addPath =()=>{
    Visiable();
    let path = window.location.pathname;
    if(path==='/consumption'){
      return '/fromProjectCost'
    }else{
      return'/fromProject'
    }
  };
  const replyPath =()=>{
    Visiable();
    let path = window.location.pathname;
    console.log(path)
    if(path==='/fromProjectCost'){
      return '/consumption'
    }else if(path === '/finalTable'){
      return '/consumption'
    }
    else{
      return'/'
    }
  };
  
  return (
    <BrowserRouter>
    <Container maxWidth="lg">
      {console.log('app')}
      <PrimarySearchAppBar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/auth" exact component={Auth} />
        <Route path="/fromProject" exact component={FromProject} />
        <Route path="/consumption" exact component={Consumption} />
        <Route path="/fromProjectCost" exact component={FromProjectCost} />
        <Route path="/finalTable" exact component={FinalTable} />
      </Switch>
      { addVisible &&
        <Fab component={Link} to={addPath} className={classes.fab} color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      }
      <Fab component={Link} to={replyPath} onClick={()=>{if(window.location.pathname==='/fromProjectCost' || window.location.pathname==='/finalTable'){localStorage.removeItem('pc_id');}else{localStorage.removeItem('prj_id');localStorage.removeItem('pc_id');} }} color="primary" className={classes.fabReply} aria-label="add">
        <ReplyIcon style={{ fontSize: 40 }} />
      </Fab>
    </Container>
  </BrowserRouter>
  )

};

export default App;
