import {browserHistory, createMemoryHistory} from 'react-router';

const location = process.env.BROWSER ? browserHistory : createMemoryHistory();

export default location;
