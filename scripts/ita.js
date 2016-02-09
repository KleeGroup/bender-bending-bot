import {fetchUrl} from 'fetch';
import 'babel-polyfill';

const getRandomItaPost = response => {
    fetchUrl('http://imposetonanonymat.tumblr.com/random', (error, meta, body) => {
        const bodyString = body.toString();
        const matches = bodyString.match(/(?=\<img src=")\<img src="(.*?)(?=")/g);
        const imageUrl = matches[1].replace('<img src="', '');
        response.send(imageUrl);
    });
}

module.exports = robot => {
    robot.respond(/ita/i, response => {
        const picture = getRandomItaPost(response);
    });
};
