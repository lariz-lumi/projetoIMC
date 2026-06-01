const express = require('express');
const cors = require('cors');
const { calcularIMC } = require('./funcao');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/calcular', (req, res) => {
    try {
        const dados = req.body;

        if (!dados || typeof dados !== 'object') {
            return res.status(400).json({
                error: 'Corpo da requisição errado'
            });
        }

        const { peso = 0, altura = 0 } = dados;

        if (peso <= 0) {
            throw new Error('Peso com valor errado');
        }

        if (altura <= 0) {
            throw new Error('Altura com valor errado');
        }

        const resultado = calcularIMC(peso, altura);

        return res.status(200).json({
            sucess: true,
            data: resultado
        });

    } catch (err) {
        console.log(err);

        return res.status(400).json({
            sucess: false,
            data: 'Erro'
        });
    }
});

module.exports = app;