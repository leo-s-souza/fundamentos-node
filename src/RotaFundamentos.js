const express = require("express");

const rotaFundamentos = express.Router();

rotaFundamentos.get("/courses", (request, response) => {
    return response.json([
        "curso1", "curso2", "curso3"
    ]);
});

rotaFundamentos.post("/courses", (request, response) => {
    try{
        const body = request.body;
        let cursos = [
            "curso1", "curso2", "curso3"
        ];

        cursos.push(body.curso);

        return response.json({
                cursos: cursos,
                status: 200
            }
        );
    } catch (e) {

        return response.json({
                erro: "erro",
                status: 400
            }
        );
    }

});

rotaFundamentos.put("/courses/:id", (req, res) => {
    const cursos = [
            "curso1", "curso2", "curso3", "curso4"
        ],
        newId = req.params.id;

    cursos[0] = cursos[0].replace("1", newId);

    return res.json({
            cursos: cursos,
            status: 200
        }
    );
});

rotaFundamentos.patch("/courses/:id", (req, res) => {
    const cursos = [
            "curso1", "curso2", "curso3", "curso4"
        ],
        newId = req.params.id;

    cursos[1] = cursos[1].replace("1", newId);

    return res.json({
            cursos: cursos,
            status: 200
        }
    );
});

rotaFundamentos.delete("/courses/:id", (req, res) => {
    const cursos = [
            "curso1", "curso2", "curso3", "curso4"
        ],
        newId = req.params.id;

    cursos[newId - 1] = "curso removido";

    return res.json({
            cursos: cursos,
            status: 200
        }
    );
});

module.exports = rotaFundamentos;