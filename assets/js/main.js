import { askGemini, gerarImagem } from './gemini.js'; // Importa a função askGemini
import { escreverDigitando, pararDigitacaoFunc } from './digitar.js'; // Importa as funções de digitação
import { addLoading, removeLoading } from './loading.js'; // Importa as funções de loading
import { speakMessage } from './speech.js'; // Importa a função speakMessage
import { addMessage } from './loading.js'; // Importa a função addMessage
import { pararIconeBotao, attListaImagens } from './utils.js'; // Importa a função enviarIconeBotao

// Ao carregar o DOM, inicia a digitação
document.addEventListener('DOMContentLoaded', () => {

    // Garante que o scroll esteja no topo
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    const texto = 'Olá, eu sou o GPFake! Como posso te ajudar hoje?';
    const elemento = document.querySelector('.mensagem-fixa');
    escreverDigitando(elemento, texto);

    // Adiciona a função ao botão de gerar imagem
    const gerarImagemBtn = document.querySelector('.gerar-imagem');

    // Adiciona ou remove a classe de ícone ao botão
    gerarImagemBtn.addEventListener('click', () => {

        if (gerarImagemBtn.classList.contains('marcada')) {

            gerarImagemBtn.classList.remove('marcada');

        } else {

            gerarImagemBtn.classList.add('marcada');

        }
    })

    // Função para fechar o modal de imagem
    const closeModalImg = document.querySelector('.close-modal-img');
    const modal = document.querySelector('.modal');

    // Fecha o modal ao clicar no ícone de fechar
    closeModalImg.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Fecha o modal ao clicar fora da imagem
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Obtém o ícone do botão de enviar
const iconeBotao = document.getElementById('icone-botao');

// Função para parar
iconeBotao.addEventListener('click', () => {
    if (iconeBotao.classList.contains('fa-stop')) {
        // Se o ícone for de parar, cancela a digitação e fala
        pararDigitacaoFunc();       // Para a digitação no módulo digitar.js
        speechSynthesis.cancel();          // Cancela fala
        removeLoading();
    }
})

// Obtém o formulário de entrada
const formInput = document.querySelector('.form-input');

// Evento submit do formulário
formInput.addEventListener('submit', function (e) {
    e.preventDefault();

    const input = document.querySelector('.input-text');

    if (input.value.trim() !== '') {
        // Altera o ícone do botão de enviar para parar
        pararIconeBotao();

        const message = input.value.trim();

        addMessage(message, false);

        setTimeout(() => {
            addLoading();
        }, 200);

        speakMessage(message);

        input.value = '';

        // Obtém o botão de gerar imagem
        const gerarImagemBtn = document.querySelector('.gerar-imagem');

        // Caso esteja marcado como gerar imagem
        if (gerarImagemBtn.classList.contains('marcada')) {
            gerarImagem(message)
                .then(() => {
                    // Após gerar a imagem, limpa o ícone de parar
                    pararIconeBotao();

                    // Atualiza a lista de imagens
                    attListaImagens();
                })
                .catch(error => {
                    console.error('Erro ao gerar imagem:', error);
                    addMessage('Desculpe, ocorreu um erro ao gerar a imagem.');
                });
            return; // Não chama o Gemini se for gerar imagem
        }

        // Senaõ, conversa normalmente com o Gemini
        askGemini(message)
            .then(response => {
                addMessage(response, true);
                speakMessage(response);
            })
            .catch(error => {
                console.error('Erro ao obter resposta:', error);
                addMessage('Desculpe, ocorreu um erro ao processar sua solicitação.');
            })
    }
});