import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import reducers from "./reducer/index";
import thunk from "redux-thunk";


// const rootReducer = combineReducers({

// });

// const configureStore = () => {
//   return createStore(rootReducer, compose(applyMiddleware(thunk)));
// };

// export default configureStore;


const store = createStore(reducers, applyMiddleware(thunk));
export default store;


