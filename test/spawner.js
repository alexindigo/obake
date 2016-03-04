var spawn  = require('cross-spawn');
var concat = require('concat-stream');
var eos    = require('end-of-stream');

// Public API
module.exports = spawner;

/**
 * Runs provided command and returns stdout for piping
 *
 * @param   {object} [acc] - accumulator object
 * @param   {array} cmds - list of command objects
 * @param   {function} callback - callback function to be invoked after all processes finished
 * @returns {void}
 */
function spawner(acc, cmds, callback)
{
  var cmd;

  if (Array.isArray(acc))
  {
    callback = cmds;
    cmds     = acc;
    acc      = {};
  }

  cmd = cmds.shift();

  if (!cmd)
  {
    callback(null, acc);
    return;
  }

  // should it be piped
  if (Array.isArray(cmd))
  {
    pipe(cmd, afterRun);
  }
  // just invoke regular functions
  else if (typeof cmd == 'function')
  {
    // use function name as the key
    cmd(cmd.name, afterRun);
  }
  // or just a simple command
  else
  {
    exec(cmd, afterRun);
  }

  /**
   * Handles run callbacks
   *
   * @param   {object} err - error object
   * @param   {mixed} output - command output
   * @param   {string} key - command(s) name
   * @returns {void}
   */
  function afterRun(err, output, key)
  {
    if (err) return callback(err, acc);

    acc[key] = output;

    spawner(acc, cmds, callback);
  }
}

/**
 * executes commands by piping them one into another
 * in the provided order
 *
 * @param   {array} cmds - list of command objects to pipe
 * @param   {function} callback - invoked after last command in the list exited
 * @returns {void}
 */
function pipe(cmds, callback)
{
  var keys = []
    , error
    , lastSpawned
    ;

  cmds.forEach(function(cmd)
  {
    var newlySpawned;

    // if error happened, skip the rest
    if (error) return;

    // store keys path
    keys = keys.concat(Object.keys(cmd));
    newlySpawned = exec(cmd);

    eos(newlySpawned, errorHandler);

    // pipe previous command into the next one
    if (lastSpawned)
    {
      lastSpawned.stdout.pipe(newlySpawned.stdin);
    }

    lastSpawned = newlySpawned;
  });

  // gather last stream data
  lastSpawned.stdout.pipe(concat(function(output)
  {
    // if error triggered don't do second callback
    if (!error)
    {
      callback(null, output.toString(), keys.join('|'));
    }
  }));

  /**
   * Handler stream errors
   *
   * @param   {object} err - error object
   * @returns {void}
   */
  function errorHandler(err)
  {
    if (err)
    {
      // expose occurred error
      error = err;
      callback(err);
    }
  }
}

/**
 * executes provided command object
 *
 * @param   {object} cmd - object with spawn command as the key and list of arguments as value
 * @param   {function} callback - invoked after executed command exited
 * @returns {object|void} - either void or object with stdin and stdout streams
 */
function exec(cmd, callback)
{
  var name = Object.keys(cmd)[0]
    , args = cmd[name]
    , proc
    , exitCode
    , output
    ;

  // make it array
  args = Array.isArray(args) ? args : [args];

  proc = spawn(name, args);

  if (callback)
  {
    proc.stdout.pipe(concat(function(data)
    {
      output = data.toString();

      // could be either this one or process exited first
      if (typeof exitCode != 'undefined')
      {
        callback(exitCode || null, output, name);
      }
    }));

    proc.on('error', callback);
    proc.on('exit', function(code)
    {
      exitCode = code;
      // could be either this one or finished stdout first
      if (typeof output != 'undefined')
      {
        callback(code || null, output, name);
      }
    });

    return;
  }

  return proc;
}
