import Octokat from 'octokat';

const octo = new Octokat();
const users = {
    'Bernardstanislas': 'stan',
    'pierr': 'pierr',
    'Tommass': 'tom'
}

const focusCoreRepo = octo.repos('KleeGroup', 'focus-core');
const focusComponentsRepo = octo.repos('KleeGroup', 'focus-components');
const focusDemoApp = octo.repos('KleeGroup', 'focus-demo-app');
const focusFile = octo.repos('KleeGroup', 'focus-file');
const focusComments = octo.repos('KleeGroup', 'focus-comments');
const focusNotifications = octo.repos('KleeGroup', 'focus-notifications');

module.exports = robot => {
    robot.on('github-repo-event', event => {
        if (event.eventType === 'status') {
            const status = event.payload;
            let repo = null;
            switch (status.name) {
                case 'KleeGroup/focus-core':
                    repo = focusCoreRepo;
                    break;
                case 'KleeGroup/focus-components':
                    repo = focusComponentsRepo;
                    break;
                case 'KleeGroup/focus-demo-app':
                    repo = focusDemoApp;
                    break;
                case 'KleeGroup/focus-file':
                    repo = focusFile;
                    break;
                case 'KleeGroup/focus-comments':
                    repo = focusComments;
                    break;
                case 'KleeGroup/focus-notifications':
                    repo = focusNotifications;
                    break;
            }
            if (repo !== null) {
                repo.pulls.fetch({state: 'open'}).then(pulls => {
                    let user = null;
                    const url = pulls.reduce((acc, pull) => {
                        if (pull.head.sha === status.sha && pull.assignee) {
                            user = users[pull.assignee.login];
                            acc = pull.htmlUrl;
                        }
                        return acc;
                    }, null);
                    if (user !== undefined && status.state === 'success') {
                        robot.send({room: user}, `La pull request ${url} a buildé et tu es assigné en reviewer.`);
                    }
                });
            }
        }
    });
};
