import {sendVersion, sendAllVersions} from '../utils/version';
import {repoSwitcher} from '../utils/repos';

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
            repoSwitcher(project, repo => {
                repo.git.refs.heads('develop').fetch()
                .then(({object: {sha}}) => {
                    repo.git.refs.create({
                        ref: `refs/heads/version-${version}`,
                        sha
                    })
                    .then(() => {
                        repo.contents('package.json').read()
                        .then(rawFile => {
                            const modifiedFile = rawFile.replace(/"version": (.*),/, `"version": "${version}",`);
                            repo.contents('package.json').fetch()
                            .then(({sha: fileSha}) => {
                                repo.contents('package.json').add({
                                    message: `[version] ${version}`,
                                    content: base64encode(modifiedFile),
                                    branch: `version-${version}`,
                                    sha: fileSha
                                })
                                .then(() => {
                                    giphy.random('excited')
                                    .then(({data: {image_url}}) => {
                                        repo.pulls.create({
                                            title: `[version] ${version}`,
                                            body: `![](${image_url})`,
                                            head: `version-${version}`,
                                            base: 'develop'
                                        })
                                        .then(({number}) => {
                                            repo.issues(number).update({assignee: users[response.envelope.user.name]})
                                            .catch(error => console.error(error));
                                        })
                                        .catch(error => console.error(error));
                                    })
                                    .catch(error => console.error(error));
                                })
                            })
                        })
                    })
                    .catch(error => {
                        response.send(`*Attention*, la branche *version-${version}* existe déjà ! Je ne vais pas tout péter, je m'arrête là.`);
                    });
                    response.send('Ok j\'ai tout compris, je vais faire la release quand je saurai la faire.');
                });
            }, () => {
                unknownProjectResponse(project, response);
            });
        }
    });
};
