/*
 *  send.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-01-18
 *
 *  Demonstrate sending something
 *  Make sure to see README first
 */

var Transport = require('../MemoryTransport').MemoryTransport;

var transport = new Transport({
});

var _update = function() {
    var now = (new Date()).toISOString();
    console.log("+ sent update", now);
    transport.update({
        id: "MyThingID", 
        band: "meta", 
        value: {
            first: "David",
            last: "Janes",
            now: now,
        },
    });
};

setInterval(_update, 10 * 1000);
_update();
