import React, { useState, useEffect } from 'react';
import { Container, Grow, Grid,CircularProgress } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { getProjects } from '../../actions/projects';
import Projects from '../Projects/Projects'
import ControlPanel from '../ControlPanel/ControlPanel'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import useStyles from './styles';
import { Link } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Home = () => {
  const [isLoading, setisLoading] = useState(true);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [onlySelfProject, setOnlySelfProject] = useState(false);
  const [onlyUnConfirm, setonlyUnConfirm] = useState(false);
  const [statusCode, setStatusCode] = useState('0')

  localStorage.removeItem('prj_id');
  localStorage.removeItem('pc_id');
  useEffect(() => {
    dispatch(getProjects(setisLoading));
  },[dispatch]);

  return (
    (isLoading ? <CircularProgress className={classes.progress} />: <Container>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Grow in>
      <Container>
      {console.log('home')}
        <Grid container justify="space-between" alignItems="stretch" spacing={3}>
          <Grid item xs={12} sm={12}>
            <ControlPanel 
              onlySelfProject={onlySelfProject} 
              setOnlySelfProject={setOnlySelfProject} 
              onlyUnConfirm={onlyUnConfirm} 
              setonlyUnConfirm={setonlyUnConfirm}
              statusCode={statusCode}
              setStatusCode={setStatusCode} />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Projects 
              isLoading={isLoading} 
              onlySelfProject={onlySelfProject} 
              onlyUnConfirm={onlyUnConfirm}
              statusCode={statusCode} />
          </Grid>
        </Grid>
        {false && <div>
          <Fab component={Link} to="/fromProject" onClick={()=>{localStorage.removeItem('prj_id',null)}} className={classes.fab} color="primary" aria-label="add">
          <AddIcon />
        </Fab>
          </div>}
        
      </Container>
    </Grow>
      </Container>
  ));
};

export default Home;
