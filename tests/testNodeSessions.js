var session = require('nodePhpSessions').SessionHandler;
var sessionHandler = new session();
var parsedUrl;

exports["testReadUndefinedSession"] = function(test){
	parsedUrl = { action: 'read', id: 'ts49vmf0p732iafr25mdu8gvg2' };
    test.equal(sessionHandler.run(parsedUrl), undefined);
    test.done();
};

exports["oneSessionShouldReturns1"] = function(test){
    parsedUrl = {
        action: 'write',
        id: 'ts49vmf0p732iafr25mdu8gvg2',
        data: 'gonzalo|i:1;arr|a:1:{s:3:"key";s:13:"4e2b1a40d136a";}',
        time: '1311447616',
        dataJSON: '{"gonzalo":1,"arr":{"key":"4e2b1a40d136a"}}' };
    sessionHandler.run(parsedUrl);

    parsedUrl = { action: 'readAsArray', id: 'ts49vmf0p732iafr25mdu8gvg2' };
    test.equal(sessionHandler.run(parsedUrl).gonzalo, 1);
    test.done();
};

exports["oneSessionShouldReturns2"] = function(test){
    parsedUrl = {
        action: 'write',
        id: 'ts49vmf0p732iafr25mdu8gvg2',
        data: 'gonzalo|i:2;arr|a:1:{s:3:"key";s:13:"4e2b1a40d136a";}',
        time: '1311447616',
        dataJSON: '{"gonzalo":2,"arr":{"key":"4e2b1a40d136a"}}' };
    sessionHandler.run(parsedUrl);
    parsedUrl = { action: 'readAsArray', id: 'ts49vmf0p732iafr25mdu8gvg2' };
    test.equal(sessionHandler.run(parsedUrl).gonzalo, 2);
    test.done();
};

exports["destroySession"] = function(test){
    parsedUrl = {
        action: 'destroy',
        id: 'ts49vmf0p732iafr25mdu8gvg2'};
    sessionHandler.run(parsedUrl);

    parsedUrl = { action: 'readAsArray', id: 'ts49vmf0p732iafr25mdu8gvg2' };
    test.equal(sessionHandler.run(parsedUrl), undefined);

	test.done();
};

exports["garbageColector"] = function(test){
    parsedUrl = {
        action: 'write',
        id: 'session1',
        data: 'gonzalo|i:1;arr|a:1:{s:3:"key";s:13:"4e2b1a40d136a";}',
        time: '1111111200',
        dataJSON: '{"gonzalo":1,"arr":{"key":"4e2b1a40d136a"}}' };
    sessionHandler.run(parsedUrl);

    parsedUrl = {
        action: 'write',
        id: 'session2',
        data: 'gonzalo|i:1;arr|a:1:{s:3:"key";s:13:"4e2b1a40d136a";}',
        time: '1111111100',
        dataJSON: '{"gonzalo":1,"arr":{"key":"4e2b1a40d136a"}}' };
    sessionHandler.run(parsedUrl);

    parsedUrl = { action: 'gc', maxlifetime: '100', time: '1111111210'};
    sessionHandler.run(parsedUrl);

    parsedUrl = { action: 'readAsArray', id: 'session2' };
    test.equal(sessionHandler.run(parsedUrl), undefined);

    parsedUrl = { action: 'readAsArray', id: 'session1' };
    test.equal(sessionHandler.run(parsedUrl).gonzalo, 1);

	test.done();
};


