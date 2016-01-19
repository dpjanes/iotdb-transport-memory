/*
 *  list.js
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
transport.list(function(ld) {
    if (!ld) {
        break;
    }

    console.log("+", ld.id);
});
