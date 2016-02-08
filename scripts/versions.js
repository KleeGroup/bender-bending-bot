// Description:
//   Automaticaly release Focus projects
//
// Dependencies:
//   <none>
//
// Commands:
//   hubot versions : list all Focus projects versions
//   hubot version <project> : give the provided project version
//
// Author:
//   focus@kleegroup.com

import {sendVersion, sendAllVersions} from '../utils/version';
import {repoSwitcher} from '../utils/repos';

module.exports = robot => {
    robot.respond(/versions? ?(.*)/i, response => {
        const repo = response.match[1];
        repoSwitcher(repo, sendVersion(response), () => sendAllVersions(response));
    });
};
