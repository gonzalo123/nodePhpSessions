/*!
 * nodePhpSessions
 * Copyright(c) 2011 Gonzalo Ayuso <gonzalo123@gmail.com>
 * MIT Licensed
 */

var SessionHandler  = function() {
    var sessions = {},
        sessionsTimestamps = {},
        sessionsData = {};

    this.read = function(id) {
        return sessions[id];
    }

    this.readAsArray = function(id) {
        return sessionsData[id];
    }

    this.write = function(id, data, time, dataJSON) {
        sessions[id] = data;
        sessionsTimestamps[id] = time;
        sessionsData[id] = eval("(" + dataJSON + ")");
    }

    this.destroy = function(id) {
        delete sessions[id];
        delete sessionsTimestamps[id];
        delete sessionsData[id];
    }

    this.gc = function(maxlifetime, time) {
        var sessisonKey;
        for (sessisonKey in sessionsTimestamps) {
            if (parseInt(sessionsTimestamps[sessisonKey]) + parseInt(maxlifetime) < parseInt(time)) {
                this.destroy(sessisonKey);
            }
        }
    }

    this.run = function(parsedUrl) {
        var out;
        var action = parsedUrl.action;
        var id     = parsedUrl.id;

        switch (action) {
            case 'read':
                out = this.read(id);
                break;
            case 'readAsArray':
                out = this.readAsArray(id);
                break;
            case 'write':
                var time      = parsedUrl.time;
                var data      = parsedUrl.data;
                var dataJSON  = parsedUrl.dataJSON;
                this.write(id, data, time, dataJSON);
                break;
            case 'destroy':
                this.destroy(id);
                break;
            case 'gc':
                var maxlifetime  = parsedUrl.maxlifetime;
                var time         = parsedUrl.time;
                this.gc(maxlifetime, time);
                break;
        }
        return out;
    }
}

exports.SessionHandler = SessionHandler;