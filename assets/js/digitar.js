import { enviarIconeBotao, markdownToHTML } from './utils.js';

let typingTimeout;
let pararDigitacao = false;

export function escreverDigitando(elemento, texto, velocidade = 20) {
    let i = 0;
    let plainText = texto;
    pararDigitacao = false;

    let alturaAntiga = document.body.scrollHeight;

    function digitarProximaLetra() {

        if (alturaAntiga !== document.body.scrollHeight) {
            // Garante que a tela role para baixo após adicionar a mensagem
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }

        if (pararDigitacao) {
            // Quando terminar de digitar, altera o ícone do botão para enviar
            enviarIconeBotao();
            return;
        }

        if (i < plainText.length) {
            const char = plainText.charAt(i);
            elemento.innerHTML = markdownToHTML(plainText.slice(0, i + 1));
            i++;

            let delay = velocidade;
            if (/[.,!?;:]/.test(char)) delay += 150;

            typingTimeout = setTimeout(digitarProximaLetra, delay);
        } else {
            // Quando terminar de digitar, altera o ícone do botão para enviar
            enviarIconeBotao();
            pararDigitacao = true; // Define que a digitação foi concluída
        }
    }

    digitarProximaLetra();
}

// Função para parar a digitação, que pode ser chamada de fora
export function pararDigitacaoFunc() {
    pararDigitacao = true;
    clearTimeout(typingTimeout);
    // Altera o ícone do botão de enviar para parar
    enviarIconeBotao();
}
