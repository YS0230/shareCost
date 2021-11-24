import { FETCH_ALL, CREATE, UPDATE, DELETE } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const getMembers = () => async (dispatch) => {
  try {
    const { data } = await api.fetchMembers();

    dispatch({ type: FETCH_ALL, payload: data });
  } catch (error) {
    console.log(error);
  }
};

//export const createProject = (project) => async (dispatch) => {
//  try {
//    const { data } = await api.createProject(project);
//
//    dispatch({ type: CREATE, payload: data });
//  } catch (error) {
//    console.log(error);
//  }
//};
//
//export const updateProject = (id, project) => async (dispatch) => {
//  try {
//    const { data } = await api.updateProject(id, project);
//
//    dispatch({ type: UPDATE, payload: data });
//  } catch (error) {
//    console.log(error);
//  }
//};
//
//export const deleteProject = (id) => async (dispatch) => {
//  try {
//    await await api.deleteProject(id);
//
//    dispatch({ type: DELETE, payload: id });
//  } catch (error) {
//    console.log(error);
//  }
//};
