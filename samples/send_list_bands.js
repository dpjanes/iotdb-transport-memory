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
    }, function(error, pd) {
        if (error) {
            console.log("#", error);
            return;
        }

        console.log("+ sent", pd);
    });
};

_update();

/* --- read --- */
var read_transport = new Transport({});

var received = function(error, ld) {
    if (error) {
        console.log("#", "error", error);
        return;
    }
    if (!ld) {
        console.log("+", "<end>");
        break;
    }

    console.log("+", "received.update", ld.id);

    read_transport.bands(ld, function(error, ad) {
        if (error) {
            console.log("#", "received.bands", error);
            return;
        }

        console.log("+", "received.bands", ad.id, ad.bandd);
    });
}

read_transport.list({}, received);
