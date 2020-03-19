"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = require("@ngrx/store");
exports.layoutFeatureKey = 'layout';
exports.initialState = {};
var layoutReducer = store_1.createReducer(exports.initialState);
function reducer(state, action) {
    return layoutReducer(state, action);
}
exports.reducer = reducer;
