module.exports = {
	root: true,
	env: {
		node: true
	},
	'extends': [
		'plugin:vue/recommended',
		'eslint:recommended'
	],
	parserOptions: {
		parser: 'babel-eslint'
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'semi': 'error',
		'no-unreachable': 'warn',
		'brace-style': 'error',
		'comma-dangle': ['error', 'never'
		],
		'indent': ['error', 'tab'
		],
		'quotes': ['error', 'single'
		],
		'space-before-function-paren': ['error', 'never'
		],
		'space-before-blocks': ['error', 'always'
		],
		'require-await': 'error',
		'space-in-parens': ['error', 'never'
		],
		'no-tabs': 'off',
		'padding-line-between-statements': [
			'error',
			{
				blankLine: 'always', prev: ['const', 'let', 'var'
				], next: ['*'
				]
			},
			{
				blankLine: 'never', prev: ['const', 'let', 'var'
				], next: ['const', 'let', 'var'
				]
			},
			{
				blankLine: 'always', prev: 'if', next: '*'
			},
			{
				blankLine: 'always', prev: '*', next: 'if'
			},
			{
				blankLine: 'always', prev: '*', next: 'return'
			}
		],
		'vue/html-indent': ['error', 'tab',
			{
				'attribute': 1,
				'baseIndent': 1,
				'closeBracket': 0,
				'alignAttributesVertically': true,
				'ignores': []
			}
		],
		'vue/max-attributes-per-line': ['error',
			{
				'singleline': 5,
				'multiline': {
					'max': 5,
					'allowFirstLine': true
				}
			}
		],
		'vue/singleline-html-element-content-newline': 'off'
	}
};