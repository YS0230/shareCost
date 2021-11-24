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
    toast('🥳 建立成功!');
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
    toast('🥳 存擋成功!');
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
    toast(prj_name+' 刪除成功!🥳');
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
    toast('確認成功!🥳');
    
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
    toast('退出成功!🥳');
    
  } catch (error) {
    console.log(error);
    toast.warn(error.response.data.message);
  }
};

