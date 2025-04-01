const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware para analisar o corpo das requisições como JSON
app.use(bodyParser.json());

// Endpoint para receber mensagens do Digisac
app.post('https://digi-maker-int.onrender.com/webhook', async (req, res) => {
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
    const url = 'https://api.gptmaker.ai/v2/agent/api/conversation'; // Substitua pelo endpoint correto
    const apiKey = 'API'; // Substitua pela sua chave de API

    try {
        console.log('Enviando mensagem para o GPTMaker:', mensagem);
        const response = await axios.post(url, {
            texto: mensagem // Enviando a mensagem como 'texto'
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Resposta do GPTMaker:', response.data);

        // Ajuste conforme a estrutura da resposta da API
        if (response.data && response.data.message) {
            return response.data.message; // Altere para o caminho correto da resposta
        } else {
            console.error('Erro: resposta da API não tem a estrutura esperada');
            throw new Error('Erro: resposta da API não tem a estrutura esperada');
        }
    } catch (error) {
        console.error('Erro ao enviar para o GPTMaker:', error.response ? error.response.data : error.message);
        throw new Error('Erro ao enviar para o GPTMaker');
    }
}

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
