import { AUTH } from '../constants/actionTypes';
import * as api from '../api/index.js';

import { toast } from 'react-toastify';

export const signin = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);
    if(data.status !=='fail'){
      dispatch({ type: AUTH, data });
      router.push('/');
    }else{
      toast.warn(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.warn(error.response.data.message);
  }
};

export const signup = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);
    console.log(data);
    if(data.status !=='fail'){
      dispatch({ type: AUTH, data });
      router.push('/');
    }else{
      toast.warn(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.warn(error.response.data.message);
  }
};
