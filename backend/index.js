const express = require('express');
const app = express();
//Behövs för SQlite
const driver = require('better-sqlite3');
//För att connecta till databasen
const db = driver('./database/traindb.sqlite3');
const stripe = require('stripe');

const endpointSecret = "whsec_NGovkQdxvYoTBXEpbtgaYGXZ0VFTzZZ0";
const eventData = { name: '', email: '', receipt_url: '' };
app.post('/api/user', express.raw({ type: 'application/json' }), (request, response) => {
	const sig = request.headers['stripe-signature'];

	let event;

	try {
		event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
	} catch (err) {
		response.status(400).send(`Webhook Error: ${err.message}`);
		return;
	}
	// Handle the event
	switch (event.type) {
		case 'customer.created':
			eventData.name = event.data.object.name;
			eventData.email = event.data.object.email;
			break;
		case 'checkout.session.completed':
			response.status(200).send('success');
			break;
		case 'charge.succeeded':
			eventData.receipt_url = event.data.object.receipt_url;
			console.log(eventData);
			break;
		default:
			console.log(`Unhandled event type ${event.type}`);
	}

	// Return a 200 response to acknowledge receipt of the event

	response.send();
});

//Bodyparser för att parsa ihop object
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

//Listen on localhost:4000 and start webserver
app.listen(4000, () => {
	console.log("Server running on port 4000");
});

app.get('/', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'Welcome to the jungle'
	});
});

//Dynamic rest route:POST
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


//Dynamic rest route:GET ALL
app.get('/api/:table', (req, res) => {
	let preparedStatement = db.prepare(`
	SELECT * FROM ${req.params.table}
	`);
	let result = preparedStatement.all();
	res.status(200).json({
		message: 'success',
		data: result
	});
})

//Dynamic rest route:GET:ID
app.get('/api/:table/:id', (req, res) => {
	let preparedStatement = db.prepare(`
	SELECT *
	FROM ${req.params.table}
	WHERE id = :id
	`);
	let result = preparedStatement.all({
		id: req.params.id
	});

	res.status(200).json({
		message: 'success',
		data: result
	});
})

//Dynamic rest route:PUT (update)
app.put('/api/:table/:id', (req, res) => {
	let updateParameters = Object.keys(req.body).map(parameter =>
		parameter + ' = :' + parameter
	);

	let preparedStatement = db.prepare(`
	UPDATE ${req.params.table}
	SET ${updateParameters}
	WHERE id = :id
	`);
	req.body.id = req.params.id;
	preparedStatement.run(req.body);

	res.status(200).json({
		message: 'success',
		data: req.body
	});
});

//Dynamic rest route:DELETE:ID
app.delete('/api/:table/:id', (req, res) => {
	let preparedStatement = db.prepare(`
	DELETE
	FROM ${req.params.table}
	WHERE id = :id
	`);
	let result = preparedStatement.run({
		id: req.params.id
	});

	res.status(200).json({
		message: 'success',
		data: result
	});
})