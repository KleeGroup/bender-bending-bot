// Description:
//   Give Bender a soul !
//
// Dependencies:
//   <none>
//
// Author:
//   focus@kleegroup.com

import cleverbot from 'cleverbot.io';

const bot = new cleverbot(process.env.CLEVERBOT_API_USER, process.env.CLEVERBOT_API_KEY);

bot.setNick('bender');
bot.create((error, session) => {

});

module.exports = robot => {
    robot.respond(/(.+)/i, response => {
        if (response.match[1].match(/^(?!version|release|pug me|pug bomb|cat me|map me|mailchimp|ita|help|adapter|ship it|the rules|subscribe|unsubscribe|ping).+/i)) {
            bot.ask(response.match[1], (error, answer) => {
                response.send(answer);
            });
        }
    });
};
