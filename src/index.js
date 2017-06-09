/*eslint indent: ["error", 2]*/

export default function ({ types: t }) {
  return {
    pre(file) {
    },
    post(file) {
    },
    visitor: {
      CallExpression(path, state) {
        if (t.isVariableDeclarator(path.parent) && t.isIdentifier(path.parent.id)) {
          const variableName = path.parent.id.name;
          const callee = path.get('callee');
          if (t.isMemberExpression(callee.node) &&
            t.isIdentifier(callee.node.object, {name: 'React'}) &&
            t.isIdentifier(callee.node.property, {name: 'createClass'})) {
            const args = path.node.arguments
            if (args.length >= 0) {
              var createClassArg = args[0];
              if (t.isObjectExpression(createClassArg)) {
                if (createClassArg.properties.filter(p => t.isIdentifier(p.key, {name: 'displayName'})).length === 0) {
                  createClassArg.properties.unshift(t.ObjectProperty(
                    t.Identifier('displayName'), t.stringLiteral(variableName)
                  ));
                }
              }
            }
          }
        }
      }
    }
  }
}