const express = require("express");
const app = express();
const api = express.Router();
const { v4: uuidv4 } = require('uuid');
let tempAdmins = [];
const PORT = 8090;
let API_CALLS = 0;

const {getClient, getDB, createObjectId} = require("./database");


// DATABASE ITEM STRUCTURE
/*
  {
    _id: id,
    title: title,
    description: description,
    date_created: date,
    current_list: currentList
  }
*/


// ======================== MIDDLEWARES ============================

// API REQUEST LOGS
api.use((req, res, next) => {

  let start = Date.now();
  res.once("finish", () => {
    API_CALLS++;
    let end = Date.now();
    let responseTime = end - start + "ms";
    let requestLog = {
      REQUEST_LOG: "___________",
      METHOD: req.method,
      PATH: req.path,
      STATUS: res.statusCode,
      RESPONSE_TIME: responseTime,
      API_CALLS: API_CALLS // since server restart
    }
    console.log(requestLog);
  });
  next();
});


// JSON PARSER
api.use((req, res, next) => {
  if (req.is("json")){
    let data = "";
    req.on("data", chunk => {
      data += chunk.toString();
    });
    req.on("end", () => {
      try {
        data = JSON.parse(data);
        req.body = data;
        next();
      } catch (err) {
        res.status(400).end();
      }
    });
  } else {
    next();
  }
});


// ============ DATA VALIDATION ==================

function validateItem(item){
  return !!item.title;
}

function validateId(id){
  const db = getDB();
  db.collection("todoCollection")
    .findOne({_id: createObjectId(id)})
    .then((response) => {
      return true;
    })
    .catch((err) => {
      return false;
    });
}



// ================== REST API =====================

// GET ALL ITEMS FROM DATABASE
api.get("/all", (req, res) => {
  const db = getDB();
  db.collection("todoCollection")
    .find({})
    .toArray()
    .then(data => {
      let dataJSON = JSON.stringify(data);
      res.status(200).json(dataJSON); // Försökte skicka som .json(data) men kom inte ut som JSON hos klienten
    })
    .catch(err => {
      console.error(err);
      res.status(500).end();
    })
});


// GET ONE ITEM BASED ON ID FROM THE DATABASE (NOT USED)
// =====================================================
// api.get("/item/:id", (req, res) => {
//   let itemId = req.params.id;
//   const db = getDB();
//
//   if (!itemId) {
//     return res.status(400).end();
//   }
//
//   if (!!validateId(itemId)){
//     return res.status(404).end();
//   }
//
//   db.collection("todoCollection")
//     .findOne({_id: createObjectId(itemId)})
//     .then(item => {
//       let data = JSON.stringify(item);
//       res.status(200).json(data);
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).end();
//     });
// });
// =====================================================


// ADD ONE NEW ITEM TO THE DATABASE
api.post("/items", (req, res) => {
  const db = getDB();
  let data = req.body;

  if (!validateItem(data)){
    return res.status(400).end();
  }
  db.collection("todoCollection")
    .insertOne(data)
    .then(result => {
      const response = {
        data: result.ops,
        server_msg: "Item sucessfully created"
      };
      res.status(201).send(result.ops);
    })
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
});


// UPDATE ONE ITEM IN THE DATABASE BASED ON THE ID
api.patch("/item/:id", (req, res) => {
  let itemId = req.params.id;
  const db = getDB();
  let data = req.body;

  if (!itemId) {
    return res.status(400).end();
  }

  if (!!validateId(itemId)){
    return res.status(404).end();
  }

  db.collection("todoCollection")
  .updateOne(
    {_id: createObjectId(itemId)},
    {$set: data}
  )
  .then(result => {
    res.status(200).send(result.ops);
  })
  .catch(err => {
    console.error(err);
    res.status(500).end();
  });
});


// DELETE ONE ITEM FORM THE DATABASE BASED ON THE ID
api.delete("/item/:id", (req, res) => {
  let itemId = req.params.id;
  const db = getDB();

  if (!itemId) {
    return res.status(400).end();
  }

  if (!!validateId(itemId)){
    return res.status(404).end();
  }

  db.collection("todoCollection")
    .deleteOne({_id: createObjectId(itemId)})
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
});


// DELETE ALL ITEMS FROM THE DATABASE - STAGE 1 VERIFICATION
api.delete("/delete/all", (req, res) => {
  // if (!validateAdmin()) return res.status(401).end();
  passwordOfGod = uuidv4();
  const tempAdmin = {
    //ip: req.headers['x-forwarded-for'], Inte säker på att detta funkar för alla klienter
    secret: passwordOfGod
  };

  let adminJSON = JSON.stringify(tempAdmin);
  tempAdmins.push(adminJSON);
  if (tempAdmin.secret) {
    let pwJSON = JSON.stringify(passwordOfGod);
    res.status(202).json(pwJSON);
  } else {
    res.status(500).end();
  }
});


// DELETE ALL ITEMS FROM THE DATABASE - STAGE 2 VERIFICATION
api.delete("/delete/all/:auth", (req, res) => {
  //const ip = req.headers['x-forwarded-for']; Inte säker på att detta funkar för alla klienter
  const authorization = req.params.auth;
  let isAuthed = false;


  for (let client of tempAdmins) {
    let clientPARSED = JSON.parse(client);
    // if (client.ip === ip && client.secret === authorization){
    //   isAuthed = true;
    // }

    if (clientPARSED.secret === authorization){
      isAuthed = true;
    }
  }

  if (!isAuthed){
    return res.status(401).end();
  }

  const db = getDB();

  db.collection("todoCollection")
    .deleteMany({})
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
});


// ROUTER
app.use("/api/api", api);


// SERVER PORT LISTENER
app.listen(PORT, () => {
console.log(`Server started on port ${PORT}`);
});
