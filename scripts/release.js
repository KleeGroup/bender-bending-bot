import {sendVersion, sendAllVersions} from '../utils/version';
import {repoSwitcher} from '../utils/repos';
import 'babel-polyfill';

const giphy = require('giphy-api')('dc6zaTOxFJmzC');

const users = {
    'stan': 'Bernardstanislas',
    'pierr': 'pierr',
    'tom': 'Tommass'
}

const unknownProjectResponse = (project, response) => {
    response.send(`Je ne connais pas le projet *${project}*. Voilà la liste des projets que je connais :`);
    sendAllVersions(response);
}

const base64encode = string => {
    const buffer = new Buffer(string, 'binary');
    return buffer.toString('base64');
}

module.exports = robot => {
    robot.respond(/release ?([a-z-]*) ?(.*)/i, response => {
        const [project, version] = [response.match[1], response.match[2]];
        if (!project) {
            response.send('Tu ne m\'as pas dit quel projet releaser ! Voilà la liste des projets que je connais :');
            sendAllVersions.call(this, response);
        } else if (!version) {
            repoSwitcher(project, repo => {
                response.send(`Tu ne m'as pas donné de version à releaser, voilà la dernière version de *${project}*:`);
                sendVersion(response)(repo);
            }, () => {
                unknownProjectResponse(project, response);
            });
        } else {
            repoSwitcher(project, async repo => {
                try {
                    const {object: {sha}} = await repo.git.refs.heads('develop').fetch()
                    await repo.git.refs.create({
                        ref: `refs/heads/version-${version}`,
                        sha
                    });
                    const rawFile = await repo.contents('package.json').read();
                    const modifiedFile = rawFile.replace(/"version": (.*),/, `"version": "${version}",`);
                    const {sha: fileSha} = await repo.contents('package.json').fetch();
                    await repo.contents('package.json').add({
                        message: `[version] ${version}`,
                        content: base64encode(modifiedFile),
                        branch: `version-${version}`,
                        sha: fileSha
                    });
                    const {data: {image_url}} = await giphy.random('excited');
                    const {number} = await repo.pulls.create({
                        title: `[version] ${version}`,
                        body: `![](${image_url})`,
                        head: `version-${version}`,
                        base: 'develop'
                    });
                    await repo.issues(number).update({assignee: users[response.envelope.user.name]});
                    response.send('*Ok* la release est lancée, je te notifierai quand la pull request aura buildé.');
                } catch (error) {
                    response.send(`*Attention*, une erreur s'est produite ! Je ne vais pas tout péter, je m'arrête là.`);
                    response.send(`> ${error.toString()}`);
                }
            }, () => {
                unknownProjectResponse(project, response);
            });
        }
    });
};
