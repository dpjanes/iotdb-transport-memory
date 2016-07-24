/*
 *  transporter.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-07-22
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

const iotdb = require('iotdb');
const _ = iotdb._;
const iotdb_transport = require('iotdb-transport');
const errors = require('iotdb-errors');

const Rx = require('rx');
const events = require('events');

const util = require('util');
const url = require('url');

const logger = iotdb.logger({
    name: 'iotdb-transport-memory',
    module: 'transporter',
});

const global_bddd = {};

const _subject = new Rx.Subject();

const make = (initd, bddd) => {
    const self = iotdb_transport.make();

    const _initd = _.d.compose.shallow(
        initd, {
            channel: iotdb_transport.channel,
            unchannel: iotdb_transport.unchannel,
            encode: s => s.replace(/[\/$%#.\]\[]/g, c => '%' + c.charCodeAt(0).toString(16)),
            decode: decodeURIComponent,
            pack: d => _.d.transform(d, { pre: _.ld_compact, key: _encode, }),
            unpack: d => _.d.transform(d, { pre: _.ld_compact, key: _decode, }),
        },
        iotdb.keystore().get("/transports/MemoryTransport/initd"), {
            prefix: ""
        }
    );

    const _bddd = bddd || global_bddd;

    self.rx.list = (observer, d) => {
        _.keys(_bddd)
            .sort()
            .forEach(id => {
                d = _.d.clone.shallow(d);
                d.id = id;

                observer.onNext(d);
            });

        observer.onCompleted();
    };

    self.rx.put = (observer, d) => {
        let bdd = _bddd[d.id];
        if (_.is.Undefined(bdd)) {
            bdd = {};
            _bddd[d.id] = bdd;
        }

        bdd[d.band] = d.value;

        observer.onNext(d);
        observer.onCompleted();

        _subject.onNext(d);
    };
    
    self.rx.bands = (observer, d) => {
        let bdd = _bddd[d.id];
        
        _.keys(bdd || {})
            .sort()
            .forEach(band => {
                d = _.d.clone.shallow(d);
                d.band = band;

                observer.onNext(d);
            });

        observer.onCompleted();
    };

    self.rx.updated = (observer, paramd) => {
        _subject
            .filter(d => !paramd.id || paramd.id === d.id)
            .filter(d => !paramd.band || paramd.id === d.band)
            .subscribe(
                d => observer.onNext(d),
                error => observer.onError(error),
                () => observer.onCompleted()
            );
    };


    return self;
};

/**
 *  API
 */
exports.make = make;
