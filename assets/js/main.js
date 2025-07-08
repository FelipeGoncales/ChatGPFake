let typingTimeout;           // Para controlar o setTimeout da digitação
let pararDigitacao = false;  // Flag para interromper a digitação

function markdownToHTML(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Negrito
        .replace(/\*(.*?)\*/g, '<em>$1</em>')             // Itálico
        .replace(/`([^`]+)`/g, '<code>$1</code>')         // Código inline
        .replace(/\n/g, '<br>');                          // Quebra de linha
}

// Função para digitar texto
function escreverDigitando(elemento, texto, velocidade = 20) {
    let i = 0;
    let plainText = texto;
    pararDigitacao = false;

    function digitarProximaLetra() {
        if (pararDigitacao) {
            document.getElementById('icone-botao').classList.remove('fa-stop');
            document.getElementById('icone-botao').classList.add('fa-paper-plane');
            return;
        }

        if (i < plainText.length) {
            const char = plainText.charAt(i);
            elemento.innerHTML = markdownToHTML(plainText.slice(0, i + 1));
            i++;

            let delay = velocidade;
            if (/[.,!?;:]/.test(char)) {
                delay += 150;
            }

            typingTimeout = setTimeout(digitarProximaLetra, delay);
        }
    }

    digitarProximaLetra();
}

// Ao carregar o DOM, inicia a digitação
document.addEventListener('DOMContentLoaded', () => {
    const texto = 'Olá, eu sou o Gemini! Como posso te ajudar hoje?';
    const elemento = document.querySelector('.mensagem-fixa');
    escreverDigitando(elemento, texto);
});

// Adiciona o loading
function addLoading() {
    const loadingElement = document.querySelector('.loading');
    if (loadingElement) {
        loadingElement.style.display = 'flex';
        loadingElement.remove();
        divMessages.appendChild(loadingElement);
    }
}

// Da display none para o loading
function removeLoading() {
    const loadingElement = document.querySelector('.loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

// Obtendo os elementos do DOM
const formInput = document.querySelector('.form-input');
const divMessages = document.querySelector('.div-messages');

// Função para adicionar uma mensagem
function addMessage(message, gemini) {
    const messageElement = document.createElement('p');
    messageElement.classList.add('message');
    divMessages.appendChild(messageElement);

    if (gemini) {
        messageElement.classList.add('gemini');
        escreverDigitando(messageElement, message);
    } else {
        messageElement.textContent = message;
    }

    removeLoading();
}

// Função para falar a mensagem usando Web Speech API
function speakMessage(message) {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'pt-BR';
    speechSynthesis.speak(utterance);
}

// Obtém o ícone do botão de enviar
const iconeBotao = document.getElementById('icone-botao');

// Função para parar
iconeBotao.addEventListener('click', () => {
    if (iconeBotao.classList.contains('fa-stop')) {
        // Se o ícone for de parar, cancela a digitação e fala
        pararDigitacao = true;             // Para a digitação
        clearTimeout(typingTimeout);       // Cancela qualquer timeout
        speechSynthesis.cancel();          // Cancela fala

        console.log(iconeBotao.classList);

        removeLoading()
    }
})

// Evento submit do formulário
formInput.addEventListener('submit', function (e) {
    e.preventDefault();

    // Altera o ícone do botão de enviar para parar
    iconeBotao.classList.remove('fa-paper-plane');
    iconeBotao.classList.add('fa-stop');

    const input = document.querySelector('.input-text');

    if (input.value.trim() !== '') {
        const message = input.value.trim();

        addMessage(message, false);

        setTimeout(() => {
            addLoading();
        }, 200);

        speakMessage(message);

        input.value = '';

        askGemini(message)
            .then(response => {
                addMessage(response, true);
                speakMessage(response);
            })
            .catch(error => {
                console.error('Erro ao obter resposta:', error);
                addMessage('Desculpe, ocorreu um erro ao processar sua solicitação.');

                iconeBotao.classList.remove('fa-stop');
                iconeBotao.classList.add('fa-paper-plane');
            })
    }
});

// Função para funcionar o botão de microfone
const micButton = document.querySelector('.microfone');
const input = document.querySelector('.input-text');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let isRecording = false;

    micButton.addEventListener('click', () => {
        if (!isRecording) {
            recognition.start();
            micButton.classList.add('gravando');
            isRecording = true;
        } else {
            recognition.stop();
            micButton.classList.remove('gravando');
            isRecording = false;
        }
    });

    recognition.addEventListener('result', (event) => {
        let textoFinal = '';
        for (let i = 0; i < event.results.length; i++) {
            textoFinal += event.results[i][0].transcript;
        }
        input.value = textoFinal;
    });

    recognition.addEventListener('end', () => {
        micButton.classList.remove('gravando');
        isRecording = false;
    });

    recognition.addEventListener('error', (event) => {
        console.error('Erro no reconhecimento de voz:', event.error);
        micButton.classList.remove('gravando');
        isRecording = false;
    });
}

// Chave da API do Gemini
const GEMINI_API_KEY = 'AIzaSyAjk5M1azZhsGXSOqQGYNPUhtGEyiZeETI';

// Função para falar com o gemini
async function askGemini(question) {
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: question }]
                    }
                ]
            })
        }
    );

    const data = await response.json();

    try {
        return data.candidates[0].content.parts[0].text;
    } catch (err) {
        console.error('Erro ao interpretar resposta do Gemini:', err, data);
        return 'Erro ao processar resposta da IA.';
    }
}