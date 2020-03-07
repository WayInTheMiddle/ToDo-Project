
//////////////////////  Integrating with NeDB  /////////////////////////////////////////
const express = require('express');
const toDoDB = require('nedb');
const app = express();

const port = '3000';
// To serve static files such as images, CSS files, and JavaScript files, 
// use the express.static built-in middleware function in Express
app.use(express.static('public'));  
app.use(express.json({ limit: '1mb' }));
app.listen(port, () => console.log(`Server started on port ${port} ...`));

const database = new toDoDB('todos.db');
database.loadDatabase();

// Basic Routing
// app.METHOD(PATH, HANDLER)

app.post('/todo', (request, response) => {
  const taskData = request.body;
  console.log('taskData ...' + taskData.length);
  database.remove({}, {multi:true});
  for(let i = 0; i < taskData.length; i ++) {
      database.insert(taskData[i]);
  }
//   const timestamp = Date.now();
//   data.timestamp = timestamp;
//   console.log("States ..." + data.states);
//   if(data.states === 'insert') {
//       database.insert(data);
//   }else if (data.states === 'update' ) {
//    // console.log("Record updating ...title" + data._id);
//    //    const id = parseInt(data._id, 10);
//    //    console.log("Record updating ... " + id);
//       database.update({_id: data._id}, {$set: {title:data.title, details:data.details}  } , {upsert:false},
//        function (err, numReplaced, affectedDoc, upsert) {
         
//          console.log("Record updated ..." + upsert);
//       })
//   }else if (data.states === 'delete') {
     
//    console.log("Record deleting ... _id:" + data._id);
//      database.remove({_id:data._id});
//   }
  database.persistence.compactDatafile();
  response.json(taskData);
});

app.get('/todo', (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});



//////////////////////  Integrating with MySql  /////////////////////////////////////////
// const express = require('express');
// const mysql = require('mysql');

// // //Creating connection
// const port = '3000';
// const db = mysql.createConnection({
//    host     : 'localhost',
//    user     : 'root',
//    password : '2244',
//    database : 'todo'
// });


// // Connect to database
// db.connect((err) => {
//    if(err) {
//       throw err;
//    }
//    console.log('MySQL connected ...');
// });

// const app = express();

// // // Create Database
// app.get('/createdb', (req, res) => {
//    let sql = 'CREATE DATABASE TODO';
//    db.query(sql, (err, result) => {
//       if(err) throw err;
//       console.log(result);
//       res.send('Database created ...');
//    });
// });

// // // Create Table
// app.get('/createtable', (req, res) => {
//    let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), details VARCHAR(1024), PRIMARY KEY (id))';
//    db.query(sql, (err, result) => {
//       if(err) throw err;
//       console.log(result);
//       res.send('Posts table created ...');
//    });
// });

// // // Insert post 1
// app.get('/addpost1', (req, res) => {
//    let post = {title: 'Node.js & sql implementation', details : 'Setup MySql using Node.js etc.'
//    }
//    let sql = 'INSERT INTO posts SET ?';
//    let query = db.query(sql, post, (err, result) => {
//       if(err) throw err;
//       console.log(result);
//       res.send('Record Inserted...');
//    });
// });

// app.get('/addpost2', (req, res) => {
//    let post = {title: 'Weather API', details : 'Implmentiong Weather App using Weather API'
//    }
//    let sql = 'INSERT INTO posts SET ?';
//    let query = db.query(sql, post, (err, result) => {
//       if(err) throw err;
//       console.log(result);
//       res.send('Record Inserted...');
//    });
// });
// // SELECT postS
// app.get('/getposts', (req, res) => {

//    let sql = 'SELECT * FROM posts';
//    let query = db.query(sql, (err, results) => {
//       if(err) throw err;
//       console.log(results);
//       res.send('Post Fetched ...');
//    });
// });

// // SELECT single post
// app.get('/getpost/:id', (req, res) => {

//    let sql = `SELECT * FROM posts WHERE id= ${req.params.id}`;
//    let query = db.query(sql, (err, result) => {
//       if(err) throw err;
//       console.log(result);
//       res.send('Post Fetched ...');
//    });
// });
// // UPDATE  post
// app.get('/updatepost/:id', (req, res) => {
//    let newTitle = 'Updated Title';
//    let sql = `UPDATE posts SET title = '${newTitle}' WHERE id = ${req.params.id}`;
//    let query = db.query(sql, (err, result) => {
//       if(err) throw err;
//       console.log(result);
//       res.send('Post Updated ...');
//    });
// });
// // DELETE  post
// app.get('/deletepost/:id', (req, res) => {
   
//    let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;
//    let query = db.query(sql, (err, result) => {
//       if(err) throw err;
//       console.log(result);
//       res.send('Post Deleted ...');
//    });
// });
// // ////////////////////////////////////////////////////////////
// app.listen(port, () => {
//    console.log('Server started on port 3000 ...');
// });