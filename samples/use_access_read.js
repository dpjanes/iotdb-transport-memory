/*
 *  use_access_read.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-08-19
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

// the underlying transport
const memory_transport = require("../transporter")
const memory_transporter = memory_transport.make();

testers.put(memory_transporter, { id: "ThingA" });
testers.put(memory_transporter, { id: "ThingB" });
testers.put(memory_transporter, { id: "ThingB", band: "istate" });
testers.put(memory_transporter, { id: "ThingB", band: "ostate" });

// the access wrapper
const access_transport = require("../../iotdb-transport/").access;
const access_transporter = access_transport.make({
    check_read: d => {
        if (d.id === "ThingB") {
            return new Error("access denied");
        }
    }
}, memory_transporter);
// access_transporter.use(memory_transporter)

testers.list(access_transporter);                   // this will not see ThingB
testers.get(access_transporter, { id: "ThingA" })
testers.get(access_transporter, { id: "ThingB" })   // this will fail
testers.get(memory_transporter, { id: "ThingB" })
