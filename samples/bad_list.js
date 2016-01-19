/*
 *  bad_list.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-01-18
 *
 *  Deal with data that does not exist
 *  Expect to see just 'null'
 */

var Transport = require('../MemoryTransport').MemoryTransport;

var transport = new Transport({
});
transport.list(function(ld) {
    if (!ld) {
        break;
    }

    console.log("+", ld.id);
});
