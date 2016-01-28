/*
 *  MemoryTransport.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-01-18
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

var iotdb = require('iotdb');
var iotdb_transport = require('iotdb-transport');
var _ = iotdb._;

var path = require('path');
var events = require('events');

var util = require('util');
var url = require('url');

var logger = iotdb.logger({
    name: 'iotdb-transport-memory',
    module: 'MemoryTransport',
});

var global = {};

var global_emitter = new events.EventEmitter();
global_emitter.setMaxListeners(0);

/* --- constructor --- */

/**
 *  Create a transport for Memory.
 */
var MemoryTransport = function (initd, bddd) {
    var self = this;

    self.initd = _.defaults(
        initd,
        {
            channel: iotdb_transport.channel,
            unchannel: iotdb_transport.unchannel,
            encode: _encode,
            decode: _decode,
            pack: _pack,
            unpack: _unpack,
        },
        iotdb.keystore().get("/transports/MemoryTransport/initd"),
        {
            prefix: ""
        }
    );
    
    self.bddd = bddd || global;
};

MemoryTransport.prototype = new iotdb_transport.Transport;
MemoryTransport.prototype._class = "MemoryTransport";

/* --- methods --- */

/**
 *  See {iotdb_transport.Transport#Transport} for documentation.
 */
MemoryTransport.prototype.list = function(paramd, callback) {
    var self = this;

    if (arguments.length === 1) {
        paramd = {};
        callback = arguments[0];
    }

    self._validate_list(paramd, callback);

    var keys = _.keys(self.bddd);
    keys.sort();

    keys.map(function(key) {
        callback({
            id: key,
        });
    });

    callback({
        end: true,
    });
};

/**
 *  See {iotdb_transport.Transport#Transport} for documentation.
 */
MemoryTransport.prototype.added = function(paramd, callback) {
    var self = this;

    if (arguments.length === 1) {
        paramd = {};
        callback = arguments[0];
    }

    self._validate_added(paramd, callback);

    var channel = self.initd.channel(self.initd, paramd.id);
};

/**
 *  See {iotdb_transport.Transport#Transport} for documentation.
 */
MemoryTransport.prototype.get = function(paramd, callback) {
    var self = this;

    self._validate_get(paramd, callback);

    paramd = _.shallowCopy(paramd);

    var bdd = self.bddd[paramd.id];
    if (bdd === undefined) {
        paramd.value = null;
        return callback(paramd);
    }

    var bd = bdd[paramd.band];
    if (bd === undefined) {
        paramd.value = null;
        return callback(paramd);
    }

    paramd.value = bd;
    callback(paramd);
};

/**
 *  See {iotdb_transport.Transport#Transport} for documentation.
 */
MemoryTransport.prototype.about = function(paramd, callback) {
    var self = this;

    self._validate_about(paramd, callback);

    paramd = _.shallowCopy(paramd);

    var bdd = self.bddd[paramd.id];
    if (bdd === undefined) {
        paramd.error = new Error("not found");
        paramd.value = null;
        return callback(paramd);
    }

    var keys = _.keys(bdd);
    keys.sort();

    paramd.bands = keys;
    callback(paramd);
};

/**
 *  See {iotdb_transport.Transport#Transport} for documentation.
 */
MemoryTransport.prototype.put = function(paramd, callback) {
    var self = this;

    self._validate_update(paramd, callback);

    paramd = _.shallowCopy(paramd);

    var bdd = self.bddd[paramd.id];
    if (bdd === undefined) {
        bdd = {};
        self.bddd[paramd.id] = bdd;
    }

    bdd[paramd.band] = paramd.value;

    callback(paramd);

    global_emitter.emit("updated", self.bddd, paramd);
};

/**
 *  See {iotdb_transport.Transport#Transport} for documentation.
 */
MemoryTransport.prototype.updated = function(paramd, callback) {
    var self = this;

    if (arguments.length === 1) {
        paramd = {};
        callback = arguments[0];
    }

    self._validate_updated(paramd, callback);

    global_emitter.on("updated", function(bddd, ud) {
        if (paramd.id && (paramd.id !== ud.id)) {
            return;
        }

        if (paramd.band && (paramd.band !== ud.band)) {
            return;
        }

        callback(ud);
    });
};

/**
 *  See {iotdb_transport.Transport#Transport} for documentation.
 */
MemoryTransport.prototype.remove = function(paramd, callback) {
    var self = this;

    self._validate_remove(paramd, callback);

    var channel = self.initd.channel(self.intid, paramd.id, paramd.band);
};

/* --- internals --- */
var _encode = function(s) {
    return s.replace(/[\/$%#.\]\[]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16);
    });
};

var _decode = function(s) {
    return decodeURIComponent(s);
}

var _unpack = function(d) {
    return _.d.transform(d, {
        pre: _.ld_compact,
        key: _decode,
    });
};

var _pack = function(d) {
    return _.d.transform(d, {
        pre: _.ld_compact,
        key: _encode,
    });
};

/**
 *  API
 */
exports.MemoryTransport = MemoryTransport;
