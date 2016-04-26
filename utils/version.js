import {repoSwitcher, focusCore, focusComponents, focusComments, focusNotifications, focusFile, focusDemoApp, focusDocs, focusRedux} from './repos';

export const sendVersion = response => repo => {
    repo.contents('package.json').read()
    .then(raw => JSON.parse(raw))
    .then(({name, version}) => {
        response.send(`*${name}:* ${version}`);
    });
}

export const sendAllVersions = response => {
    [focusCore, focusComponents, focusDemoApp, focusFile, focusComments, focusNotifications, focusDocs, focusRedux].map(sendVersion(response));
}
