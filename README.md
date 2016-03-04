# obake

Pipe javascript into phantomjs, print the output, writing test coverage to disk along the way

[![Linux Build](https://img.shields.io/travis/alexindigo/obake/master.svg?label=linux:0.10-5.x&style=flat)](https://travis-ci.org/alexindigo/obake)
[![Coverage Status](https://img.shields.io/coveralls/alexindigo/obake/master.svg?label=code+coverage&style=flat)](https://coveralls.io/github/alexindigo/obake?branch=master)
[![Dependency Status](https://img.shields.io/david/alexindigo/obake.svg?style=flat)](https://david-dm.org/alexindigo/obake)

## TL;DR

`istanbul` + `phantomjs` + `tap` + `command line` = `<3`

## Install

```bash
npm install --save-dev obake
```

## Usage

### Ideal

```bash
browserify -t browserify-istanbul test/test-*.js | obake --coverage
```

### Real world

Add following to your `package.json` scripts:

```json
"scripts": {
  "pretest": "rimraf coverage; mkdirp coverage",
  "test": "browserify -t browserify-istanbul test/test-*.js | obake --coverage",
  "posttest": "istanbul report lcov text-summary"
}
```

_(Assuming you have `rimraf`, `mkdirp`, `browserify`, `browserify-istanbul` and `istanbul` installed as well)_

More documentation TBW.

## License

Deeply is licensed under the MIT license.
