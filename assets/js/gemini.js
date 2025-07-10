// Chave da API do Gemini
const GEMINI_API_KEY = 'AIzaSyAjk5M1azZhsGXSOqQGYNPUhtGEyiZeETI';

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
