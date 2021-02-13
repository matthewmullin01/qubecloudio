const functionsBaseURL = 'https://us-central1-minecraft-63461.cloudfunctions.net';

export const environment = {
  production: true,
  firebase: {
    apiKey: 'AIzaSyDEIqGattV-AjD1qShNgctNw2j8jQclMu0',
    authDomain: 'minecraft-63461.firebaseapp.com',
    databaseURL: 'https://minecraft-63461.firebaseio.com',
    projectId: 'minecraft-63461',
    storageBucket: 'minecraft-63461.appspot.com',
    messagingSenderId: '962302234098',
    appId: '1:962302234098:web:a395503c11a2213ce3ef6b',
    measurementId: 'G-P0CFHWM402',
  },
  functions: {
    getStatusProxy: functionsBaseURL + '/getStatusProxy',
    getPropsProxy: functionsBaseURL + '/getPropsProxy',
    setPropsProxy: functionsBaseURL + '/setPropsProxy',
    getLogsProxy: functionsBaseURL + '/getLogsProxy',
    restartProxy: functionsBaseURL + '/restartProxy',
    getResourcesProxy: functionsBaseURL + '/getResourcesProxy',
    getResourcesNewestProxy: functionsBaseURL + '/getResourcesNewestProxy',
  },
};
