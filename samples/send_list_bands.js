/*
 *  send_list_bands.js
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
    write_transport.put({
        id: "MyThingID", 
        band: "meta", 
        value: {
            first: "David",
            last: "Janes",
            now: now,
        },
    }, function(error, ud) {
        if (error) {
            console.log("#", error);
            return;
        }

        console.log("+ sent", ud);
    });
};

_update();

/* --- read --- */
var read_transport = new Transport({});

var received = function(ud) {
    if (ud.error) {
        console.log("#", "received.error", _.error.message(ud.error));
    } else if (ud.end) {
        console.log("+", "received.end");
    } else {
        console.log("+", "received.update", ud.id);

        read_transport.bands(ud, function(error, ad) {
            if (error) {
                console.log("#", "received.bands", error);
                return;
            }

            console.log("+", "received.bands", ad.id, ad.bandd);
        });
    }
}

read_transport.list({}, received);
