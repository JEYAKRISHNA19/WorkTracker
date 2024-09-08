import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 8081;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Role','empid']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// MySQL Connection
const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Jeyakrishnag1709$', 
  database: 'workfracker'
});
// Middleware to authenticate user and attach user info to req
const authenticateUser = async (req, res, next) => {
  
  // console.log(req.headers['empid'],"Fetched",req.body.EmployeeID)
  const empid = req.body.empid;

  try {
    const [rows] = await db.query('SELECT role FROM login WHERE empid = ?', [empid]);
    if (rows) {
      next();
    } else {
      res.status(404).json({ Error: "User not found" });
    }
  } catch (err) {
    console.error('Error fetching user info:', err);
    res.status(500).json({ Error: "Database error", details: err.message });
  }
};

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  console.log('User role:', req.user ? req.headers['role'] : 'No user info');
  if (req.headers['role'] === 'admin') {
    next();
  } else {
    res.status(403).json({ Error: 'Not authorized' });
  }
};

// Register a new user
app.post("/register", async (req, res) => {
  const { username, empid, password, email, role } = req.body;

  // Validate input
  if (!username || !empid || !password || !email || !role) {
    return res.status(400).json({ Error: "All fields are required" });
  }
  if (role !== 'admin' && role !== 'user') {
    return res.status(400).json({ Error: "Role must be 'admin' or 'user'" });
  }

  const checkEmpidSql = "SELECT * FROM login WHERE empid = ?";
  const checkAdminSql = "SELECT * FROM login WHERE role = 'admin'";
  const insertSql = "INSERT INTO login(username, empid, password, email, role) VALUES (?, ?, ?, ?, ?)";

  try {
    const [existingUser] = await db.query(checkEmpidSql, [empid]);
    if (existingUser.length > 0) {
      return res.status(409).json({ Error: "Employee ID already exists" });
    }

    if (role === 'admin') {
      const [adminExists] = await db.query(checkAdminSql);
      if (adminExists.length > 0) {
        return res.status(409).json({ Error: "An admin already exists" });
      }
    }

    const values = [username, empid, password, email, role];
    await db.query(insertSql, values);

    res.status(201).json({ Status: "Success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Error: "Database error", details: err.message });
  }
});

// Login a user
app.post("/login", async (req, res) => {
  const { empid, password } = req.body;

  if (!empid || !password) {
    return res.status(400).json({ Error: "Employee ID and password are required" });
  }

  const sql = "SELECT * FROM login WHERE empid = ?";

  try {
    const [result] = await db.query(sql, [empid]);
    if (result.length > 0) {
      if (password === result[0].password) {
        res.status(200).json({ success: true, role: result[0].role, username: result[0].username, empid: result[0].empid });
      } else {
        res.status(401).json({ Error: "Wrong password" });
      }
    } else {
      res.status(404).json({ Error: "Employee ID does not exist" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ Error: "Database error", details: err.message });
  }
});

// Admin dashboard (requires admin role)
app.get('/admin-dashboard', authenticateUser, isAdmin, async (req, res) => {
  try {
    console.log('Admin Dashboard route hit'); // Debugging line

    const query = `
      SELECT sno, EmployeeID, name, daily_task, project_allotted, 
             starting_date, expected_due, Status, justification
      FROM admincrud
    `;
    const [data] = await db.query(query);
    
    console.log('Data fetched:', data); // Debugging line
    res.json(data);
  } catch (err) {
    console.error('Error in /admin-dashboard route:', err); // Debugging line
    res.status(500).json({ Error: "Error fetching data", details: err.message });
  }
});

// Fetch single record (requires admin role)
app.get('/admin-dashboard/update/:sno', authenticateUser, isAdmin, async (req, res) => {
  const { sno } = req.params;

  const sql = `SELECT Status, justification FROM admincrud WHERE sno = ?`;
  
  try {
    const [data] = await db.query(sql, [sno]);
    if (data.length === 0) {
      return res.status(404).json({ Error: "Record not found" });
    }
    res.json(data[0]);
  } catch (err) {
    console.error('Error fetching data:', err.message);
    res.status(500).json({ Error: "Error fetching data", details: err.message });
  }
});

// Admin dashboard create route
app.post('/admin-dashboard/create', authenticateUser, isAdmin, async (req, res) => {
  const { EmployeeID, name, daily_task, project_allotted, starting_date, expected_due, Status, justification } = req.body;
  console.log('values: ');

  // Validate input data
  if (!EmployeeID || !name || !daily_task || !project_allotted || !starting_date || !expected_due || !Status || !justification) {
      return res.status(400).json({ Error: "All fields are required" });
  }

  const sql = "INSERT INTO admincrud (EmployeeID, name, daily_task, project_allotted, starting_date, expected_due, Status, justification) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  try {
      const values = [EmployeeID, name, daily_task, project_allotted, starting_date, expected_due, Status, justification];
      await db.query(sql, values);
      res.status(201).json({ Status: "Record created" });
  } catch (err) {
      res.status(500).json({ Error: "Error creating record", details: err.message });
  }
});

// Update record (requires admin role)
app.put('/admin-dashboard/update/:sno', authenticateUser, isAdmin, async (req, res) => {
  const { sno } = req.params;
  const { Status, justification } = req.body;

  // Validate input data
  if (Status === undefined || justification === undefined) {
    return res.status(400).json({ Error: "Status and justification are required" });
  }

  const sql = "UPDATE admincrud SET Status = ?, justification = ? WHERE sno = ?";
  try {
    const [result] = await db.query(sql, [Status, justification, sno]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ Error: "Record not found" });
    }
    res.status(200).json({ Status: "Record updated" });
  } catch (err) {
    res.status(500).json({ Error: "Error updating record", details: err.message });
  }
});

// Delete record (requires admin role)
app.delete('/admin-dashboard/delete/:sno', authenticateUser, isAdmin, async (req, res) => {
  const { sno } = req.params;

  const sql = "DELETE FROM admincrud WHERE sno = ?";
  try {
    const [result] = await db.query(sql, [sno]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ Error: "Record not found" });
    }
    res.status(200).json({ Status: "Record deleted" });
  } catch (err) {
    res.status(500).json({ Error: "Error deleting record", details: err.message });
  }
});

// User dashboard endpoint (uses the single connection)
app.get('/user-dashboard', async (req, res) => {
  const empid = req.headers['empid'];
  const role = req.headers['role'];
  
  // if (!empid) {
  //   return res.status(400).json({ Error: "empid missing in headers" });
  // }

  let query;
  let values = [];
  console.log(role,"roles",empid)

  if (role !== 'admin') {
    query = `SELECT * FROM admincrud WHERE EmployeeID = ?`;
    values = [empid];
  } else {
    query = `SELECT sno, EmployeeID, name, daily_task, project_allotted, 
             starting_date, expected_due, Status, justification 
             FROM admincrud`;
  }

  try {
    const [rows] = await db.query(query, values); // Directly retrieve the rows

    if (rows && rows.length > 0) {
      const result = rows.map(row => {
        if (row._buf) {
          delete row._buf;
        }
        return row;
      });

      return res.status(200).json(result);
    } else {
      return res.status(404).json({ Error: "No records found" });
    }
  } catch (error) {
    console.error('Error executing query:', error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
