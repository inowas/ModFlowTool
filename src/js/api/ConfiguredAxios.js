import axios from 'axios';

axios.defaults.baseURL = 'http://dev.inowas.hydro.tu-dresden.de/api';

const ConfiguredAxios = axios;
export default ConfiguredAxios;
