# Personal Expense Tracker 

## Objective
Develop a RESTful API for managing personal financial records. Users can record their income and expenses, retrieve past transactions, and get summaries by category or time period.

## Tools and Technologies
- **Backend Framework**: Node.js with Express.js
- **Database**: SQLite (for simplicity) or MongoDB (if you prefer a NoSQL solution)

## Requirements
1. **Database Setup**
    - **SQLite**: 
      - Create tables: `transactions` (id, type, category, amount, date, description), `categories` (id, name, type).
    - **MongoDB**: 
      - Define collections: `transactions` (type, category, amount, date, description), `categories` (name, type).

2. **API Endpoints**
    - `POST /transactions`: Adds a new transaction (income or expense).
    - `GET /transactions`: Retrieves all transactions.
    - `GET /transactions/:id`: Retrieves a transaction by ID.
    - `PUT /transactions/:id`: Updates a transaction by ID.
    - `DELETE /transactions/:id`: Deletes a transaction by ID.
    - `GET /summary`: Retrieves a summary of transactions (total income, total expenses, balance), optionally filtered by date range or category.

3. **Functionality**
    - Implement route handlers for each endpoint.
    - Provide error handling to manage common issues like invalid transaction IDs, invalid inputs, etc.
    - Optionally add user authentication to protect the routes and associate transactions with specific users.

4. **Documentation**
    - Document your API endpoints with necessary request and response details.

## Project Setup

1. **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd expense-tracker
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Database Setup**:
    - For **SQLite**, the database will be set up automatically when you run the server.
    - For **MongoDB**, configure your MongoDB connection in `database.js`.

4. **Run the server**:
    ```bash
    node server.js
    ```

## API Usage

### Add a New Transaction
```bash
POST /transactions
{
  "type": "income",
  "category": "salary",
  "amount": 5000,
  "date": "2024-10-23",
  "description": "Monthly Salary"
}

### Retrieve all transactions
```bash
GET /transactions

### Retrieve a Transaction by ID
```bash
GET /transactions/:id

### Update a Transaction by ID
```bash
PUT /transactions/:id
{
  "type": "expense",
  "category": "groceries",
  "amount": 200,
  "date": "2024-10-23",
  "description": "Weekly Groceries"
}


### Delete a Transaction by ID
```bash
DELETE /transactions/:id


### Retrieve a Summary of Transactions
```bash
GET /summary?category=salary&startDate=2024-10-01&endDate=2024-10-23
#
