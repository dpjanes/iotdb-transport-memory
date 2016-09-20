/*
 *  put_remove.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-09-20
 */

const transporter = require("../transporter");
const _ = require("iotdb")._;

const testers = require("iotdb-transport").testers;

const transport = transporter.make();
testers.put(transport);
testers.remove(transport);
testers.get(transport);
