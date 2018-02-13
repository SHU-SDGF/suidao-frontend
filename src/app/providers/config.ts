interface config{
    apiBase: string,
    siteBase: string
};
const AppConfigs = {
    development: {
        siteBase: 'http://114.55.55.37:8083',
		apiBase: 'http://114.55.55.37:8083/tunnel-service'
	},
    production: {
        siteBase: 'http://114.55.55.37:8083',
		apiBase: 'http://114.55.55.37:8083/tunnel-service'
    }
};

const ENV = 'development';
var _appConfig: config = AppConfigs[ENV];
export const AppConfig = _appConfig;