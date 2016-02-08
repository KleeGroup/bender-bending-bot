import Octokat from 'octokat';

const octo = new Octokat();

const focusCoreRepo = octo.repos('KleeGroup', 'focus-core');
const focusComponentsRepo = octo.repos('KleeGroup', 'focus-components');
const focusDemoApp = octo.repos('KleeGroup', 'focus-demo-app');
const focusFile = octo.repos('KleeGroup', 'focus-file');
const focusComments = octo.repos('KleeGroup', 'focus-comments');
const focusNotifications = octo.repos('KleeGroup', 'focus-notifications');

const sendVersion = response => repo => {
    repo.contents('package.json').read()
    .then(raw => JSON.parse(raw))
    .then(({name, version}) => {
        response.send(`*${name}:* ${version}`);
    });
}

module.exports = robot => {
    robot.respond(/versions/i, response => {
        [focusCoreRepo, focusComponentsRepo, focusDemoApp, focusFile, focusComments, focusNotifications].map(sendVersion(response));
    });
};
