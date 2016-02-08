import Octokat from 'octokat';

const octo = new Octokat();

const focusCoreRepo = octo.repos('KleeGroup', 'focus-core');
const focusComponentsRepo = octo.repos('KleeGroup', 'focus-components');
const focusDemoApp = octo.repos('KleeGroup', 'focus-demo-app');
const focusFile = octo.repos('KleeGroup', 'focus-file');
const focusComments = octo.repos('KleeGroup', 'focus-comments');
const focusNotifications = octo.repos('KleeGroup', 'focus-notifications');

module.exports = robot => {
    robot.respond(/versions/i, response => {
        focusCoreRepo.contents('package.json').fetch()
        .then(function({content}) {
            const parsedContent = JSON.parse(content);
            response.send(`Focus Core : ${parsedContent.version}`);
        });
    });
};
