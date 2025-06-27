document.addEventListener("DOMContentLoaded", function () {
    const filtros = document.querySelectorAll(".filtro-tabela");

    filtros.forEach(input => {
        input.addEventListener("keyup", async function () {
            const filtro = input.value.toLowerCase();
            const controller = input.dataset.controller; // pega direto do input

            if (!controller) {
                console.error("Controller não definido no input filtro-tabela");
                return;
            }

            const response = await fetch(`/${controller}/BuscarAjax?filtro=${encodeURIComponent(filtro)}`);

            if (response.ok) {
                const resultado = await response.json();
                atualizarTabela(resultado.Itens, controller);
            } else {
                console.error("Erro ao buscar dados:", response.status);
            }
        });
    });
});

function atualizarTabela(itens, controller) {
    // Seleciona a tabela pela convenção de id: tabelaClientes, tabelaProdutos, etc
    const tabelaId = `tabela${controller.charAt(0).toUpperCase() + controller.slice(1)}s`; // ex: tabelaClientes
    const tabela = document.querySelector(`#${tabelaId}`);


    if (!tabela) {
        console.error(`Tabela para controller '${controller}' não encontrada.`);
        return;
    }

    const tbody = tabela.querySelector('tbody');
    if (!tbody) {
        console.error('Corpo da tabela (tbody) não encontrado.');
        return;
    }

    // Limpa linhas antigas
    tbody.innerHTML = '';

    // Monta as linhas baseado no controller e dados recebidos
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
                    <td style="display:none;">${item.id}</td>
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
        } else {
            console.warn(`Controller '${controller}' não tem tabela configurada para atualizar.`);
            return;
        }

        tbody.insertAdjacentHTML('beforeend', linha);
    });
}



function mostrarSpinner() {
    $('#spinnerGlobal').show();
}

function esconderSpinner() {
    $('#spinnerGlobal').hide();
}

function mostrarMensagem(mensagem) {
    const classe = 'alert-info';

    const $wrapper = $('#popupMensagemWrapper');
    const $popup = $('#popupMensagemConteudo');

    $popup
        .removeClass()
        .addClass(`alert ${classe} mb-0`)
        .html(mensagem);

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





