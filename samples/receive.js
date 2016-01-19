/*
 *  receive.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-01-18
 *
 *  Demonstrate receiving
 *  Make sure to see README first
 */

var Transport = require('../MemoryTransport').MemoryTransport;

var transport = new Transport({
});

var received = function(ud) {
    if (ud.value === undefined) {
        transport.get(ud, function(gd) {
            console.log("+", gd.id, gd.band, gd.value);
        });
    } else {
        console.log("+", ud.id, ud.band, ud.value);
    }
}

transport.get({
    id: "MyThingID", 
    band: "meta", 
}, received);
transport.updated({
    id: "MyThingID", 
    band: "meta", 
}, received);
