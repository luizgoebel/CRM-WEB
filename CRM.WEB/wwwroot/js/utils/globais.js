document.addEventListener("DOMContentLoaded", function () {
    const filtros = document.querySelectorAll(".filtro-tabela");

    filtros.forEach(input => {
        let timeout = null;
        let filtroAnterior = "";

        const wrapper = input.closest(".input-group");
        const btnLimpar = wrapper?.querySelector(".btn-limpar-filtro");

        if (!btnLimpar) return;

        btnLimpar.addEventListener("click", async function () {
            input.value = "";
            filtroAnterior = "";
            btnLimpar.style.display = "none";

            const controller = input.dataset.controller;
            const tabelaId = input.dataset.tabelaId;
            if (!controller || !tabelaId) return;

            await buscarDadosAjax(controller, "", 1, tabelaId);
            window.history.pushState({}, '', `/${controller}`);
        });

        input.addEventListener("input", function () {
            const valorOriginal = input.value;
            const filtro = valorOriginal.trim().toLowerCase();
            const controller = input.dataset.controller;
            const tabelaId = input.dataset.tabelaId;

            if (!controller || !tabelaId) return;

            clearTimeout(timeout);

            const soEspacos = /^\s+$/.test(valorOriginal);
            const digitouAlgo = valorOriginal.length > 0;
            const filtroValido = filtro.length >= 3;

            // Mostra/oculta botão limpar
            btnLimpar.style.display = filtroValido ? "inline-block" : "none";

            if (digitouAlgo && (soEspacos || !filtroValido)) {
                const existente = bootstrap.Tooltip.getInstance(input);
                if (existente) existente.dispose();

                input.setAttribute("title", "Digite pelo menos 3 caracteres para buscar");

                const tooltip = new bootstrap.Tooltip(input, {
                    trigger: 'manual',
                    customClass: 'tooltip-amigavel'
                });
                tooltip.show();

                setTimeout(() => {
                    tooltip.hide();
                    input.removeAttribute("title");
                }, 2000);
                return;
            }

            timeout = setTimeout(async function () {
                if (filtro === filtroAnterior) return;

                filtroAnterior = filtro;

                await buscarDadosAjax(controller, filtro, 1, tabelaId);

                const novaUrl = `/${controller}?pagina=1&filtro=${encodeURIComponent(filtro)}`;
                window.history.pushState({}, '', novaUrl);
            }, 300);
        });
    });

    // Inicializa tooltips
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
        new bootstrap.Tooltip(el);
    });
});






async function buscarDadosAjax(controller, filtro = "", pagina = 1, tabelaId) {
    try {
        mostrarSpinner();

        const response = await fetch(`/${controller}/BuscarAjax?filtro=${encodeURIComponent(filtro)}&pagina=${pagina}`);
        if (!response.ok) {
            mostrarMensagem("");
            return;
        }

        const resultado = await response.json();

        if (tabelaId) {
            const wrapperTabela = document.getElementById(tabelaId);
            if (wrapperTabela && resultado.tabelaHtml) {
                wrapperTabela.innerHTML = resultado.tabelaHtml;
            }
        }

        const wrapperPaginacao = document.getElementById("paginacao");
        if (wrapperPaginacao && resultado.paginacaoHtml) {
            wrapperPaginacao.innerHTML = resultado.paginacaoHtml;
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
