/* eslint-env phantomjs */
/* eslint-disable no-eval */

// this is a phantomjs script. NOT a node script.
var webpage     = require('webpage')
  , system      = require('system')
  , fs          = require('fs')
  , adapterPath = system.args[2]
  , destination = system.args[3]
  , storageObj  = system.args[4]
  , testAdapter = require(adapterPath)
  ;

var page = webpage.create()
  , js   = system.stdin.read()
  ;

page.onConsoleMessage = onConsoleMessage;
page.onError          = onError;
phantom.onError       = onError;

page.open(system.args[1], function(stat)
{
  if (stat != 'success')
  {
    system.stderr.write('Phantom cannot open requested html file: "' + system.args[1] + '"');
    phantom.exit(1);
    return;
  }

  // this function executes in a sandbox,
  // we pass it the target js as a string
  //
  // this format hides it from instrumentation
  // which doesn't work across environments
  page.evaluateAsync(new Function('c', 'eval(c)'), 0, js);
});

/**
 * Error handler
 *
 * @param   {string} msg - error message
 * @param   {object} trace - stack trace
 * @returns {void}
 */
function onError(msg, trace)
{
  var error = {message: msg, trace: trace};

  system.stderr.write(JSON.stringify(error));
  phantom.exit(1);
}

/**
 * Console message handler
 * - Passes messages to stdout
 * - Passes messages to testAdapter
 *
 * @param   {string} msg console message
 * @returns {void}
 */
function onConsoleMessage(msg)
{
  system.stdout.write(msg + '\n');

  // check if tests are done,
  // and submit coverage
  testAdapter(msg, saveCoverage);
}

/**
 * Writes coverage to disk
 *
 * @returns {void}
 */
function saveCoverage()
{
  // this format hides it from instrumentation
  // which doesn't work across environments
  var coverage = page.evaluate(new Function('coverageObj', 'return window[coverageObj];'), storageObj);

  if (coverage)
  {
    system.stdout.write('Writing coverage to ' + destination);
    fs.write(destination, JSON.stringify(coverage), 'w');
  }

  page.close();
}
