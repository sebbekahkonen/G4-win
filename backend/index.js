const express = require('express');
const app = express();
const { Sequelize } = require('sequelize');
//Behövs för SQlite
const driver = require('better-sqlite3');
//För att connecta till databasen
const db = driver('./database/traindb.sqlite3');
const stripe = require('stripe');
const nodemailer = require("nodemailer");
require('dotenv').config();

const endpointSecret = "whsec_NGovkQdxvYoTBXEpbtgaYGXZ0VFTzZZ0";
const eventData = { name: '', email: '', receipt_url: '', order_number: null, train_id: null, seats: '' };

async function sendEmail() {
	// Generate test SMTP service account from ethereal.email
	// Only needed if you don't have a real mail account for testing
	let testAccount = await nodemailer.createTestAccount();
	// create reusable transporter object using the default SMTP transport
	console.log(process.env.USER_MAIL);
	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.USER_MAIL,
			pass: process.env.USER_PASS
		}
	});

	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: 'gfourwin@gmail.com', // sender address
		to: `${eventData.email}`, // list of receivers
		subject: "G4-Win Kvitto", // Subject line
		html: `<h1>Tack för att du valde att resa med G4-win</h1>
				<h3>Här är ditt ordernummer: ${eventData.order_number}</h3>
				<h3>Klicka<a href="${eventData.receipt_url}"> här</a> för att se ditt kvitto</h3>`, // html body
	});

	console.log("Message sent: %s", info.messageId);
	// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

	// Preview only available when sending through an Ethereal account
	console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
	// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}


app.post('/api/receipts', express.raw({ type: 'application/json' }), (req, res) => {
	const sig = req.headers['stripe-signature'];

	let event;

	try {
		event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
	} catch (err) {
		res.status(400).send(`Webhook Error: ${err.message}`);
		return;
	}
	// Handle the event
	switch (event.type) {
		// case 'payment_intent.created':

		// 	// let preparedStatement6 = db.prepare(`
		// 	// SELECT * FROM seats
		// 	// WHERE seats."train_id" = ${result[0].train_id}
		// 	// `);
		// 	// let result2 = preparedStatement6.all();
		// 	// console.log(result2);
		// 	break;
		case 'payment_intent.succeeded':
			console.log("paymentIntentSuccess");
			let seatsBooked = '';
			let preparedStatement4 = db.prepare(`
			SELECT * FROM current_trainId
			`);
			let result = preparedStatement4.all();
			Object.keys(result).forEach(key => {
				console.log(result[key]);
				seatsBooked = seatsBooked.concat(result[key].seats_booked.toString() + ",");
			});
			eventData.train_id = result[0].train_id
			eventData.seats = seatsBooked;

			let query5 = `DELETE FROM current_trainId;`
			let preparedStatement5 = db.prepare(query5);
			preparedStatement5.run();
			break;
		case 'customer.created':
			let orderNumber = Math.floor(Math.random() * 100000000);

			eventData.name = event.data.object.name;
			eventData.email = event.data.object.email;
			eventData.order_number = orderNumber;
			let query1 = `DELETE FROM current_user;`
			let preparedStatement1 = db.prepare(query1);
			preparedStatement1.run();
			break;
		case 'charge.succeeded':
			eventData.receipt_url = event.data.object.receipt_url;
			let columnNames = Object.keys(eventData);
			let columnParamaters = columnNames.map((colName) => ':' + colName);

			let query =
				`
				INSERT INTO receipts
				(${columnNames})
				VALUES (${columnParamaters})
				`;
			let preparedStatement = db.prepare(query);
			preparedStatement.run(eventData);
			sendEmail();
			res.status(200).json({
				message: 'success',
				data: eventData
			});
			break;
		case 'checkout.session.completed':
			let columnNames3 = Object.keys(eventData);
			let columnParamaters3 = columnNames3.map((colName) => ':' + colName);
			let query3 =
				`
				INSERT INTO current_user
				(${columnNames3})
				VALUES (${columnParamaters3})
				`;
			let preparedStatement3 = db.prepare(query3);
			preparedStatement3.run(eventData);

			break;
		default:
			console.log(`Unhandled event type ${event.type}`);
	}

	// Return a 200 response to acknowledge receipt of the event

	res.send();
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

app.delete('/api/:table', (req, res) => {
	let preparedStatement = db.prepare(`
	DELETE
	FROM ${req.params.table}
	`);
	let result = preparedStatement.run({
		id: req.params.id
	});

	res.status(200).json({
		message: 'success',
		data: result
	});
})


// app.get('/api/:table/from/:from', (req, res) => {
// 	let preparedStatement = db.prepare(`
// 	SELECT *
// 	FROM ${req.params.table}
// 	WHERE trains."from" LIKE :from
// 	`);
// 	let result = preparedStatement.all({
// 		from: req.params.from
// 	});

// 	res.status(200).json({
// 		message: 'success',
// 		data: result
// 	});
// })



// app.get('/api/:table/to/:to', (req, res) => {
// 	let preparedStatement = db.prepare(`
// 	SELECT *
// 	FROM ${req.params.table}
// 	WHERE trains."to" LIKE :to
// 	`);
// 	let result = preparedStatement.all({
// 		to: req.params.to
// 	});

// 	res.status(200).json({
// 		message: 'success',
// 		data: result
// 	});
// })

app.get('/api/:table/:from/:to', (req, res) => {
	let preparedStatement = db.prepare(`
	SELECT *
	FROM ${req.params.table}
	WHERE trains."from" LIKE :from AND trains."to" LIKE :to
	`);
	let result = preparedStatement.all({
		from: req.params.from,
		to: req.params.to
	});

	res.status(200).json({
		message: 'success',
		data: result
	});
})
