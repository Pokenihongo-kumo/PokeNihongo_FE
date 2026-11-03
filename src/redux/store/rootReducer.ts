import { combineReducers } from "redux";
import authReducer from "@redux/features/auth/slice";
import languageReducer from "@redux/features/language/slice";

const rootReducers = combineReducers({
    auth: authReducer,
    language: languageReducer,
});

export default rootReducers;
