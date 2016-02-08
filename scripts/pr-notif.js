import {repoSwitcher} from '../utils/repos';

const users = {
    'Bernardstanislas': 'stan',
    'pierr': 'pierr',
    'Tommass': 'tom'
}

module.exports = robot => {
    robot.on('github-repo-event', event => {
        if (event.eventType === 'status') {
            const status = event.payload;
            let repo = null;
            repoSwitcher(status.name.replace('KleeGroup/', ''), candidate => {repo = candidate;}, () => (null));
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
                        robot.send({room: user}, `${user} ! ${url} a buildé et attend que tu la merge ! Merci :sunglasses:`);
                    }
                });
            }
        }
    });
};
