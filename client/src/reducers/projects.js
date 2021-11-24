import { FETCH_ALL,SEARCH } from '../constants/actionTypes';

var intiState={
  projects:[],
  search:''
}
export default (state = intiState, action) => {
  switch (action.type) {
    case FETCH_ALL:
      return {...state,projects:action.payload};
    case SEARCH:
      return {...state,search:action.payload};
    default:
      return state;
  }
};

