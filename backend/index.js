const express = require('express');
const app = express();
const { Sequelize } = require('sequelize');
//Behövs för SQlite
const driver = require('better-sqlite3');
//För att connecta till databasen
const db = driver('./database/traindb.sqlite3');
// const stripe = require('stripe');
const nodemailer = require("nodemailer");

//Bodyparser för att parsa ihop object
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
require('dotenv').config();

async function sendEmail(email, name) {
	let preparedStatement4 = db.prepare(`
			SELECT * FROM current_orderNumber
			`);
	let result = preparedStatement4.all();
	let preparedStatement2 = db.prepare(`
			SELECT * FROM current_user
			`);
	let result2 = preparedStatement2.all();

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

	let ticketsStudentArray = [];
	let ticketsAdultArray = [];
	let ticketsSeniorArray = [];
	let ticketsStudent = '';
	let ticketsAdult = '';
	let ticketsSenior = '';
	let price = 0;
	if (result2[0].ticketsStudent !== null) {
		ticketsStudentArray = result2[0].ticketsStudent.split(',');
		ticketsStudentArray.forEach((item) => {
			ticketsStudent += item + "&emsp;&emsp;&emsp;&emsp;";
		});
	}

	if (result2[0].ticketsAdult !== null) {
		ticketsAdultArray = result2[0].ticketsAdult.split(',');
		ticketsAdultArray.forEach((item) => {
			ticketsAdult += item + "&emsp;&emsp;&emsp;&emsp;";
		});
	}

	if (result2[0].ticketsSenior !== null) {
		ticketsSeniorArray = result2[0].ticketsSenior.split(',');
		ticketsSeniorArray.forEach((item) => {
			ticketsSenior += item + "&emsp;&emsp;&emsp;&emsp;";

		});
	}
	if (ticketsStudentArray[0] !== '') {
		price = price + parseInt(ticketsStudentArray[0].replace('kr', ''))
	}
	if (ticketsAdultArray[0] !== '') {
		price = price + parseInt(ticketsAdultArray[0].replace('kr', ''))
	}
	if (ticketsSeniorArray[0] !== '') {
		price = price + parseInt(ticketsSeniorArray[0].replace('kr', ''))
	}
	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: 'gfourwin@gmail.com', // sender address
		to: `${email}`, // list of receivers
		subject: "G4-Win Kvitto", // Subject line
		attachments: [{
			filename: 'G4Win-logo.png',
			path: './assets/G4Win-logo.png',
			cid: 'G4Win-logo@logo.se' //same cid value as in the html img src
		}],
		html: `
				<div>
				<img src="cid:G4Win-logo@logo.se" style="position: relative; width: 160px; height: 118px;"/>
				<h1 style="float:left;">Ditt kvitto för ${result[0].order_number}<h1>
				<h4>Order status: <span style="font-weight: lighter">Genomförd</span><br>
				Ordernummer: <span style="font-weight: lighter">${result[0].order_number}</span><br>
				Order datum: <span style="font-weight: lighter">${new Date().toLocaleDateString()}</span><br>
				Betalningsmetod: <span style="font-weight: lighter">Kortbetalning</span><br>
				Från: <span style="font-weight: lighter">${result2[0].departureDestination}</span><br>
				Till: <span style="font-weight: lighter">${result2[0].arrivalDestination}</span><br>
				Avgång: <span style="font-weight: lighter">${result2[0].departure}</span><br>
				Ankomst: <span style="font-weight: lighter">${result2[0].arrival}</span>
				</h4>
				<div>				
				<hr style="border-top: 3px solid #0000;">
				<br>
				<h1>Summering:</h1>
				<hr style="border-top: 3px solid #0000;">
				<h4>Summa&emsp;&emsp;&emsp;Antal&emsp;&emsp;&emsp;Typ</h4>
				<p>${ticketsStudent}</p>
				<p>${ticketsAdult}</p>
				<p>${ticketsSenior}</p>
				<hr style="border-top: 3px solid #0000;">
				<h4><span style="font-weight: lighter">${price}kr</span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Summa totalt</h4>
				<hr style="border-top: 3px solid #0000;">
				<br>
				<br>
				<h3 style="text-align:left;">Tack för att du valde att resa med G4-win!</h3>
				<h3 style="text-align:left;">Här är ditt ordernummer: ${result[0].order_number}</h3>
				<h3 style="text-align:left;">Du kan få mer information om din bokning genom att ange ditt ordernummer <a href="http://localhost:8080/ticket">här<a><h3>
				`
	});

	console.log("Message sent: %s", info.messageId);
	// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

	// Preview only available when sending through an Ethereal account
	console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
	// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}


const Stripe = require('stripe')
const stripe = new Stripe('sk_test_51K9H37AsS2e6kWH4AIHR0ScpXCHb9hOp5tzuap7Z0sYlTB8UTmKBqmdvYYKHEguf6D8O2jlisJZ2lWryBKYh9QIE00Znby8jdh') // stripe.com api secret key
// route for checkout
let SESSIONID = '';
app.post('/api/checkout', async (req, res) => {
	let line_items = req.body.items.map(item => {
		return {
			price_data: {
				currency: 'sek',
				product_data: {
					name: item.title,
				},
				unit_amount: item.price * 100,
			},
			quantity: item.amount,
		}
	})
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: line_items,
		mode: 'payment',
		success_url: 'http://localhost:8080/confirmation?session_id={CHECKOUT_SESSION_ID}',
		cancel_url: 'http://localhost:8080/payment',
	})
	SESSIONID = session.id;
	res.json({ id: session.id });
});


app.get('/api/confirmation', async (req, res) => {
	const session2 = await stripe.checkout.sessions.retrieve(SESSIONID);
	const customer = await stripe.customers.retrieve(session2.customer);

	res.status(200).json({
		message: 'success',
		data: customer
	});
	sendEmail(customer.email, customer.name);
});


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
// app.get('/api/:table/:id', (req, res) => {
// 	let preparedStatement = db.prepare(`
// 	SELECT *
// 	FROM ${req.params.table}
// 	WHERE id = :id
// 	`);
// 	let result = preparedStatement.all({
// 		id: req.params.id
// 	});

// 	res.status(200).json({
// 		message: 'success',
// 		data: result
// 	});
// })

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

app.delete('/api/:table/deleteSeats/:train_id/:seat', (req, res) => {
	let preparedStatement = db.prepare(`
	DELETE
	FROM ${req.params.table}
	WHERE ${req.params.table}."train_id" = :train_id
	AND ${req.params.table}."seats_booked" = :seat
	`);
	let result = preparedStatement.run({
		train_id: req.params.train_id,
		seat: req.params.seat
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

app.get('/api/:table/getPrices/fetchPrices/:train_id', (req, res) => {
	let preparedStatement = db.prepare(`
	SELECT *
	FROM ${req.params.table}
	WHERE ${req.params.table}."train_id" = :train_id
	`);
	let result = preparedStatement.all({
		train_id: req.params.train_id
	});

	res.status(200).json({
		message: 'success',
		data: result
	});
})
