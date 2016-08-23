interface config{
    apiBase: string
};
const AppConfigs = {
	'development': {
		apiBase: 'http://114.55.55.37:3001/api'
	},
    'production': {
        apiBase: 'http://114.215.196.178:8080/beehive-portal/api'
    }
};

const ENV = 'development';
var _appConfig: config = AppConfigs[ENV];



export const AppConfig = _appConfig;