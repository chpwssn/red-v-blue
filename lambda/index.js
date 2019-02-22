// This function handles a IoT button and transfers the car based on the click type.
var request = require('request');

exports.handler = (event, context, callback) => {
    var flagMapping = {
        "G030JF0500155L38": "FLAG0",
        "G030JF053451EAP9": "FLAG1"
    }
    var apiEndpoint = '13.59.51.236';
    var options = {
        url: `http://${apiEndpoint}/v1/invoke/common/redvblue/scorePoint`,
        method: 'POST',
        json: [
            flagMapping[event.serialNumber],
            event.clickType === "SINGLE" ? "1" : "-1"
        ],
        headers: {
            'Authorization': 'Bearer REPLACEWITHYOURBEARERTOKEN'
        }
    };

    function callback(error, response, body) {
        console.log(body)
        if (!error && response.statusCode == 200) {
            // var info = JSON.parse(body);
            // info.data.map(car => {
            //     console.log(JSON.stringify(car))
            // })
        }
    }

    request(options, callback);
}