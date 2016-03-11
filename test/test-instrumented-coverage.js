var test    = require('tape');
var path    = require('path');
var spawner = require('./spawner.js');
var common  = require('./common.js');
var source  = path.basename(__filename, '.js');

test('instrumented, no coverage', function(t)
{
  t.plan(13);

  spawner(
    common.beforeTest(source).concat([
      [
        {'browserify': ['-t', 'browserify-istanbul', 'fixture/test.js']},
        {'node': ['instrumented/' + source + '/bin/obake.js', '--coverage', '--dir', 'instrumented/' + source + '/coverage']}
      ]
    ],
    common.afterTest(source)
  ),
  function(err, output)
  {
    var statements = output.istanbul.match(common.coverageRegex('Statements'))
      , branches   = output.istanbul.match(common.coverageRegex('Branches'))
      , functions  = output.istanbul.match(common.coverageRegex('Functions'))
      , lines      = output.istanbul.match(common.coverageRegex('Lines'))
      ;

    t.error(err, 'running instrumented obake should not error');

    t.ok(statements, 'should get number of covered statements, even if number is 0');
    t.ok(branches, 'should get number of covered branches, even if number is 0');
    t.ok(functions, 'should get number of covered functions, even if number is 0');
    t.ok(lines, 'should get number of covered lines, even if number is 0');

    t.equal(statements[1], '20', 'should have 20 statements covered');
    t.equal(statements[2], '20', 'out of 20 statements observed');

    t.equal(branches[1], '4', 'should have 4 branches covered');
    t.equal(branches[2], '4', 'out of 4 branches observed');

    t.equal(functions[1], '4', 'should have 4 functions covered');
    t.equal(functions[2], '4', 'out of 4 functions observed');

    t.equal(lines[1], '20', 'should have 20 lines covered');
    t.equal(lines[2], '20', 'out of 20 lines observed');
  });
});
