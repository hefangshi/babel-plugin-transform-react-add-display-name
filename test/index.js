import * as path from 'path';
import * as fs from 'fs';
import assert from 'power-assert';
import * as babel from 'babel-core';
import plugin from '../src/index';

function trim(str) {
    return str.toString().replace(/^\s+|\s+$/, '');
}

const baseDir = path.join(__dirname, '..');
const fixturesDir = path.join(__dirname, 'fixtures');

const BASE_OPTIONS = {
};

describe('React.createClass', () => {
  it('add variable name as displayName', () => {
    const fixtureDir = path.join(fixturesDir, 'createReactClass');
    try {
      const actual = transform(path.join(fixtureDir, 'src.js'), {
        enforceDescriptions: true,
      });
      const expected = fs.readFileSync(path.join(fixtureDir, 'expected.js'));
      assert.equal(trim(actual), trim(expected));
    } catch (e) {
      assert(false);
    }
  });
});


function transform(filePath, options = {}, { multiplePasses = false } = {}) {
  function getPluginConfig() {
    return [plugin, {
      ...BASE_OPTIONS,
      ...options,
    }];
  }

  return babel.transformFileSync(filePath, {
    sourceMaps: false,
    plugins: multiplePasses ? [
      getPluginConfig(),
      getPluginConfig(),
    ] : [getPluginConfig()],
  }).code;
}
