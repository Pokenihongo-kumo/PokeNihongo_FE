import { watchEditorAuthSaga } from "@redux/features/auth/saga";
import { all } from "redux-saga/effects";
// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
    yield all([watchEditorAuthSaga()]);
}
