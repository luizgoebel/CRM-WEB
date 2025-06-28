document.addEventListener("DOMContentLoaded", function () {
    const filtros = document.querySelectorAll(".filtro-tabela");

    filtros.forEach(input => {
        input.addEventListener("input", async function () {
            const filtro = input.value.trim().toLowerCase();
            const controller = input.dataset.controller;
            if (!controller) return;

            await buscarDadosAjax(controller, filtro, 1);
        });
    });
});


async function buscarDadosAjax(controller, filtro = "", pagina = 1) {
    try {
        mostrarSpinner();

        // Realizado requisição ajax pra controller recebida por parametro, e o restante da url é padrão pra quem consumir a função
        const response = await fetch(`/${controller}/BuscarAjax?filtro=${encodeURIComponent(filtro)}&page=${pagina}`);
        // Verifica se a resposta foi bem sucedida
        if (!response.ok) {
            mostrarMensagem("");
            return;
        }

        const resultado = await response.json();

        // Recuperar elementos de tabela instanciada e paginação
        const wrapperTabela = document.getElementById("corpoTabelaClientes")
            || document.getElementById("corpoTabelaProdutos");
        const wrapperPaginacao = document.getElementById("paginacao");

        // Valida se veio o html e sub
        if (wrapperTabela && resultado.tabelaHtml) {
            wrapperTabela.innerHTML = resultado.tabelaHtml;
        }

        if (wrapperPaginacao && resultado.paginacaoHtml) {
            wrapperPaginacao.innerHTML = resultado.paginacaoHtml;

            // Rebind paginação
            wrapperPaginacao.querySelectorAll("a.page-link").forEach(link => {
                link.addEventListener("click", async function (e) {
                    e.preventDefault();
                    const novaPagina = parseInt(this.dataset.page);
                    await buscarDadosAjax(controller, filtro, novaPagina);
                });
            });
        }
    } catch (error) {
        mostrarMensagem("");
    } finally {
        esconderSpinner();
    }
}

function mostrarSpinner() {
    const spinner = document.getElementById('spinnerGlobal');
    if (spinner) spinner.style.display = 'block';
}

function esconderSpinner() {
    const spinner = document.getElementById('spinnerGlobal');
    if (spinner) spinner.style.display = 'none';
}

function mostrarMensagem(mensagem, tipo = "info") {
    const classe = `alert-${tipo}`;
    const $wrapper = $('#popupMensagemWrapper');
    const $popup = $('#popupMensagemConteudo');

    if (!mensagem || mensagem.trim() === "") {
        mensagem = "Erro inesperado do sistema.";
    }

    $popup.removeClass().addClass(`alert ${classe} mb-0`).html(mensagem);
    $wrapper.show();

    $('#btnFecharPopup').off('click').on('click', function () {
        $wrapper.hide();
    });
}

function confirmarAcao(mensagem, callback) {
    $('#popupConfirmacaoConteudo').text(mensagem || 'Deseja confirmar esta ação?');
    $('#popupConfirmacaoWrapper').fadeIn(150);

    function fechar() {
        $('#popupConfirmacaoWrapper').fadeOut(150);
        $('#btnConfirmarSim').off('click');
        $('#btnConfirmarNao').off('click');
        $('#btnFecharPopupConfirmacaoTopo').off('click');
    }

    $('#btnConfirmarSim').on('click', function () {
        fechar();
        if (typeof callback === 'function') callback(true);
    });

    $('#btnConfirmarNao, #btnFecharPopupConfirmacaoTopo').on('click', function () {
        fechar();
        if (typeof callback === 'function') callback(false);
    });
}
