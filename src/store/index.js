import { createStore, applyMiddleware, compose } from "redux";
import createLogger from "redux-logger";
import thunkMiddleware from "redux-thunk";
import rootReducer from "../reducers";

const configureStore = preloadedState => {
  return createStore(
    rootReducer,
    preloadedState,
    compose(
      applyMiddleware(thunkMiddleware, createLogger) // 日志放在最后
    )
  );
};

const store = configureStore(); // 这里直接调用会报错

export default configureStore;
