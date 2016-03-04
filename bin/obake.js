#!/usr/bin/env node

var obake    = require('../');
var ghostcli = require('ghostface/lib/cli');

// start phantomjs via ghostface
ghostcli(obake.getArgv(), obake.onCli);
