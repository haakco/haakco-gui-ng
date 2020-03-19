"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = require("@ngrx/store");
exports.loadLayouts = store_1.createAction('[Layout] Load Layouts');
exports.loadLayoutsSuccess = store_1.createAction('[Layout] Load Layouts Success', store_1.props());
exports.loadLayoutsFailure = store_1.createAction('[Layout] Load Layouts Failure', store_1.props());
