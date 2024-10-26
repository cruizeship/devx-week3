# MySQL Snippets

## MySQL workbench configuration
```html
1. Click the plus icon next to "MySQL Connections"
    Connection Name: "devx-demo"
    Hostname: 127.0.0.1 (should be auto-filled)
    Port: 3306 
    Username: root
    Password: password (click "Store in Vault/Keychain and enter password")
2. Click "Test Connection"
3. Click "Close" and open the connection

```

## Database setup
```html
CREATE DATABASE IF NOT EXISTS devx;
```
```html
USE devx;
```

## Table setup
```html
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);
```
```html
SHOW TABLES;
```

## Add users
```html
INSERT INTO users (user_email, user_password)
VALUES ('test@devx.com', 'password123');
```
```html
INSERT INTO users (user_email, user_password)
VALUES ('test2@devx.com', 'password456');
```

## View users
```html
SELECT * FROM users;
```
```html
SELECT * FROM users WHERE user_id = 1;
```

## Verify email/password
```html
SELECT * FROM users
WHERE user_email = 'test@devx.com' 
AND user_password = 'password123';
```

# Express Snippets

## Install MySQL
```html
npm install express mysql2
```

## Set up database connection
```html
const db = mysql.createConnection({
  host: 'rds-mysql-devx.chewcesukxbs.us-west-1.rds.amazonaws.com',
  user: 'masterUsername',
  password: 'masterPassword',
  database: 'devx',
  port: 3306
});
```

## Connection script
```html
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the MySQL database.');
  }
});
```

## Database add user route
```html
route.post('/add-user', (req, res) => {
  const { email, password } = req.body;

  const query = 'INSERT INTO users (user_email, user_password) VALUES (?, ?)';
  
  db.query(query, [email, password], (err, result) => {
    if (err) {
      return res.status(500).send('Error adding user to the database.');
    }
    res.status(200).send('User added successfully.');
  });
});
```

## Database verify user route
```html
route.post('/verify-user', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE user_email = ? AND user_password = ?';
  
  db.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).send('Error verifying user credentials.');
    }

    if (results.length > 0) {
      res.status(200).send('User verified successfully.');
    } else {
      res.status(401).send('Invalid email or password.');
    }
  });
});
```
