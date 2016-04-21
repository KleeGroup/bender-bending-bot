import Octokat from 'octokat';

const octo = new Octokat({
    token: process.env.GITHUB_BENDER_TOKEN
});

export const focusCore = octo.repos('KleeGroup', 'focus-core');
export const focusComponents = octo.repos('KleeGroup', 'focus-components');
export const focusDemoApp = octo.repos('KleeGroup', 'focus-demo-app');
export const focusFile = octo.repos('KleeGroup', 'focus-file');
export const focusComments = octo.repos('KleeGroup', 'focus-comments');
export const focusNotifications = octo.repos('KleeGroup', 'focus-notifications');
export const focusDocs = octo.repos('Kleegroup', 'focus-docs');
export const focusRedux = octo.repos('get-focus', 'focus-redux');


export const repoSwitcher = (query, repoCallback, defaultCallback) => {
    switch (query) {
        case 'focus-core':
            repoCallback(focusCore);
            break;
        case 'focus-components':
            repoCallback(focusComponents);
            break;
        case 'focus-demo':
            repoCallback(focusDemoApp);
            break;
        case 'focus-file':
            repoCallback(focusFile);
            break;
        case 'focus-comments':
            repoCallback(focusComments);
            break;
        case 'focus-notifications':
            repoCallback(focusNotifications);
            break;
        case 'focus-redux':
            repoCallback(focusRedux);
            break;
        case 'focus-docs':
            repoCallback(focusDocs);
            break;
        default:
            defaultCallback();
            break;
    }
}
