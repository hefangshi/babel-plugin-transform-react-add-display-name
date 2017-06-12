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
  it('set variable name to displayName', () => {
    testFixture('createReactClass');
  });
});

describe('Component', () => {
  it('set class name to displayName', () => {
    testFixture('extendsComponentClassDeclaration');
  });
});

function testFixture(name) {
  const fixtureDir = path.join(fixturesDir, name);
  let multiplePasses = false;
  do {
    const actual = transform(path.join(fixtureDir, 'src.js'), {
      enforceDescriptions: true,
    }, { multiplePasses });
    const expected = fs.readFileSync(path.join(fixtureDir, 'expected.js'));
    assert.equal(trim(actual), trim(expected));
    if (multiplePasses) break;
    multiplePasses = true;
  } while (1)
}

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
