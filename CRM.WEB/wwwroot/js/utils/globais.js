document.addEventListener("DOMContentLoaded", function () {
    const paginacaoInfo = document.getElementById("dadosPaginacao");

    if (paginacaoInfo) {
        const paginaAtual = parseInt(paginacaoInfo.dataset.paginaAtual);
        const totalPaginas = parseInt(paginacaoInfo.dataset.totalPaginas);
        const controller = paginacaoInfo.dataset.controller;
        const filtro = paginacaoInfo.dataset.filtro || "";

        atualizarPaginacao(paginaAtual, totalPaginas, controller, filtro);
    }

    const filtros = document.querySelectorAll(".filtro-tabela");
    filtros.forEach(input => {
        input.addEventListener("keyup", async function () {
            const filtro = input.value.toLowerCase();
            const controller = input.dataset.controller;

            if (!controller) {
                console.error("Controller não definido no input filtro-tabela");
                return;
            }

            await buscarDadosAjax(controller, filtro, 1);
        });
    });
});

async function buscarDadosAjax(controller, filtro = "", pagina = 1) {
    try {
        mostrarSpinner();

        const response = await fetch(`/${controller}/BuscarAjax?filtro=${encodeURIComponent(filtro)}&page=${pagina}`);

        if (!response.ok) {
            console.error("Erro ao buscar dados:", response.status);
            return;
        }

        const resultado = await response.json();
        atualizarTabela(resultado.Itens, controller);
        atualizarPaginacao(resultado.PaginaAtual, resultado.TotalPaginas, controller, filtro);
    } catch (error) {
        console.error("Erro na requisição AJAX:", error);
    } finally {
        esconderSpinner();
    }
}

function atualizarTabela(itens, controller) {
    const tabelaId = `tabela${controller.charAt(0).toUpperCase() + controller.slice(1)}s`;
    const tabela = document.querySelector(`#${tabelaId}`);
    if (!tabela) return;

    const tbody = tabela.querySelector('tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    itens.forEach(item => {
        let linha = '';

        if (controller.toLowerCase() === 'cliente') {
            linha = `
                <tr>
                    <td>${item.Nome}</td>
                    <td>${item.Email || ''}</td>
                    <td>${item.Endereco || ''}</td>
                    <td>${item.Telefone || ''}</td>
                    <td class="acao">
                        <button class="btn btn-warning btn-sm me-1" title="Editar" onclick="abrirModalCliente(${item.Id}, false)">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-info btn-sm" title="Visualizar" onclick="abrirModalCliente(${item.Id}, true)">
                            <i class="bi bi-eye"></i>
                        </button>
                    </td>
                </tr>`;
        } else if (controller.toLowerCase() === 'produto') {
            linha = `
                <tr>
                    <td style="display:none;">${item.Id}</td>
                    <td>${item.Nome}</td>
                    <td>R$ ${item.Preco?.toFixed(2) || '0.00'}</td>
                    <td class="acao">
                        <button class="btn btn-warning btn-sm me-1" title="Editar" onclick="abrirModalProduto(${item.Id}, false)">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-info btn-sm me-1" title="Visualizar" onclick="abrirModalProduto(${item.Id}, true)">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" title="Excluir" onclick="excluirProduto(${item.Id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>`;
        }

        tbody.insertAdjacentHTML('beforeend', linha);
    });
}

function atualizarPaginacao(paginaAtual, totalPaginas, controller, filtro) {
    const paginacaoContainer = document.getElementById("paginacao");
    if (!paginacaoContainer) return;

    const paginasPorGrupo = 5;
    const grupoAtual = Math.floor((paginaAtual - 1) / paginasPorGrupo);
    const inicioGrupo = grupoAtual * paginasPorGrupo + 1;
    const fimGrupo = Math.min(inicioGrupo + paginasPorGrupo - 1, totalPaginas);

    let html = '<ul class="pagination justify-content-end">';

    if (paginaAtual > 1) {
        html += `
            <li class="page-item">
                <a class="page-link" href="#" data-page="${paginaAtual - 1}">&laquo;</a>
            </li>`;
    }

    for (let i = inicioGrupo; i <= fimGrupo; i++) {
        html += `
            <li class="page-item ${i === paginaAtual ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>`;
    }

    if (fimGrupo < totalPaginas) {
        html += `
            <li class="page-item">
                <a class="page-link" href="#" data-page="${fimGrupo + 1}">&raquo;</a>
            </li>`;
    }

    html += '</ul>';
    paginacaoContainer.innerHTML = html;

    paginacaoContainer.querySelectorAll("a.page-link").forEach(link => {
        link.addEventListener("click", async function (e) {
            e.preventDefault();
            const novaPagina = parseInt(this.dataset.page);
            await buscarDadosAjax(controller, filtro, novaPagina);
        });
    });
}

function mostrarSpinner() {
    const spinner = document.getElementById('spinnerGlobal');
    if (spinner) spinner.style.display = 'block';
}

function esconderSpinner() {
    const spinner = document.getElementById('spinnerGlobal');
    if (spinner) spinner.style.display = 'none';
}

function mostrarMensagem(mensagem) {
    const classe = 'alert-info';
    const $wrapper = $('#popupMensagemWrapper');
    const $popup = $('#popupMensagemConteudo');

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
