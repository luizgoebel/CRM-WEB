// Variáveis globais para produtos e clientes carregados da API
let produtosDisponiveis = [];
let clientesDisponiveis = [];

// Função principal para inicializar o modal de pedido
function inicializarModalPedido() {
    carregarDadosPedido()
        .then(() => {
            preencherSelectClientes();
            carregarItensExistentes();
            calcularTotalPedido();
        })
        .catch(() => mostrarMensagem(""));
}

// Busca os dados de produtos e clientes da API
async function carregarDadosPedido() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Pedido/PreencherModalPedido',
            type: "GET",
            beforeSend: mostrarSpinner,
            success: function (data) {
                produtosDisponiveis = data.produtos || [];
                clientesDisponiveis = data.clientes || [];
                esconderSpinner();
                resolve();
            },
            error: function (xhr, status, error) {
                mostrarMensagem("")
                esconderSpinner();
                reject(error);
            }
        });
    });
}

// Preenche o select de clientes
function preencherSelectClientes() {
    const selectCliente = document.getElementById("cliente");
    if (!selectCliente) return;

    const selectedId = selectCliente.dataset.selectedId;
    selectCliente.innerHTML = '<option value="">Selecione um cliente</option>';

    clientesDisponiveis.forEach(cliente => {
        const option = document.createElement("option");
        option.value = cliente.Id;
        option.textContent = cliente.Nome;
        if (selectedId && cliente.Id == selectedId) option.selected = true;
        selectCliente.appendChild(option);
    });
}

// Adiciona um item ao pedido
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
        const selected = item && item.produtoId == p.Id ? "selected" : "";
        return `<option value="${p.Id}" data-preco-unitario="${p.Preco ?? 0}" ${selected}>${p.Nome}</option>`;
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

    // Atualiza preço e total ao adicionar
    const selectProduto = div.querySelector(".produto-select");
    selectProduto.dispatchEvent(new Event("change"));
}

// Remove item do pedido
function removerItemPedido(botao) {
    const row = botao.closest(".row");
    if (row) {
        row.remove();
        calcularTotalPedido();
    }
}

// Listeners do item
function adicionarListenersAoItem(row) {
    const produtoSelect = row.querySelector(".produto-select");
    const quantidadeInput = row.querySelector(".quantidade-input");
    const precoInput = row.querySelector(".preco-unitario-input");
    const precoHidden = row.querySelector(".preco-hidden");

    if (!produtoSelect || !quantidadeInput || !precoInput || !precoHidden) return;

    produtoSelect.addEventListener("change", () => {
        const selectedOption = produtoSelect.selectedOptions[0];
        const preco = parseFloat(selectedOption?.dataset?.precoUnitario || "0") || 0;

        precoInput.value = preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        precoHidden.value = preco;
        calcularTotalPedido();
    });

    quantidadeInput.addEventListener("input", () => {
        if (quantidadeInput.value < 1) quantidadeInput.value = 1;
        calcularTotalPedido();
    });
}

// Carrega itens do pedido (modo edição)
function carregarItensExistentes() {
    const hidden = document.getElementById("itensPedidoJson");
    if (!hidden || !hidden.value) return;

    let itens = [];
    try {
        itens = JSON.parse(hidden.value);
    } catch (error) {
        mostrarMensagem("");
        return;
    }

    itens.forEach(item => adicionarItemPedido({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario
    }));
}

// Soma total do pedido
function calcularTotalPedido() {
    console.log("Recalculando total...");

    let total = 0;

    document.querySelectorAll("#listaItensPedido .row").forEach(row => {
        const preco = parseFloat(row.querySelector(".preco-hidden")?.value || "0");
        const quantidade = parseInt(row.querySelector(".quantidade-input")?.value || "0");
        total += preco * quantidade;
    });

    const inputTotal = document.getElementById("valorTotalPedido");
    if (inputTotal) {
        inputTotal.value = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }
}

// Abre o modal de pedido
function abrirModalPedido(id, somenteVisualizacao) {
    let url = '/Pedido/PedidoModal';
    url += id ? `?id=${id}&somenteVisualizacao=${somenteVisualizacao}` : `?somenteVisualizacao=${somenteVisualizacao}`;

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
            $('#pedidoModal').modal({ backdrop: 'static', keyboard: false });
            esconderSpinner();
            $('#pedidoModal').modal('show');
            inicializarModalPedido();
        },
        error: function () {
            mostrarMensagem("");
            esconderSpinner();
        }
    });
}

// Exclui pedido
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
                mostrarMensagem("");
                esconderSpinner();
            }
        });
    });
}
