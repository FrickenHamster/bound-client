module.exports = {
	presets: ['@babel/preset-env'],
	plugins: [['@babel/plugin-syntax-import-attributes',
		{
			deprecatedAssertSyntax: true
		}]
	]
};
