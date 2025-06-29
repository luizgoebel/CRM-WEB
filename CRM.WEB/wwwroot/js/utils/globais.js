document.addEventListener("DOMContentLoaded", function () {
    const filtros = document.querySelectorAll(".filtro-tabela");

    filtros.forEach(input => {
        let timeout = null;
        let filtroAnterior = "";

        const wrapper = input.closest(".input-group");
        const btnLimpar = wrapper?.querySelector(".btn-limpar-filtro");
        if (!btnLimpar) return;

        // Função para atualizar estado do botão
        function atualizarBotao() {
            const valor = input.value.trim();
            const filtroAtivo = valor.length >= 3;

            // Troca ícone conforme filtro ativo
            btnLimpar.innerHTML = filtroAtivo
                ? '<i class="fa-solid fa-filter-circle-xmark"></i>'
                : '<i class="fa-solid fa-filter"></i>';

            // Mostra o botão SEMPRE, só muda se quiser esconder, mas no seu pedido é sempre visível
            btnLimpar.style.display = "inline-flex";

            // Controla cursor e classe para estilos
            if (filtroAtivo) {
                btnLimpar.classList.add("filtro-ativo");
                btnLimpar.setAttribute("data-bs-toggle", "tooltip");
                btnLimpar.setAttribute("data-bs-placement", "left");
                btnLimpar.setAttribute("title", "Limpar filtro");
                if (!btnLimpar._tooltip) {
                    btnLimpar._tooltip = new bootstrap.Tooltip(btnLimpar, {
                        customClass: "tooltip-amigavel",
                        trigger: "hover focus"
                    });
                }
            } else {
                btnLimpar.classList.remove("filtro-ativo");
                btnLimpar.removeAttribute("data-bs-toggle");
                btnLimpar.removeAttribute("data-bs-placement");
                btnLimpar.removeAttribute("title");
                if (btnLimpar._tooltip) {
                    btnLimpar._tooltip.dispose();
                    btnLimpar._tooltip = null;
                }
            }
        }

        // Clique só limpa filtro se tiver filtro ativo
        btnLimpar.addEventListener("click", async function () {
            const valor = input.value.trim();
            if (valor.length < 3) {
                // Não faz nada se não tiver filtro válido
                return;
            }

            input.value = "";
            filtroAnterior = "";
            atualizarBotao();

            const controller = input.dataset.controller;
            const tabelaId = input.dataset.tabelaId;
            if (!controller || !tabelaId) return;

            await buscarDadosAjax(controller, "", 1, tabelaId);
            window.history.pushState({}, '', `/${controller}`);
        });

        // Input event
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

            atualizarBotao();

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

        // Inicializa estado do botão no load
        atualizarBotao();
    });

    // Inicializa tooltips em outros elementos
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
        if (!el._tooltip) {
            el._tooltip = new bootstrap.Tooltip(el);
        }
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
