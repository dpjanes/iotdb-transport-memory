/*
 *  send_list.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-07-24
 */

const transporter = require("../transporter");
const _ = require("iotdb")._;

const testers = require("./testers");

const transport = transporter.make();
testers.put(transport);
testers.bands(transport);
