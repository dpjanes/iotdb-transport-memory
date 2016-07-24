/*
 *  testers.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-07-24
 */

const log = what => [
    ld => console.log("+", what, ld.id),
    error => console.log("#", what, _.error.message(error)),
    () => console.log("+", what, "<end>")
];

const put = transport => {
    const now = (new Date()).toISOString();
    const source = transport.put({
        id: "MyThingID", 
        band: "meta", 
        value: {
            first: "David",
            last: "Janes",
            now: now,
        },
    });

    source.subscribe(...log("put"));
}

const list = transport => {
    const source = transport.list()
    source.subscribe(...log("list"));
};

/*
 *  API
 */
exports.log = log;
exports.put = put;
exports.list = list;
