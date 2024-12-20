// src/redux/reducers/index.js
import { combineReducers } from 'redux';
import coreReducer from './coreReducer';
import listReducer from './listReducer';
import elementReducer from './elementReducer';
import { modalReducer } from './modal-reducer';
import { sidebarReducer } from './sidebar-reducer';
import { drawerReducer } from './drawer-reducer';
import websiteReducer from './websiteReducer';

const rootReducer = combineReducers({
  core: coreReducer,
  modalReducer: modalReducer,
  sidebarReducer: sidebarReducer,
  list: listReducer,
  element: elementReducer,
  drawer: drawerReducer,
  website: websiteReducer,
});

export default rootReducer;
