import { LIST_FETCH_START, LIST_FETCH_SUCCESS, LIST_FETCH_FAILURE, LIST_STATE_CHANGE, LIST_FACTOR_CHANGE } from '../constants/actionsTypes';
// 原始默认state
const defaultState = {
    user: {},
    dataList: [],
    page: 0,
    totalCount: 0,
    refreshing: false,
    loading: false,
    modalVisible: false
}

function list(state = defaultState, action) {
    switch (action.type) {
        case LIST_FETCH_START:
            state.loading = true
            return Object.assign({}, state);
        case LIST_FETCH_SUCCESS:
            return Object.assign({}, state, {
                dataList: [...state.dataList, ...action.payload.data],
                totalCount: action.payload.data.total,
                loading: false
            });
        case LIST_STATE_CHANGE:
            state.dataList[action.payload].up = !state.dataList[action.payload].up
            return Object.assign({}, state);
        case LIST_FACTOR_CHANGE:
            state[action.payload.name] = action.payload.value
            return Object.assign({}, state);
        default:
            return state;
    }
}

export default list