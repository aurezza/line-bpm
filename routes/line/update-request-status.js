var updateRequest = require('.././update-request');
function updateRequestStatus(params){
    updateRequest(params)
    console.log("params",params);
}
module.exports = updateRequestStatus;