// Função para converter Markdown para HTML
export function markdownToHTML(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Negrito
        .replace(/\*(.*?)\*/g, '<em>$1</em>')             // Itálico
        .replace(/`([^`]+)`/g, '<code>$1</code>')         // Código inline
        .replace(/\n/g, '<br>');                          // Quebra de linha
}

// Função para alterar o ícone do botão para enviar
export function enviarIconeBotao() {

    const iconeBotao = document.getElementById('icone-botao');

    iconeBotao.classList.remove('fa-stop');
    iconeBotao.classList.add('fa-paper-plane');

}

// Função para alterar o ícone do botão para parar
export function pararIconeBotao() {
    
    const iconeBotao = document.getElementById('icone-botao');

    iconeBotao.classList.remove('fa-paper-plane');
    iconeBotao.classList.add('fa-stop');
}

// Função para atualizar a lista de imagens
export function attListaImagens() {

    document.querySelectorAll('.imagem-gerada').forEach((img, index) => {

        img.setAttribute('data-index', index);

        img.addEventListener('click', () => {
            const modal = document.querySelector('.modal');
            const modalImg = document.querySelector('.modal img');
            modalImg.src = img.src;
            modal.style.display = 'flex';
        });
    });
}