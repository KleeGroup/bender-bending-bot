import {sendVersion, sendAllVersions} from '../utils/version';
import {repoSwitcher} from '../utils/repos';

module.exports = robot => {
    robot.respond(/versions? ?(.*)/i, response => {
        const repo = response.match[1];
        repoSwitcher(repo, sendVersion(response), () => sendAllVersions(response));
    });
};
