import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "mood_test",
});

// NOTE: entire backend will need to be reworked at a further time when redoing database design

// creates a new survey table and an associated answer table based on the list of questions created
app.post("/createsurvey", (req, res) => {
  // first query: checking how many surveys exists
  db.query("SHOW TABLES LIKE 'test_survey%'", (err, result) => {
    if (err) throw err;
    // the survey name is created automatically by incrementing a number at the end of the name
    // using the length of the list of existing surveys
    const tableNumber = result.length + 1;
    const createSurveyTable = `
    CREATE TABLE test_survey${tableNumber} (
      id INT NOT NULL PRIMARY KEY,
      question VARCHAR(255),
      type VARCHAR(45),
      alias VARCHAR(45)
    )
    `;

    // second query: create the survey table
    db.query(createSurveyTable, (err) => {
      if (err) throw err;
      console.log("New survey created");
      // inserting multiple rows of data
      const insertQuestions = `INSERT INTO test_survey${tableNumber} (id, question, type, alias) VALUES ?`;
      const questions = [];
      const columns = [];
      // this will also be used to build the query for the creation of the answers table
      req.body.forEach((element) => {
        // for survey table creation
        questions.push([
          element["id"],
          element["question"],
          element["type"],
          element["alias"],
        ]);
        // for survey answer table creation
        if (element.type === "yesNo") {
          columns.push(`${element.alias} VARCHAR(45)`);
        } else if (element.type === "text") {
          columns.push(`${element.alias} VARCHAR(255)`);
        } else if (element.type === "number" || element.type == "linear") {
          columns.push(`${element.alias} FLOAT`);
        }
      });

      // third query: insert the questions into survey table
      db.query(insertQuestions, [questions], (err) => {
        if (err) throw err;
        console.log("Survey questions successfully added");
      });

      const columnDefinition = columns.join(", ");
      const createAnswerTable = `
      CREATE TABLE answers_test_survey${tableNumber} (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        timestamp FLOAT,
        ${columnDefinition}
      )
    `;

      // fourth query: create survey answer table
      db.query(createAnswerTable, (err, data) => {
        if (err) {
          return res.json(err);
        }
        console.log("New survey answer table created");
        return res.json(data);
      });
    });
  });
});

// Home.tsx endpoints
app.get("/tables", (req, res) => {
  db.query("SHOW TABLES LIKE 'test_survey%'", (err, data) => {
    if (err) throw err;
    return res.json(data);
  });
});

app.delete("/deletetable/:table", (req, res) => {
  const q = "DROP TABLE ??";
  const questionTable = req.params.table;
  // first query: delete questions table
  db.query(q, [questionTable], (err) => {
    if (err) throw err;
    const answerTable = `answers_${questionTable}`;
    // second query: delete corresponding answer table
    db.query(q, [answerTable], (err, data) => {
      if (err) {
        return res.json(err);
      }
      console.log("Survey deleted");
      return res.json(data);
    });
  });
});

// Data.tsx endpoints
app.get("/getdata/:table", (req, res) => {
  const q = "SELECT * FROM ?? ORDER BY timestamp";
  const table = `answers_${req.params.table}`;
  db.query(q, [table], (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

app.get("/getcol/:table", (req, res) => {
  const q = "DESCRIBE ??";
  const table = `answers_${req.params.table}`;
  db.query(q, [table], (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

// Table.tsx endpoints
app.delete("/delete/:table/:id", (req, res) => {
  const table = `answers_${req.params.table}`;
  const id = req.params.id;
  const q = "DELETE FROM ?? WHERE id = ?";
  db.query(q, [table, id], (err, data) => {
    if (err) {
      return json.son(err);
    }
    return res.json(data);
  });
});

// Update.tsx endpoints
app.get("/getrow/:table/:id", (req, res) => {
  const table = `answers_${req.params.table}`;
  const id = req.params.id;
  const q = "SELECT * FROM ?? WHERE id = ?";
  db.query(q, [table, id], (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

app.put("/update/:table/:id", (req, res) => {
  // (?) is not needed here because SET and WHERE are both formatted using singular objects
  const q = "UPDATE ?? SET ? WHERE ?";
  const table = `answers_${req.params.table}`;
  const id = req.params.id;

  const whereclause = {
    id: id,
  };

  const sql = mysql.format(q, [table, req.body, whereclause]);

  db.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

// Form.tsx endpoints
app.get("/questions/:table", (req, res) => {
  const q = "SELECT * FROM ??";
  const table = req.params.table;
  db.query(q, [table], (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

app.post("/submit/:table", (req, res) => {
  const q = `INSERT INTO ?? (??) VALUES (?)`;
  const table = `answers_${req.params.table}`;
  const columns = [];
  const values = [];

  // need to extract the timestamp from the body, and set it a the top of the values list
  const { timestamp, ...body } = req.body;

  // key-value order is guaranteed to remain intact when iterating using Object.entries as of ES6
  for (const [k, v] of Object.entries(body)) {
    columns.push(k);
    values.push(v);
  }

  columns.unshift("timestamp");
  values.unshift(timestamp);

  db.query(q, [table, columns, values], (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

app.listen(8800, () => {
  console.log("Connected to backend");
});
