import { FETCH_ALL,SEARCH } from '../constants/actionTypes';

var intiState={
  projectCosts:[],
  search:'',
}
export default (state = intiState, action) => {
  switch (action.type) {
    case FETCH_ALL:
      return {...state,projectCosts:action.payload};
    case SEARCH:
      return {...state,search:action.payload};
    default:
      return state;
  }
};

