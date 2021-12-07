const express = require('express');
const app = express();
const driver = require('better-sqlite3');
const db = driver('./database/traindb.sqlite3');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

app.listen(8080, () => {
	console.log("Server running on port 8080");
});

app.get('/', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'Welcome to the jungle'
	});
});

app.post('/api/:table', (req, res) => {
	// let data = {
	// 	name: req.body.name,
	// 	email: req.body.email,
	// 	password: req.body.password
	// };
	/*test*/
	let columnNames = Object.keys(req.body);
	let columnParamaters = columnNames.map((colName) => ':' + colName);
	let query =
		`INSERT INTO ${req.params.table}
		(${columnNames})
		VALUES (${columnParamaters})
		`;

	let preparedStatement = db.prepare(query);
	preparedStatement.run(req.body);

	res.status(200).json({
		message: 'success',
		data: req.body
	});
})

app.get('/api/:table', (req, res) => {
	let preparedStatement = db.prepare(`
	SELECT * FROM ${req.params.table}
	`);
	let result = preparedStatement.all();
	res.status(200).json({
		message: 'testar get',
		data: result
	});
})