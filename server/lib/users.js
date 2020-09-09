/* eslint-disable no-await-in-loop */
const haiku = require('./haiku');

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "qveCcWUwKG2OFBWFmOXD"
});

const connectDB = (con) => {
  return new Promise(function (resolve, reject) {
  		con.connect(function(err) {
		  if (err) {
		  	reject(err);
		  }
		  console.log("Connected!");
		  resolve(con);
		});
  });
}

const init = async (con) => {
	let connected = await connectDB(con)
	return connected
}

const queryDB = (query,con) => {
  return new Promise( async (resolve, reject) => {
        const connected = await init( con )

  		connected.query(query, function (err, result) {
			if (err){
				reject(err)
			}
			console.log("Result: " + JSON.stringify(result[0].email));			
			resolve(result)
		});
  });
}

const test = async () => {
	let result = await queryDB('SELECT * FROM celebenvy_bello.users',con)
	console.log("Result: " + JSON.stringify(result[0].email));
}

test()


const users = {};

// Random ID until the ID is not in use
async function randomID() {
  let id = haiku();
  while (id in users) {
    await Promise.delay(5);
    id = haiku();
  }
  return id;
}

exports.create = async (socket) => {
  const id = await randomID();
  users[id] = socket;
  return id;
};

exports.get = (id) => users[id];

exports.remove = (id) => delete users[id];
