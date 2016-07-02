import ATs from '../constants/ActionTypes'


// Action Creators


export function changeToggleState() {
	return {
		type: ATs.CHANGE_TOGGLE_STATE,
	}
}

export function changeFixState(bool) {
	return {
		type: ATs.CHANGE_FIX_STATE,
		payload: {
			state: bool,
		},
	}
}

export function changeVisibleState(bool) {
	return {
		type: ATs.CHANGE_VISIBLE_STATE,
		payload: {
			state: bool,
		},
	}
}

export function setRuntimeVariable(value) {
	return {
		type: ATs.SET_RUNTIME_VARIABLE,
		payload: {
			value,
		},
	}
}

export function changeAboutLang(value) {
	return {
		type: ATs.CHANGE_ABOUT_LANG,
		payload: {
			lang: value,
		},
	}
}

export function indexNumIncrease() {
	return {
		type: ATs.INDEX_NUM_INCREASE,
	}
}

export function indexNumDecrease() {
	return {
		type: ATs.INDEX_NUM_DECREASE,
	}
}

export function catalogToggle() {
	return {
		type: ATs.CATALOG_TOGGLE,
	}
}

export function changeCatalogFixState(bool) {
	return {
		type: ATs.CHANGE_CATALOG_FIX_STATE,
		payload: {
			state: bool,
		}
	}
}


