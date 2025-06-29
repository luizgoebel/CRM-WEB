document.addEventListener("DOMContentLoaded", function () {
    const filtros = document.querySelectorAll(".filtro-tabela");

    filtros.forEach(input => {
        let timeout = null;
        let filtroAnterior = "";

        const wrapper = input.closest(".input-group");
        const btnLimpar = wrapper?.querySelector(".btn-limpar-filtro");
        if (!btnLimpar) return;

        function atualizarBotaoFiltro() {
            const valor = input.value.trim();
            const filtroAtivo = valor.length >= 3;

            btnLimpar.innerHTML = filtroAtivo
                ? '<i class="fa-solid fa-filter-circle-xmark"></i>'
                : '<i class="fa-solid fa-filter"></i>';

            btnLimpar.style.display = "inline-flex";

            if (filtroAtivo) {
                btnLimpar.classList.add("filtro-ativo");
                btnLimpar.setAttribute("data-bs-toggle", "tooltip");
                btnLimpar.setAttribute("data-bs-placement", "left");
                btnLimpar.setAttribute("title", "Limpar filtro");
                gerenciarTooltip(btnLimpar, true);
            } else {
                btnLimpar.classList.remove("filtro-ativo");
                btnLimpar.removeAttribute("data-bs-toggle");
                btnLimpar.removeAttribute("data-bs-placement");
                btnLimpar.removeAttribute("title");
                gerenciarTooltip(btnLimpar, false);
            }
        }

        function gerenciarTooltip(elemento, ativar) {
            if (ativar) {
                if (!elemento._tooltip) {
                    elemento._tooltip = new bootstrap.Tooltip(elemento, {
                        customClass: "tooltip-amigavel",
                        trigger: "hover focus"
                    });
                }
            } else {
                if (elemento._tooltip) {
                    elemento._tooltip.dispose();
                    elemento._tooltip = null;
                }
            }
        }

        async function limparFiltro() {
            const valor = input.value.trim();
            if (valor.length < 3) return;

            input.value = "";
            filtroAnterior = "";
            atualizarBotaoFiltro();

            const controller = input.dataset.controller;
            const tabelaId = input.dataset.tabelaId;
            if (!controller || !tabelaId) return;

            await buscarDadosAjax(controller, "", 1, tabelaId);
            window.history.pushState({}, '', `/${controller}`);
        }

        function filtrarComInput() {
            const valorOriginal = input.value;
            const filtro = valorOriginal.trim().toLowerCase();
            const controller = input.dataset.controller;
            const tabelaId = input.dataset.tabelaId;

            if (!controller || !tabelaId) return;

            clearTimeout(timeout);
            atualizarBotaoFiltro();

            const soEspacos = /^\s+$/.test(valorOriginal);
            const digitouAlgo = valorOriginal.length > 0;
            const filtroValido = filtro.length >= 3;

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
                }, 1500);
                return;
            }

            timeout = setTimeout(async () => {
                if (filtro === filtroAnterior) return;
                filtroAnterior = filtro;

                await buscarDadosAjax(controller, filtro, 1, tabelaId);

                const novaUrl = `/${controller}?pagina=1&filtro=${encodeURIComponent(filtro)}`;
                window.history.pushState({}, '', novaUrl);
            }, 300);
        }

        btnLimpar.addEventListener("click", limparFiltro);
        input.addEventListener("input", filtrarComInput);

        atualizarBotaoFiltro();
    });

    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
        if (!el._tooltip) {
            el._tooltip = new bootstrap.Tooltip(el);
        }
    });

    // ===== DELEGAÇÃO DE CLIQUE NA PAGINAÇÃO =====
    // Adiciona um listener para capturar todos os cliques no body da página
    document.body.addEventListener("click", function (e) {
        // Procura pelo elemento de link de paginação mais próximo do alvo do clique
        const link = e.target.closest("a.page-link");
        if (!link) return; // Se não for um link de paginação, não faz nada

        // Obtém o atributo href do link clicado
        const href = link.getAttribute("href");
        if (!href) return; // Se não houver href, não faz nada

        // Extrai os parâmetros da URL (após o '?') usando URLSearchParams
        const urlParams = new URLSearchParams(href.split('?')[1]);
        // Obtém o valor do parâmetro "pagina" da URL
        const paginaClicada = urlParams.get("pagina");
        if (!paginaClicada) return; // Se não houver página, não faz nada

        // Converte o valor da página para inteiro
        const pagina = parseInt(paginaClicada, 10);
        // Obtém o elemento que armazena os dados de paginação
        const dadosPaginacao = document.getElementById("dadosPaginacao");
        if (!dadosPaginacao) return; // Se não existir, não faz nada

        // Recupera o filtro atual, total de páginas, controller e id da tabela dos atributos do elemento
        const filtro = dadosPaginacao.getAttribute("data-filtro");
        const totalPaginas = parseInt(dadosPaginacao.getAttribute("data-total-paginas"), 10);
        const controller = dadosPaginacao.getAttribute("data-controller");
        const tabelaId = filtros[0]?.dataset.tabelaId;

        // Impede a navegação se for a primeira página ou se houver filtro e só existir uma página
        if (pagina === 1 || (filtro && filtro.trim().length > 0 && totalPaginas === 1)) {
            e.preventDefault();
            return;
        }

        // Impede o comportamento padrão do link
        e.preventDefault();
        // Chama a função para buscar os dados da nova página via AJAX
        buscarDadosAjax(controller, filtro, pagina, tabelaId);
        // Atualiza a URL do navegador para refletir a nova página e filtro
        const novaUrl = `/${controller}?pagina=${pagina}&filtro=${encodeURIComponent(filtro)}`;
        window.history.pushState({}, '', novaUrl);
    });
});

async function buscarDadosAjax(controller, filtro = "", pagina = 1, tabelaId) {
    try {
        mostrarSpinner();

        const response = await fetch(`/${controller}/BuscarAjax?filtro=${encodeURIComponent(filtro)}&pagina=${pagina}`);
        if (!response.ok) {
            mostrarMensagem("Erro ao buscar dados.");
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

        const dadosPaginacao = document.getElementById("dadosPaginacao");
        if (dadosPaginacao) {
            dadosPaginacao.setAttribute("data-filtro", filtro);
            dadosPaginacao.setAttribute("data-controller", controller);
            dadosPaginacao.setAttribute("data-pagina-atual", pagina);
            if (resultado.totalPaginas) {
                dadosPaginacao.setAttribute("data-total-paginas", resultado.totalPaginas);
            }
        }
    } catch (error) {
        mostrarMensagem("Erro inesperado ao buscar dados.");
        console.error(error);
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
