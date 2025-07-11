import { addMessage, addImagem } from './loading.js'; // Importa a função addMessage

const URL_API = "https://api-chatgpfake.onrender.com";

// Armazena o histórico da conversa
const conversationHistory = [];

// Função para falar com o gemini
export async function askGemini(question) {
    // Adiciona a pergunta do usuário ao histórico
    conversationHistory.push({
        role: 'user',
        parts: [{ text: question }]
    });

    const response = await fetch(`${URL_API}/gerar-texto`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ conversationHistory: conversationHistory })
    });

    const data = await response.json();

    if (response.ok) {

        const respostaIA = data.resposta;

        // Adiciona a resposta da IA ao histórico
        conversationHistory.push({
            role: 'model',
            parts: [{ text: respostaIA }]
        });

        return respostaIA;
    } else {
        console.error('Erro ao interpretar resposta do Gemini:', err, data);
        return 'Erro ao processar resposta da IA.';
    }
}

// Função para gerar imagem com Hugging Face
export async function gerarImagem(prompt) {

    // Avisa o usuário que está gerando a imagem
    addMessage('Gerando imagem, aguarde...', true);

    const response = await fetch(`${URL_API}/gerar-imagem`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
        addMessage("Erro ao gerar a imagem. Tente novamente.", true);
        return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // Adiciona a imagem gerada
    addImagem(url);
}