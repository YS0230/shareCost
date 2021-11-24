import { combineReducers } from 'redux';

import posts from './posts';
import auth from './auth';
import projects from './projects'
import members from './members'
import projectCosts from './projectCosts'

export const reducers = combineReducers({ posts, auth, projects, members,projectCosts });
