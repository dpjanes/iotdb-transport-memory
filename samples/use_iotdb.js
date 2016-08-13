/*
 *  transporter.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-08-05
 *
 *  Copyright [2013-2016] [David P. Janes]
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict";

const testers = require("iotdb-transport").testers;

const iotdb = require("iotdb");
iotdb.use("homestar-wemo");

// our source
const iotdb_transporter = require("../../iotdb-transport-iotdb/transporter");
const iotdb_transport = iotdb_transporter.make({}, iotdb.connect("WeMoSocket"));
iotdb_transport
    .updated({})
    .subscribe(...testers.log_value("iotdb_transport.updated"));

// our passive destination
const memory_transporter = require("../transporter")
const memory_1_transport = memory_transporter.make();
memory_1_transport
    .updated({})
    .subscribe(...testers.log_value("memory_1.updated"));

// our active desstination - all changes to iotdb will reflect into this and visaversa
const memory_2_transport = memory_transporter.make();
memory_2_transport.monitor(iotdb_transport)
iotdb_transport.monitor(memory_2_transport)
