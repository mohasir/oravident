import { config } from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    files: ["src/modules/**/*.controller.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > ArrowFunctionExpression[async=true]",
          message: "All async controllers must be wrapped in asyncHandler() to properly catch errors in Express."
        },
        {
          selector: "ExportNamedDeclaration > FunctionDeclaration[async=true]",
          message: "All async controllers must be wrapped in asyncHandler() to properly catch errors in Express."
        }
      ]
    }
  }
];
