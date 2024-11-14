const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware para analisar o corpo das requisições como JSON
app.use(bodyParser.json());

// Endpoint para receber mensagens do Digisac
app.post('/webhook', async (req, res) => {
    try {
        const mensagem = req.body.mensagem;

        // Enviar a mensagem para o GPTMaker
        const resposta = await enviarParaGPTMaker(mensagem);

        // Enviar a resposta de volta para o usuário
        res.json({ resposta: resposta });
    } catch (error) {
        console.error('Erro ao processar a mensagem:', error);
        res.status(500).json({ erro: 'Erro ao processar a mensagem' });
    }
});

// Função para enviar a mensagem para o GPTMaker
async function enviarParaGPTMaker(mensagem) {
    const url = 'https://api.gptmaker.ai/v2/agent/3D4C2F8F8F3110AADD77C253AE56830C/conversation'; // Substitua pelo endpoint correto
    const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJncHRtYWtlciIsImlkIjoiM0Q0QzJENTQ2QTZDNTE1N0RGODI5QTY3RTgzQjExOTEiLCJ0ZW5hbnQiOiIzRDRDMkQ1NDZBNkM1MTU3REY4MjlBNjdFODNCMTE5MSIsInV1aWQiOiJkMmMyNDY5Zi03ODQ0LTQwYzYtODFhYS0zMmFkNDlhY2RmNjUifQ.CgR0SesPp66ND404zkkAfUyyJ9siRF6eYD4vMvYDpyM'; // Substitua pela sua chave de API

    try {
        const response = await axios.post(url, {
            texto: mensagem
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.resposta; // Ajuste conforme a estrutura da resposta da API
    } catch (error) {
        console.error('Erro ao enviar para o GPTMaker:', error);
        throw new Error('Erro ao enviar para o GPTMaker');
    }
}

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
