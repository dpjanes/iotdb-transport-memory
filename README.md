# iotdb-transport-memory
[IOTDB](https://github.com/dpjanes/node-iotdb) 
[Transporter](https://github.com/dpjanes/node-iotdb/blob/master/docs/transporters.md)
for in-memory 

<img src="https://raw.githubusercontent.com/dpjanes/iotdb-homestar/master/docs/HomeStar.png" align="right" />

# About

This Transporter works "in-memory" and probably is best used for testing 
more than anything practicle.

* [Read more about Transporters](https://github.com/dpjanes/node-iotdb/blob/master/docs/transporters.md)

# Use

See the samples folder for working examples

## Basic

Don't forget your `subscribe`s! Most Transporter methods 
return RX Observables.

    const memory_transport = require("iotdb-transport-memory");
    const memory_transporter = memory_transport.make();

    memory_transport.put({
        id: "light",
        band: "ostate",
        value: { on: true }
    }).subscribe()

## Bound

    const iotdb = require("iotdb");
    iotdb.use("homestar-wemo");

    const iotdb_transport = require("iotdb-transport-iotdb");
    const iotdb_transporter = iotdb_transport.make({}, iotdb.connect("WeMoSocket"));

    const memory_transport = require("iotdb-transport-memory");
    const memory_transporter = memory_transport.make();

    ## all changes to iotdb_transporter go to memory_transport
    memory_transporter.monitor(iotdb_transporter)

    ## all changes to memory_transport go to iotdb
    iotdb_transporter.monitor(memory_transporter)
