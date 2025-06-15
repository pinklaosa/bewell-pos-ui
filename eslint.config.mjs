import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        rules: {
            // Change all rules from error to warning
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/ban-ts-comment": "warn",
            "react-hooks/exhaustive-deps": "warn",
            "react/no-unescaped-entities": "warn",
            "@next/next/no-img-element": "warn",
            "prefer-const": "warn",
            "no-unused-vars": "warn",
            "no-console": "warn",
            "no-debugger": "warn",
            // Add more common rules as warnings
            "@typescript-eslint/prefer-as-const": "warn",
            "@typescript-eslint/no-inferrable-types": "warn",
            "react/display-name": "warn",
            "react/jsx-key": "warn",
            "react/no-children-prop": "warn",
            "react/no-deprecated": "warn",
            "react/no-direct-mutation-state": "warn",
            "react/no-find-dom-node": "warn",
            "react/no-is-mounted": "warn",
            "react/no-render-return-value": "warn",
            "react/no-string-refs": "warn",
            "react/require-render-return": "warn",
            "react/jsx-no-comment-textnodes": "warn",
            "react/jsx-no-duplicate-props": "warn",
            "react/jsx-no-target-blank": "warn",
            "react/jsx-no-undef": "warn",
            "react/jsx-uses-react": "warn",
            "react/jsx-uses-vars": "warn",
        },
    },
];

export default eslintConfig;