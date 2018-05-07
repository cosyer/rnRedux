import { FETCH_START,FETCH_SUCCESS,FETCH_FAILURE} from '../constants/actionsTypes';
// 原始默认state
const defaultState = {
    dataList: [],
    totalCount:0
}

function list(state = defaultState, action) {
    switch (action.type) {
        case FETCH_SUCCESS:
            return Object.assign({}, ...state, {
                dataList : [...state.dataList, ...action.data.data],
                totalCount : action.data.total
            });
        default:
            return state;
    }
}

export default list