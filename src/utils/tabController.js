// src/utils/tabController.js

// Função para controlar a alternância entre abas
export function setupTabController() {
    // Seleciona todos os botões de aba e conteúdos
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Adiciona evento de clique para cada botão de aba
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');
        
        // Remove a classe 'active' de todos os botões e conteúdos
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Adiciona a classe 'active' ao botão clicado e ao conteúdo correspondente
        button.classList.add('active');
        
        // Verifica se o elemento existe antes de adicionar a classe
        const targetTab = document.getElementById(tabName);
        if (targetTab) {
          targetTab.classList.add('active');
        }
      });
    });
  }