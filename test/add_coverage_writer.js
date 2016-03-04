var fs           = require('fs');
var path         = require('path');
var coverageFile = path.resolve('coverage/coverage_{filename}.json');

// Public API
module.exports = createCoverageWriter;

/**
 * Creates coverage writer writer function with attached filename
 *
 * @param   {string} from - filename of the file to add
 * @param   {string} to - filename of the file to append to
 * @param   {string} source - target test's filename
 * @returns {function} - customized coverage writer writer
 */
function createCoverageWriter(from, to, source)
{
  return addCoverageWriter;

  /**
   * Appends coverage write snipper to the instrumented obake script
   *
   * @param {string} key - function identifier
   * @param {function} callback - invoked after snippet been appended
   */
  function addCoverageWriter(key, callback)
  {
    fs.readFile(from, function(readErr, data)
    {
      if (readErr) return callback(readErr);

      // add target filename
      data = data.toString().replace(/__coverage_filename__/g, coverageFile.replace('{filename}', source));

      fs.appendFile(to, data, {encoding: 'utf8'}, function(appendErr)
      {
        if (appendErr) return callback(appendErr);
        callback(null, data.toString('utf8'), key);
      });
    });
  }
}
