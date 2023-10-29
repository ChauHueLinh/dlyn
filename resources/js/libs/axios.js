import axios from 'axios';
import queryString from 'query-string';

axios.defaults.validateStatus = (status) => status < 500;
const instance = axios.create({
    baseURL: 'common-api',
    timeout: 15000,
    headers: {
        'content-type': 'application/json'
    },
    paramsSerializer: params => queryString.stringify(params),
});

let refresh = false;
axios.interceptors.response.use(resp => resp, async error => {
    if (error.response.status === 401 && !refresh) {
        refresh = true;

        const response = await axios.post('refresh', {}, {withCredentials: true});

        if (response.status === 200) {

            return axios(error.config);
        }
    }
    refresh = false;
    return error;
});

// Add a response interceptor
instance.interceptors.response.use((response) => {
    return response;
}, (error) => {
    throw error;
});


export default instance;