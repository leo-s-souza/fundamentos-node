const express = require("express");
const rotaPrimeiroProjeto = express.Router();
const {v4: uuidv4} = require("uuid");
const {response} = require("express"); //8.3K (gziped: 3.5K)

const customers = [];

//Midleware

function verifyIfExistsAccountCPF(req, res, next) {
    const {cpf} = req.headers,
        customer = customers.find((cust) => cust.cpf === cpf);

    if (!customer)
        return res.status(400).send({error: "Customer not found"});

    req.customer = customer;

    return next();
}

function getBalance(statement) {
    return statement.reduce((acc, operation) => {
        if (operation.type === "credit") {
            return acc + operation.amount;
        }
        return acc - operation.amount;
    }, 0);
}

/**
 * cpf - string
 * name - string
 * id - uuid
 * statement = []
 */
rotaPrimeiroProjeto.post("/account", (req, res) => {
    const {cpf, name} = req.body;

    const customerAlredyExists = customers.some(
        (customer) => customer.cpf === cpf
    );

    if (customerAlredyExists) {
        return res.status(400).send("Customer alredy exists");
    }

    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    });

    return res.status(201).send();
});

rotaPrimeiroProjeto.post("/accounts", (req, res) => {
    const newCustomers = req.body;

    for (const c of newCustomers) {
        const {cpf, name} = c;

        const customerAlredyExists = customers.some(
            (customer) => customer.cpf === cpf
        );

        if (customerAlredyExists) {
            return res.status(400).send("Customer alredy exists");
        }

        customers.push({
            cpf,
            name,
            id: uuidv4(),
            statement: []
        });
    }


    return res.status(201).send();
});

rotaPrimeiroProjeto.get("/statement", verifyIfExistsAccountCPF, (req, res) => {
    const {customer} = req;

    return res.status(200).send(customer);
});

rotaPrimeiroProjeto.post("/deposit", verifyIfExistsAccountCPF, (req, res) => {
    const {description, amount} = req.body,
        {customer} = req,
        statementOperation = {
            description,
            amount,
            created_at: new Date(),
            type: "credit"
        };

    customer.statement.push(statementOperation);

    return res.status(201).send()

});

rotaPrimeiroProjeto.post("/withdraw", verifyIfExistsAccountCPF, (req, res) => {
    const {amount} = req.body,
        {customer} = req,
        balance = getBalance(customer.statement);

    if (balance < amount) {
        return res.status(400).send({error: "Insufficient funds"})
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: "debit"
    };

    customer.statement.push(statementOperation);

    return res.status(201).send();
});

rotaPrimeiroProjeto.get("/statement/date", verifyIfExistsAccountCPF, (req, res) => {
    const {customer} = req,
        {date} = req.query,
        dateFormat = new Date(date + " 00:00"),
        statement = customer.statement.filter((statement) => {
            console.log("1", statement.created_at.toDateString());
            console.log("2", new Date(dateFormat).toDateString());

            return statement.created_at.toDateString() === new Date(dateFormat).toDateString()
        });

    console.log("dateFormat", dateFormat);

    console.log("statement", statement);

    if (!statement) {
        return res.status(400).send({error: "No statements in this date"});
    }

    return res.status(200).send(statement);
});

rotaPrimeiroProjeto.put("/account", verifyIfExistsAccountCPF, (req, res) => {
    const {name} = req.body,
        {customer} = req;

    customer.name = name;

    return res.status(201).send();
});

rotaPrimeiroProjeto.get("/account", verifyIfExistsAccountCPF, (req, res) => {
    return res.status(200).send(req.customer);
});

rotaPrimeiroProjeto.get("/accounts", (req, res) => {
    return res.status(200).send(customers);
});

rotaPrimeiroProjeto.delete("/account", verifyIfExistsAccountCPF, (req, res) => {
    const {customer} = req;

    customers.splice(customers.findIndex(value => value.cpf === customer.cpf), 1);

    return res.status(200).send(customers);
});

rotaPrimeiroProjeto.get("/balance", verifyIfExistsAccountCPF, (req, res) => {
    const {customer} = req,
        balance = getBalance(customer.statement);

    return res.status(200).send({balance: balance});
});


module.exports = rotaPrimeiroProjeto;