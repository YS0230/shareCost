import { FETCH_ALL,SEARCH} from '../constants/actionTypes';
import * as api from '../api/index.js';
import { toast } from 'react-toastify';

export const getProjects = (setisLoading) => async (dispatch) => {
  try {
    const { data } = await api.fetchProjects();
    dispatch({ type: FETCH_ALL, payload: data });
    setisLoading(false);
  } catch (error) {
    console.log(error);
    if(error.response){
      toast.warn(error.response.data.message);
    }
  }
};

export const createProject = (project, router) => async (dispatch) => {
  try {
    await api.createProject(project);
    router.push('/');
    toast('π₯³ ε»Ίη«ζε!');
  } catch (error) {
    console.log(error);
    toast.warn(error.response.data.message);
  }
};

export const updateProject = (id, project,history) => async (dispatch) => {
  try {
    await api.updateProject(id, project);
    const { data } = await api.fetchProjects();
    dispatch({ type: FETCH_ALL, payload: data });
    toast('π₯³ ε­ζζε!');
    history.goBack();
  } catch (error) {
    console.log(error);
    toast.warn(error.response.data.message);
  }
};

export const deleteProject = (id,prj_name) => async (dispatch) => {
  try {
    await api.deleteProject(id);
    const { data } = await api.fetchProjects();
    dispatch({ type: FETCH_ALL, payload: data });
    toast(prj_name+' εͺι€ζε!π₯³');
  } catch (error) {
    console.log(error);
    toast.warn(error.response.data.message);
  }
};

export const search = (value) =>  (dispatch) => {
    dispatch({ type: SEARCH, payload: value });
};

export const projectMemberConfirm = (prj_id) => async (dispatch) => {
  try {
    console.log('test');
    await api.projectMemberConfirm(prj_id);
    const { data } = await api.fetchProjects();
    dispatch({ type: FETCH_ALL, payload: data });
    toast('η’Ίθͺζε!π₯³');
    
  } catch (error) {
    console.log(error);
    toast.warn(error.response.data.message);
  }
};
export const projectMemberCancel = (prj_id) => async (dispatch) => {
  try {
    console.log('test');
    await api.projectMemberCancel(prj_id);
    const { data } = await api.fetchProjects();
    dispatch({ type: FETCH_ALL, payload: data });
    toast('ιεΊζε!π₯³');
    
  } catch (error) {
    console.log(error);
    toast.warn(error.response.data.message);
  }
};

