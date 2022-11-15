import ReactDOM from "react-dom";
import React from "react";
import "./scss/main.scss";
import { applyMiddleware, createStore } from "redux"
import { Provider } from "react-redux"
import { composeWithDevTools } from "redux-devtools-extension"
import thunk from "redux-thunk"
import reducer from "./redux/reducers"

import Lights from "./lights"

export const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(thunk)) //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)


ReactDOM.render(
    <Provider store={store}>
        <Lights store={store} />
    </Provider>
    , document.querySelector("#root")
)