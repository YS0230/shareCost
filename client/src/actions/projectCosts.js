import { FETCH_ALL,SEARCH} from '../constants/actionTypes';
import * as api from '../api/index.js';
import { toast } from 'react-toastify';

export const getProjectCosts = (prj_id,setisLoading) => async (dispatch) => {
  try {
    const { data } = await api.fetchProjectCosts(prj_id);

    dispatch({ type: FETCH_ALL, payload: data });
    setisLoading(false);
  } catch (error) {
    console.log(error);
    toast.warn(error.response);
  }
};

export const createProjectCost = (projectCost, router) => async (dispatch) => {
  try {
    await api.createProjectCost(projectCost);

    router.goBack();
    toast(projectCost.pc_name+' ε»Ίη«ζε!π₯³');
  } catch (error) {
    console.log(error);
    toast.warn(error.response.data.message);
  }
};

export const updateProjectCost = (prj_id,pc_id, projectCost,history) => async (dispatch) => {
  try {
    await api.updateProjectCost(prj_id,pc_id, projectCost);

    const { data } = await api.fetchProjectCosts(prj_id);
    dispatch({ type: FETCH_ALL, payload: data });
    toast('π₯³ ε­ζζε!');
    history.goBack();
  } catch (error) {
    console.log(error);
    toast.warn(error.response.data.message);
  }
};

export const deleteProjectCost = (prj_id,pc_id,pc_name) => async (dispatch) => {
  try {
    await await api.deleteProjectCost(prj_id,pc_id);

    const { data } = await api.fetchProjectCosts(prj_id);

    dispatch({ type: FETCH_ALL, payload: data });
    toast(pc_name+' εͺι€ζε!π₯³');
  } catch (error) {
    console.log(error);
    toast.warn(error.response.data.message);
  }
};

export const search = (value) => (dispatch) => {
  
    dispatch({ type: SEARCH, payload: value });
    
};
export const projectCostConfirm = (prj_id,pc_id) => async (dispatch) => {
  try {
    console.log('test');
    await api.projectCostConfirm(prj_id,pc_id);
    
    const { data } = await api.fetchProjectCosts(prj_id);
    dispatch({ type: FETCH_ALL, payload: data });
    toast('η’Ίθͺζε!π₯³');
    
  } catch (error) {
    console.log(error);
    toast.warn(error.response.data.message);
  }
};