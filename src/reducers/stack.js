import Routers from '../route';

const navReducer = (state, action) => {
    console.log(Routers)
    const newState = Routers.router.getStateForAction(action, state);
    return newState || state;
}

export default navReducer;