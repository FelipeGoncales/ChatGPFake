// Importa as funções necessárias
import { escreverDigitando } from './digitar.js'; // Importa as funções de digitação
// Obtendo os elementos do DOM
const divMessages = document.querySelector('.div-messages');

// Função para adicionar uma mensagem
export async function addMessage(message, gemini) {
    const messageElement = document.createElement('p');
    messageElement.classList.add('message');
    divMessages.appendChild(messageElement);

    removeLoading();

    if (gemini) {
        messageElement.classList.add('gemini');
        escreverDigitando(messageElement, message);
    } else {
        messageElement.textContent = message;
        
        // Garante que a tela role para baixo após adicionar a mensagem
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }
}

// Função parar adicionar imagem
export async function addImagem(url) {

    const img = document.createElement('img');

    // Adiciona a url
    img.src = url;

    img.classList.add('imagem-gerada');
    
    divMessages.appendChild(img);

    removeLoading();

    setTimeout(() => {
        // Garante que a tela role para baixo após adicionar a mensagem
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }, 200)
}

// Adiciona o loading
export function addLoading() {
    const loadingElement = document.querySelector('.loading');
    if (loadingElement) {
        loadingElement.style.display = 'flex';
        loadingElement.remove();
        divMessages.appendChild(loadingElement);

        // Garante que a tela role para baixo após adicionar a mensagem
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }
}

// Da display none para o loading
export function removeLoading() {
    const loadingElement = document.querySelector('.loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}