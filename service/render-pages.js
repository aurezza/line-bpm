// 'use strict';
// var Translation = require('../service/Translation');

// var lineBotId = process.env.LINE_BOT_CHANNEL_ID;

// // setting default variables
// function RenderPage() {
//     if (!(this instanceof RenderPage)) return new RenderPage();
//     this.lineBotId = process.env.LINE_BOT_CHANNEL_ID;
// }

// RenderPage.prototype = {
//     successForm: successForm,
//     errorForm: errorForm,
//     fetchData: fetchData
// };

// function fetchData(data) {
//     var localeText = Translation().get('verify-content');

//     var renderData = {
//         error: data.error,
//         errors: data.errors,
//         token: data.token,
//         lineID: data.lineID,
//         csrfToken: data.csrfToken,
//         verified: data.verified,
//         customError: data.customError,
//         title: localeText.panelTitle,
//         panelTitle: localeText.label.panelTitle,
//         verifyButtonText: localeText.button.verify,
//         usernamePlaceholder: localeText.placeHolder.username,
//         passwordPlaceholder: localeText.placeHolder.password
//     }

//     return renderData;
// }

// function successForm() {
//     var localeText = Translation().get('success-message');
//     var successObject =  {
//         title: localeText.successTextTitle, 
//         description: localeText.successTextMessage,
//         successButtonText: localeText.closeWindow,
//         lineBotId: lineBotId
//     }

//     return successObject;
// }

// function errorForm(data) {
//     var errorObject =  {
//         message: data.message,
//         backButtonText: data.backButtonText,
//         lineBotId: lineBotId
//     }

//     return errorObject;
// }

// module.exports = RenderPage;