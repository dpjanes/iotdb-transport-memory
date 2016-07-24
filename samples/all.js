/*
 *  all.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-07-24
 */

const transporter = require("../transporter");
const _ = require("iotdb")._;

const testers = require("./testers");

const transport = transporter.make();
testers.put(transport, { id: "ThingA" });
testers.put(transport, { id: "ThingB" });
testers.put(transport, { id: "ThingB", band: "istate" });
testers.put(transport, { id: "ThingB", band: "ostate" });
testers.all(transport);
