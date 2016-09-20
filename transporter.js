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
const subjectd = new Map();

const make = (initd, bddd) => {
    const self = iotdb_transport.make();
    self.name = "iotdb-transport-memory";

    const _initd = _.d.compose.shallow(
        initd, 
        iotdb.keystore().get("/transports/iotdb-transport-memory/initd"), {}
    );

    const _bddd = bddd || global_bddd;
    let _subject = subjectd.get(_bddd);
    if (!_subject) {
        subjectd.set(_bddd, _subject = new Rx.Subject());
    }

    self.rx.list = (observer, d) => {
        _.keys(_bddd)
            .sort()
            .forEach(id => {
                const rd = _.d.clone.shallow(d);
                rd.id = id;

                observer.onNext(rd);
            });

        observer.onCompleted();
    };

    self.rx.put = (observer, d) => {
        const rd = _.d.clone.shallow(d);
        rd.value = _.timestamp.add(rd.value);

        let bdd = _bddd[d.id];
        if (_.is.Undefined(bdd)) {
            bdd = {};
            _bddd[d.id] = bdd;
        }

        let bd = bdd[d.band];
        if (_.is.Undefined(bd)) {
            bd = {};
        }
        
        if (!_.timestamp.check.dictionary(bd, rd.value)) {
            return observer.onError(new errors.Timestamp());
        }

        bdd[d.band] = rd.value;

        observer.onNext(rd);
        observer.onCompleted();

        _subject.onNext(d);
    };
    
    self.rx.get = (observer, d) => {
        const bdd = _bddd[d.id];
        if (_.is.Undefined(bdd)) {
            return observer.onError(new errors.NotFound());
        }

        const bd = bdd[d.band];
        if (_.is.Undefined(bd)) {
            return observer.onError(new errors.NotFound());
        }

        const rd = _.d.clone.shallow(d);
        rd.value = bd;

        observer.onNext(rd);
        observer.onCompleted();
    };
    
    self.rx.bands = (observer, d) => {
        const bdd = _bddd[d.id];
        if (!bdd) {
            return observer.onError(new errors.NotFound());
        }

        _.keys(bdd)
            .sort()
            .forEach(band => {
                const rd = _.d.clone.shallow(d);
                rd.band = band;

                observer.onNext(rd);
            });

        observer.onCompleted();
    };

    self.rx.updated = (observer, d) => {
        _subject
            .filter(ud => !d.id || d.id === ud.id)
            .filter(ud => !d.band || d.id === ud.band)
            .map(ud => _.d.compose.shallow(d, ud))
            .subscribe(
                d => observer.onNext(d),
                error => observer.onError(error),
                () => observer.onCompleted()
            );
    };

    self.rx.remove = (observer, d) => {
        const bdd = _bddd[d.id];
        if (!bdd) {
            return observer.onError(new errors.NotFound());
        }

        delete _bddd[d.id];
        observer.onCompleted()
    };

    return self;
};

/**
 *  API
 */
exports.make = make;
