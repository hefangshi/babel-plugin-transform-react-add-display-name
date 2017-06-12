/*eslint indent: ["error", 2]*/

export default function ({ types: t }) {
  return {
    visitor: {
      ClassDeclaration(path, state) {
        resolveClassDeclar(t, path, state);
      },
      CallExpression(path, state) {
        resolveCreateClassCall(t, path, state);
      },
      ClassExpression(path, state) {
        resolveClassExpr(t, path, state);
      }
    }
  }
}

function isDisplayNameAssignmentNode(t, name, node) {
  // check whether displayName was added or not
  if (t.isExpressionStatement(node)
    && t.isAssignmentExpression(node.node.expression)) {
    const assignment = node.node.expression;
    if (t.isMemberExpression(assignment.left) &&
      t.isIdentifier(assignment.left.object, { name: name }) &&
      t.isIdentifier(assignment.left.property, { name: 'displayName' })) {
      return true;
    }
  }
  return false;
}

function resolveClassExpr(t, path) {
  const superClass = path.get('superClass');
  // TODO: handle assignment to a memeber expression
  if (t.isIdentifier(superClass.node, { name: 'Component' }) &&
    t.isVariableDeclarator(path.parent) && t.isIdentifier(path.parent.id)) {
    let displayName;
    const variableName = path.parent.id.name;
    if (!path.node.id) {
      // anonymous class expr
      displayName = path.parent.id.name;
    } else {
      displayName = path.node.id.name;
    }
    // check whether displayName was added or not
    const declaration = path.findParent((path) => path.isVariableDeclaration());
    const nextNode = declaration.getSibling(declaration.key + 1);
    if (isDisplayNameAssignmentNode(t, variableName, nextNode)) {
      return;
    }
    declaration.insertAfter(t.expressionStatement(t.assignmentExpression(
      '=',
      t.memberExpression(t.Identifier(variableName), t.Identifier('displayName')),
      t.stringLiteral(displayName)
    )));
  }
}

function resolveClassDeclar(t, path) {
  const superClass = path.get('superClass');
  if (t.isIdentifier(superClass.node, { name: 'Component' })) {
    const displayName = path.get('id').node.name;
    const nextNode = path.getSibling(path.key + 1);
    // check whether displayName was added or not
    if (isDisplayNameAssignmentNode(t, displayName, nextNode)) {
      return;
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
    if ((t.isMemberExpression(callee.node) &&
      t.isIdentifier(callee.node.object, { name: 'React' }) &&
      t.isIdentifier(callee.node.property, { name: 'createClass' })) ||
      (t.isIdentifier(callee.node, { name: 'createReactClass' })) &&
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