document.getElementById("btnTransition").addEventListener("click", function() {
    const content = document.getElementById("content");

    // Adiciona a classe hidden para iniciar a transição de fade-out
    content.classList.add("hidden");

    // Aguarda a duração da transição e então redireciona
    setTimeout(function() {
        window.location.href = "main_screen.html"; // Redireciona para a próxima página
    }, 1000); // Tempo de espera em milissegundos (mesmo tempo da transição CSS)
});