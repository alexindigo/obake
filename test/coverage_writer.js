process.on('exit', function()
{
  var fs = require('fs');

  if (global.__coverage__)
  {
    fs.writeFileSync('__coverage_filename__', JSON.stringify(global.__coverage__), {encoding: 'utf8'});

    console.log('Saved coverage information to __coverage_filename__.');
  }
});
