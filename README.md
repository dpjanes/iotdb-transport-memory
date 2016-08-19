# iotdb-transport-prototype
IOTDB in-memory Transporter 

<img src="https://raw.githubusercontent.com/dpjanes/iotdb-homestar/master/docs/HomeStar.png" align="right" />

# Introduction

Read about Transporters [here](https://github.com/dpjanes/iotdb-transport).
This Transporter works "in-memory" and probably is best used for testing 
more than anything practicle.

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
