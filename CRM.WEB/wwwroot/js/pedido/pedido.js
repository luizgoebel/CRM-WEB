// Variáveis globais para produtos e clientes carregados da API
let produtosDisponiveis = [];
let clientesDisponiveis = [];

/**
 * Função principal para inicializar o modal de pedido
 * Deve ser chamada *depois* que o modal foi carregado via AJAX e está no DOM
 */
function inicializarModalPedido() {
    carregarDadosPedido()
        .then(() => {
            preencherSelectClientes();
            carregarItensExistentes();
            calcularTotalPedido();
        })
        .catch(() => mostrarMensagem("Erro ao carregar dados do pedido."));
}

/**
 * Busca os dados de produtos e clientes da API para popular selects
 */
async function carregarDadosPedido() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Pedido/PreencherModalPedido',
            type: "GET",
            beforeSend: function () {
                mostrarSpinner();
            },
            success: function (data) {
                produtosDisponiveis = data.produtos || [];
                clientesDisponiveis = data.clientes || [];
                esconderSpinner();
                resolve();
            },
            error: function (xhr, status, error) {
                console.error("Erro ao carregar dados do pedido:", error);
                esconderSpinner();
                reject(error);
            }
        });
    });
}



/**
 * Preenche o select de clientes com os dados obtidos
 */
function preencherSelectClientes() {
    const selectCliente = document.getElementById("cliente");
    if (!selectCliente) return;

    const selectedId = selectCliente.dataset.selectedId;

    // Limpa options anteriores, exceto o placeholder
    selectCliente.innerHTML = '<option value="">Selecione um cliente</option>';

    clientesDisponiveis.forEach(cliente => {
        const option = document.createElement("option");
        option.value = cliente.id;
        option.textContent = cliente.nome;
        if (selectedId && cliente.id == selectedId) option.selected = true;
        selectCliente.appendChild(option);
    });
}

/**
 * Adiciona um novo item de pedido no formulário
 * Pode receber um objeto 'item' para preencher os campos, para edição
 */
function adicionarItemPedido(item = null) {
    const container = document.getElementById("listaItensPedido");
    if (!container) return;

    const index = container.children.length;

    const div = document.createElement("div");
    div.classList.add("row", "mb-2");
    div.innerHTML = `
        <div class="col-5">
            <select class="form-select produto-select" name="Itens[${index}].ProdutoId" data-index="${index}">
                <option value="">Selecione o produto</option>
                ${produtosDisponiveis.map(p => {
        const selected = item && item.produtoId == p.id ? "selected" : "";
        return `<option value="${p.id}" data-preco="${p.precoUnitario}" ${selected}>${p.nome}</option>`;
    }).join("")}
            </select>
        </div>
        <div class="col-2">
            <input type="number" name="Itens[${index}].Quantidade" class="form-control quantidade-input" min="1" value="${item?.quantidade || 1}" />
        </div>
        <div class="col-3">
            <input type="text" class="form-control preco-unitario-input" readonly />
            <input type="hidden" name="Itens[${index}].PrecoUnitario" class="preco-hidden" value="${item?.precoUnitario || 0}" />
        </div>
        <div class="col-2 d-flex align-items-center">
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="removerItemPedido(this)">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;

    container.appendChild(div);

    adicionarListenersAoItem(div);

    // Se vier com item preenchido, dispara o evento change para atualizar preço e total
    const selectProduto = div.querySelector(".produto-select");
    selectProduto.dispatchEvent(new Event("change"));
}

/**
 * Remove o item do pedido e recalcula o total
 */
function removerItemPedido(botao) {
    const row = botao.closest(".row");
    if (row) {
        row.remove();
        calcularTotalPedido();
    }
}

/**
 * Adiciona os eventos necessários para reagir a mudanças no produto ou quantidade
 */
function adicionarListenersAoItem(row) {
    const produtoSelect = row.querySelector(".produto-select");
    const quantidadeInput = row.querySelector(".quantidade-input");
    const precoInput = row.querySelector(".preco-unitario-input");
    const precoHidden = row.querySelector(".preco-hidden");

    if (!produtoSelect || !quantidadeInput || !precoInput || !precoHidden) return;

    produtoSelect.addEventListener("change", () => {
        const selectedOption = produtoSelect.selectedOptions[0];
        const preco = parseFloat(selectedOption?.dataset?.preco || "0");
        precoInput.value = preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        precoHidden.value = preco;
        calcularTotalPedido();
    });

    quantidadeInput.addEventListener("input", () => {
        if (quantidadeInput.value < 1) quantidadeInput.value = 1;
        calcularTotalPedido();
    });
}

/**
 * Carrega os itens já existentes no pedido (para edição)
 * Pega os dados do input hidden 'itensPedidoJson' que vem do servidor
 */
function carregarItensExistentes() {
    const hidden = document.getElementById("itensPedidoJson");
    if (!hidden || !hidden.value) return;

    let itens = [];
    try {
        itens = JSON.parse(hidden.value);
    } catch (error) {
        console.error("Erro ao parsear itens do pedido:", error);
        return;
    }

    itens.forEach(item => adicionarItemPedido({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario
    }));
}

/**
 * Calcula o valor total do pedido somando todos os itens
 */
function calcularTotalPedido() {
    let total = 0;

    document.querySelectorAll("#listaItensPedido .row").forEach(row => {
        const preco = parseFloat(row.querySelector(".preco-hidden")?.value || "0");
        const quantidade = parseInt(row.querySelector(".quantidade-input")?.value || "0");
        total += preco * quantidade;
    });

    const inputTotal = document.querySelector("input[readonly]");
    if (inputTotal) {
        inputTotal.value = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }
}

/**
 * Função para abrir o modal de pedido
 * Chama a controller, carrega partial e inicializa tudo
 */
function abrirModalPedido(id, somenteVisualizacao) {
    let url = '/Pedido/PedidoModal';

    if (id) {
        url += `?id=${id}&somenteVisualizacao=${somenteVisualizacao}`;
    } else {
        url += `?somenteVisualizacao=${somenteVisualizacao}`;
    }

    $.ajax({
        url: url,
        type: 'GET',
        beforeSend: mostrarSpinner,
        success: function (response) {
            if (response?.contemErro) {
                mostrarMensagem(response.mensagem);
                esconderSpinner();
                return;
            }

            $('#pedidoModalBody').html(response);
            $('#pedidoModal').modal({
                backdrop: 'static',
                keyboard: false
            });
            esconderSpinner();
            $('#pedidoModal').modal('show');

            // Inicializa a lógica do modal depois que ele já está no DOM
            inicializarModalPedido();
        },
        error: function () {
            mostrarMensagem("Erro ao carregar modal de pedido.");
            esconderSpinner();
        }
    });
}

/**
 * Excluir pedido (evento de botão)
 */
function excluirPedido(id) {
    confirmarAcao("Tem certeza que deseja excluir este pedido?", function (confirmado) {
        if (!confirmado) return;

        $.ajax({
            url: `/Pedido/ExcluirPedido`,
            type: 'POST',
            data: { idPedido: id },
            beforeSend: mostrarSpinner,
            success: function (response) {
                if (response?.contemErro) {
                    mostrarMensagem(response.mensagem);
                    esconderSpinner();
                    return;
                }
                esconderSpinner();
                location.reload();
            },
            error: function () {
                mostrarMensagem("Erro ao excluir pedido.");
                esconderSpinner();
            }
        });
    });
}
