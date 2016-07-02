// *
// the routing in rootReducer is an experimental using of react-router-redux
// 
// runtime is produced by experiment about using react-redux in SSR
// 
// --------------------------------------------------------------------------------

import {combineReducers} from 'redux'
import {routerReducer as routing} from 'react-router-redux'
import ATs from '../constants/ActionTypes'
import {listLite} from '../constants'

function getMaxPageNum(num) {
	const l = listLite.length;
	return l % num === 0 ? Math.floor(l / num) - 1 : Math.floor(l / num);
}

const initial = {
	runtime: '',
	nav: {
		toggle: false,
		fixed: false,
		visible: false,
	},
	index: {
		max: getMaxPageNum(10),
		num: 0,
	},
	about: {
		lang: 'C',
	},
	catalog: {
		toggle: false,
		fixed: false,
	}
};


function runtime(state = initial.runtime, action) {
	switch (action.type) {
		case ATs.SET_RUNTIME_VARIABLE:
			return action.payload.value;
		default:
			return state;
	}
}

function nav(state = initial.nav, action) {
	switch (action.type) {
		case ATs.CHANGE_TOGGLE_STATE :
			return Object.assign({}, state, {toggle: !state.toggle});
		case ATs.CHANGE_FIX_STATE :
			return Object.assign({}, state, {fixed: action.payload.state});
		case ATs.CHANGE_VISIBLE_STATE :
			return Object.assign({}, state, {visible: action.payload.state});
		default :
			return state;
	}
}

function index(state = initial.index, action) {
	switch (action.type) {
		case ATs.INDEX_NUM_INCREASE:
			return Object.assign({}, state, {num: state.num + 1});
		case ATs.INDEX_NUM_DECREASE:
			return Object.assign({}, state, {num: state.num - 1});
		default:
			return state;
	}
}

function about(state = initial.about, action) {
	switch (action.type) {
		case ATs.CHANGE_ABOUT_LANG:
			return action.payload;
		default:
			return state;
	}
}

function catalog(state = initial.catalog, action) {
	switch (action.type) {
		case ATs.CATALOG_TOGGLE:
			return Object.assign({}, state, {toggle: !state.toggle});
		case ATs.CHANGE_CATALOG_FIX_STATE:
			return Object.assign({}, state, {fixed: action.payload.state});
		default:
			return state;
	}
}

export default combineReducers({
	routing,
	runtime,
	nav,
	index,
	about,
	catalog,
});
