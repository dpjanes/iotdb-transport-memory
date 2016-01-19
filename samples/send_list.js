/*
 *  send_list.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-01-18
 */

var Transport = require('../MemoryTransport').MemoryTransport;

/* --- write--- */
var write_transport = new Transport({});

var _update = function() {
    var now = (new Date()).toISOString();
    write_transport.update({
        id: "MyThingID", 
        band: "meta", 
        value: {
            first: "David",
            last: "Janes",
            now: now,
        },
    }, function(ud) {
        console.log("+ sent", ud);
    });
};

_update();

/* --- read --- */
var read_transport = new Transport({});

var received = function(ud) {
    if (ud.error) {
    } else if (ud.end) {
    } else if (ud.value === undefined) {
        read_transport.get(ud, function(gd) {
            console.log("+", "received.update+get", gd.id, gd.band, gd.value);
        });
    } else {
        console.log("+", "received.update", ud.id, ud.band, ud.value);
    }
}

read_transport.list({}, received);
