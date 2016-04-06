//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as myExtension from '../src/extension';

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", () => {

  test("Should convert JSON to YAML", () => {
    const json = '{"foo": "bar", "baz": 99, "someArray": ["a", "b", "c"]}'
    const yaml = myExtension.toYAML(json);
    const tabSize = vscode.workspace.getConfiguration('editor').get('tabSize');
    let space = '';
    for (let i = 0; i < tabSize; i++) {
      space += ' ';
    }
    assert.ok(yaml);
    assert.equal(yaml, `foo: bar\nbaz: 99\nsomeArray:\n${space}- a\n${space}- b\n${space}- c\n`)
  });

  test("Should fail for unparsable JSON", () => {
    const json = '{"foobar", "baz": 99, "someArray": ["a", "b", "c"]}'
    const yaml = myExtension.toYAML(json);
    assert.strictEqual(yaml, undefined);
  });

  test("Should convert YAML to JSON", () => {
    const yaml = 'foo: bar\nbaz: 99\nsomeArray:\n  - a\n  - b\n  - c\n'
    const json = myExtension.toJSON(yaml);
    const tabSize = vscode.workspace.getConfiguration('editor').get('tabSize');
    let space = '';
    for (let i = 0; i < tabSize; i++) {
      space += ' ';
    }
    assert.ok(json);
    assert.equal(json, `{\n${space}"foo": "bar",\n${space}"baz": 99,\n${space}"someArray": [\n${space}${space}"a",\n${space}${space}"b",\n${space}${space}"c"\n${space}]\n}`)
  });

  test("Should fail for unparsable YAML", () => {
    const yaml = 'foo: bar\nbaz: 99\nsomeArra a\n  - b\n  - c\n'
    const json = myExtension.toJSON(yaml);
    assert.strictEqual(json, undefined);
  });


});