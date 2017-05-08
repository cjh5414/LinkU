let DEFAULT_REQUEST_URL = "";

const LOCAL_REQUEST_URL = "http://localhost:8000";
const DEPLOY_REQUEST_URL = "/api";

if (process.env.REACT_APP_LINKU_SERVER_ENVIRONMENT=== 'local')
    DEFAULT_REQUEST_URL = LOCAL_REQUEST_URL;
else
    DEFAULT_REQUEST_URL = DEPLOY_REQUEST_URL;

export {DEFAULT_REQUEST_URL};
