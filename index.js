var path         = require('path');
var childProcess = require('child_process');
var envar        = require('envar');
// name of the storage object for the coverage data
var coverage     = '__coverage__';

envar.defaults({
  dir        : 'coverage', // directory where to place coverage file
  file       : 'coverage-phantomjs.json', // filename where to write coverage
  adapter    : 'tap', // name or path of the test adapter
  phantomjs  : path.join(__dirname, 'lib', 'phantom.js'), // phantomjs run script
  phantomPath: null
});

// exports all the things
var obake = module.exports = {
  onCli      : onCli,
  onExit     : onExit,
  getArgv    : getArgv,
  getGhost   : getGhost,
  ghostface  : getGhost(path.resolve(__dirname, envar('phantomjs'))),
  destination: path.resolve(process.cwd(), envar('dir'), envar('file')),
  adapterPath: path.resolve(__dirname, 'adapters', envar('adapter'))
};

/**
 * Gets list of cli arguments
 * augments them for world peace
 *
 * @returns {array} list of arguments
 */
function getArgv()
{
  // get original list
  var argv        = process.argv.slice(2)
    , phantomPath = envar('phantomPath')
    ;

  // guesswork if `phantomPath` is not provided
  if (!phantomPath)
  {
    // check for `phantomjs-prebuilt` first
    try
    {
      phantomPath = require('phantomjs-prebuilt').path;
    }
    catch(e){}
  }

  // simulate provided custom phantomjs path, if found
  if (phantomPath)
  {
    argv.push('--phantomPath', phantomPath);
  }

  return argv;
}

/**
 * Augments ghostface's phantomjs spawn to use custom phantomjs run script
 *
 * @param   {string} customScript - filepath of the phantomjs script
 * @returns {function} - ghostface instance
 */
function getGhost(customScript)
{
  var mod, originalSpawn = childProcess.spawn;

  childProcess.spawn = function(cmd, args)
  {
    args[0] = customScript;
    // get coverage object custom name
    coverage = envar('coverage') === true ? coverage : envar('coverage');

    // add custom arguments
    args.push(
      obake.adapterPath,
      obake.destination
    );

    // pass coverage object name
    if (coverage)
    {
      args.push(coverage);
    }

    return originalSpawn.call(childProcess, cmd, args);
  };

  // run ghostface
  mod = require('ghostface');

  // restore spawn
  childProcess.spawn = originalSpawn;

  return mod;
}

/**
 * Handles CLI processing
 *
 * @param   {array|null} err - list of occurred errors
 * @param   {string} message - message received from the child process
 * @param   {object} options - phantomjs instance options
 * @returns {void}
 */
function onCli(err, message, options)
{
  if (err)
  {
    console.error('\nYou had errors in your syntax. Use --help for further information.');

    err.forEach(function(e)
    {
      console.error(e.message);
    });

    return;
  }

  if (message)
  {
    console.log(message);
    return;
  }

  // run ghostface
  obake.ghostface(options, process, obake.onExit);
}

/**
 * Handles exit codes
 *
 * @param   {number} code - process termination code
 * @param   {string} signal - received signal type
 * @returns {void}
 */
function onExit(code, signal)
{
  if (code > 0)
  {
    console.error('\nphantomjs exited abnormally: %d with signal <%s>', code, signal);
  }

  process.exit(code || (signal == 'SIGTERM' ? 0 : 1));
}
