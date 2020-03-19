import {Action, createReducer, on} from '@ngrx/store';
import {AuthLogout} from '../actions/auth.actions';
import {LayoutSetSideBar, LayoutSetSideBarDisplay} from '../actions/layout.actions';

export const layoutFeatureKey = 'layout';

export interface InterfaceStateLayout {
  showSideBar: boolean;
  isSideBarCollapsed: boolean;
  barRotation: number;
}

export const initialState: InterfaceStateLayout = {
  showSideBar: false,
  isSideBarCollapsed: false,
  barRotation: 0,
};

const layoutReducer = createReducer(
  initialState,
  on(LayoutSetSideBarDisplay, (state, props) => ({
    ...state,
    showSideBar: props.payload,
  })),
  on(LayoutSetSideBar, (state, props) => ({
    ...state,
    isSideBarCollapsed: props.payload,
    barRotation: !props.payload ? 0 : 90,
  })),
  on(AuthLogout, () => initialState),
);

export function reducer(state: InterfaceStateLayout | undefined, action: Action) {
  return layoutReducer(state, action);
}
