import { addMessage, addImagem } from './loading.js'; // Importa a função addMessage

// Chave da API do Gemini
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

// Armazena o histórico da conversa
const conversationHistory = [];

// Função para falar com o gemini
export async function askGemini(question) {
    // Adiciona a pergunta do usuário ao histórico
    conversationHistory.push({
        role: 'user',
        parts: [{ text: question }]
    });

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: conversationHistory
            })
        }
    );

    const data = await response.json();

    try {
        const respostaIA = data.candidates[0].content.parts[0].text;

        // Adiciona a resposta da IA ao histórico
        conversationHistory.push({
            role: 'model',
            parts: [{ text: respostaIA }]
        });

        return respostaIA;
    } catch (err) {
        console.error('Erro ao interpretar resposta do Gemini:', err, data);
        return 'Erro ao processar resposta da IA.';
    }
}


// Função para gerar imagem com Hugging Face
export async function gerarImagem(prompt) {

    // Avisa o usuário que está gerando a imagem
    addMessage('Gerando imagem, aguarde...', true);

    const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`, // 👈 Substitua pelo seu token
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            inputs: prompt
        })
    });

    if (!response.ok) {
    // Avisa o usuário que deu erro
    addMessage('Erro ao gerar a imagem. Tente novamente.', true);
        return;
    }

    const blob = await response.blob();

    const url = URL.createObjectURL(blob);

    // Adiciona a imagem gerada
    addImagem(url);
}