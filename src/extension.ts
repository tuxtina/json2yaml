import * as vscode from 'vscode';
const yaml = require('js-yaml');

function getIndent() {
  const editorCfg = vscode.workspace.getConfiguration('editor');
  if (editorCfg && editorCfg.get('insertSpaces')) {
    const tabSize = editorCfg.get('tabSize');
    if (tabSize && typeof tabSize === 'number') {
      return tabSize;
    }
  }
  return 2;
}

function convertSelection(conversionFn) {
  return () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    editor.edit(edit => {
      const selection = editor.selection;
      const text = editor.document.getText(selection);
      const newText = conversionFn(text);
      if (newText) {
        edit.replace(selection, newText);
      }
    });  
  }
}

export function toYAML(text) {
  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    vscode.window.showErrorMessage('Could not parse the selection as JSON.');
    console.error(e);
    return;
  }
  return yaml.safeDump(json, {indent: getIndent()});
}

export function toJSON(text) {
  let json;
  try {
    json = yaml.safeLoad(text, {schema: yaml.JSON_SCHEMA})
  } catch (e) {
    vscode.window.showErrorMessage('Could not parse the selection as YAML.');
    console.error(e);
    return;
  }
  return JSON.stringify(json, null, getIndent());
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('json2yaml.toYAML', convertSelection(toYAML))
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('json2yaml.toJSON', convertSelection(toJSON))
  );
}

export function deactivate() {
}