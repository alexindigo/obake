var test    = require('tape');
var path    = require('path');
var spawner = require('./spawner.js');
var common  = require('./common.js');
var source  = path.basename(__filename, '.js');

test('instrumented, no coverage', function(t)
{
  t.plan(5);

  spawner(
    common.beforeTest(source).concat([
      [
        {'browserify': ['-t', 'browserify-istanbul', './fixture/test.js']},
        {'node': ['./instrumented/' + source + '/bin/obake.js']}
      ]
    ],
    common.afterTest(source)
  ),
  function(err, output)
  {
    t.error(err, 'running instrumented obake should not error');
    t.ok(output.istanbul.indexOf('Statements   : 100% ( 0/0 )') > -1, 'should have 0 statements covered');
    t.ok(output.istanbul.indexOf('Branches     : 100% ( 0/0 )') > -1, 'should have 0 branches covered');
    t.ok(output.istanbul.indexOf('Functions    : 100% ( 0/0 )') > -1, 'should have 0 functions covered');
    t.ok(output.istanbul.indexOf('Lines        : 100% ( 0/0 )') > -1, 'should have 0 lines covered');
  });
});
