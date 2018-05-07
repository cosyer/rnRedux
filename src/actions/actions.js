import { INCREASE, DECREASE, RESET ,FETCH_START,FETCH_SUCCESS,FETCH_FAILURE} from '../constants/actionsTypes';
import Request from '../utils/request'
import Mock from 'mockjs'

const increase = () => ({ type: INCREASE });
const decrease = () => ({ type: DECREASE });
const reset = () => ({ type: RESET });

const fetchStart = () => ({ type: FETCH_START });
const fetchSuccess = (data) => ({ type: FETCH_SUCCESS,data});
const fetchFailure = () => ({ type: FETCH_FAILURE });


function refresh() {
    return dispatch => {
        return Request.get("http://rap.taobao.org/mockjs/8417/api/creations",{},(data)=>{
                 console.log(Mock.mock(data)) 
                 dispatch(fetchSuccess(data && Mock.mock(data)));
        })
    }
}

// setTimeout(() => {
//     dispatch(refreshSuccess(json && json.data.list));
// }, 3000);

export {
    increase,
    decrease,
    reset,
    refresh
}