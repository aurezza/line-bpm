var accessPassModel = require('../models/access-pass-model');
var logger = require('.././logger');
function retrieveAccessPass(lineId, token){
        // convert save code above to promise
		var accessPass = accessPassModel.findOne(
			{owner: lineId},
            {access_pass_token: "https://bot-dev.tmjp.jp/verify/da35778644a35082ee630dc17619a9e3e8f184003c18d6fa5804d89231871885/U69d42742a42fbb532dd02920351e776eaaa"},
            {status:"active"}
            
		);
		
		accessPass
		.exec(function(res, err){
            // logger.error("retrieveUsers error: ", err);
            console.log("res",res);
		});
		
    return accessPass;
}

module.exports = retrieveAccessPass;