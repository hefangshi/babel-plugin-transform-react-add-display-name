/*eslint indent: ["error", 2]*/

export default function ({ types: t }) {
  return {
    visitor: {
      ClassDeclaration(path, state) {
        resolveClassDeclaration(t, path, state);
      },
      CallExpression(path, state) {
        resolveCreateClassCall(t, path, state);
      }
    }
  }
}

function resolveClassDeclaration(t, path) {
  const superClass = path.get('superClass');
  if (t.isIdentifier(superClass.node, { name: 'Component' })) {
    const displayName = path.get('id').node.name;
    const nextNode = path.getSibling(path.key + 1);
    // check whether displayName was added or not
    if (nextNode.node && t.isExpressionStatement(nextNode)
      && t.isAssignmentExpression(nextNode.node.expression)) {
      const assignment = nextNode.node.expression;
      if (t.isMemberExpression(assignment.left) &&
        t.isIdentifier(assignment.left.object, { name: displayName }) &&
        t.isIdentifier(assignment.left.property, { name: 'displayName' })) {
        return;
      }
    }
    path.insertAfter(t.expressionStatement(t.assignmentExpression(
      '=',
      t.memberExpression(t.Identifier(displayName), t.Identifier('displayName')),
      t.stringLiteral(displayName)
    )));
  }
}

function resolveCreateClassCall(t, path) {
  // TODO: handle assignment to a memeber expression
  if (t.isVariableDeclarator(path.parent) && t.isIdentifier(path.parent.id)) {
    const variableName = path.parent.id.name;
    const callee = path.get('callee');
    if (t.isMemberExpression(callee.node) &&
      t.isIdentifier(callee.node.object, { name: 'React' }) &&
      t.isIdentifier(callee.node.property, { name: 'createClass' }) &&
      path.node.arguments.length >= 0 &&
      t.isObjectExpression(path.node.arguments[0])) {
      const createClassArg = path.node.arguments[0];
      if (createClassArg.properties.filter(p => t.isIdentifier(p.key, { name: 'displayName' })).length === 0) {
        createClassArg.properties.unshift(t.objectProperty(
          t.identifier('displayName'), t.stringLiteral(variableName)
        ));
      }
    }
  }
}