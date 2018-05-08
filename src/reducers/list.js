import { FETCH_START, FETCH_SUCCESS, FETCH_FAILURE, STATE_CHANGE, FACTOR_CHANGE } from '../constants/actionsTypes';
// 原始默认state
const defaultState = {
    dataList: [],
    totalCount: 0,
    refreshing: false,
    loading: false
}

function list(state = defaultState, action) {
    switch (action.type) {
        case FETCH_START:
            state.loading = true
            return Object.assign({}, state);
        case FETCH_SUCCESS:
            return Object.assign({}, state, {
                dataList: [...state.dataList, ...action.data.data],
                totalCount: action.data.total,
                loading: false
            });
        case STATE_CHANGE:
            state.dataList[action.index].up = !state.dataList[action.index].up
            return Object.assign({}, state);
        case FACTOR_CHANGE:
            state[action.name] = action.value
            return Object.assign({}, state);
        default:
            return state;
    }
}

export default list