// Variáveis globais para produtos e clientes carregados da API
let produtosDisponiveis = [];
let clientesDisponiveis = [];


//Função principal para inicializar o modal de pedido
async function inicializarModalPedido() {
    try {
        await carregarDadosPedido();
        preencherSelectClientes();
        carregarItensExistentes();
        calcularTotalPedido();
        inicializarAutocompletes();
    } catch {
        mostrarMensagem("");
    }
}


//Busca os dados de produtos e clientes da API
async function carregarDadosPedido() {
    mostrarSpinner();
    try {
        const response = await fetch('/Pedido/PreencherModalPedido');
        if (!response.ok) mostrarMensagem("");
        const data = await response.json();

        produtosDisponiveis = data.produtos || [];
        clientesDisponiveis = data.clientes || [];
    } finally {
        esconderSpinner();
    }
}

//Preenche o select de clientes
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

//Adiciona um item ao pedido
function adicionarItemPedido(item = null, somenteVisualizacao = false) {
    const container = document.getElementById("listaItensPedido");
    if (!container) return;

    const index = container.children.length;
    const produto = produtosDisponiveis.find(p => p.Id === item?.produtoId);
    const nomeProduto = produto ? produto.Nome : "(produto removido)";
    const preco = item?.precoUnitario || 0;
    const quantidade = item?.quantidade || 1;
    const subtotal = preco * quantidade;

    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>
            ${nomeProduto}
            <input type="hidden" name="Itens[${index}].ProdutoId" value="${item?.produtoId}" />
            <input type="hidden" name="Itens[${index}].PrecoUnitario" value="${preco}" class="preco-hidden" />
        </td>
        <td>
            <input type="number" name="Itens[${index}].Quantidade" 
                   class="form-control form-control-sm quantidade-input" 
                   min="1" value="${quantidade}" ${somenteVisualizacao ? "disabled" : ""} />
        </td>
        <td>${preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
        <td class="subtotal-cell">${subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
        ${somenteVisualizacao ? "" : `
        <td class="text-center">
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="removerItemPedido(this)">
                <i class="bi bi-trash"></i>
            </button>
        </td>`}
    `;

    container.appendChild(tr);
    adicionarListenersAoItem(tr);
    calcularTotalPedido();
}

//Remove item do pedido
function removerItemPedido(botao) {
    const row = botao.closest("tr");
    if (row) {
        row.remove();
        calcularTotalPedido();
    }
}

//Listeners do item
function adicionarListenersAoItem(row) {
    const quantidadeInput = row.querySelector(".quantidade-input");
    const precoHidden = row.querySelector(".preco-hidden");
    const subtotalCell = row.querySelector(".subtotal-cell");

    if (!quantidadeInput || !precoHidden || !subtotalCell) return;

    quantidadeInput.addEventListener("input", () => {
        let quantidade = parseInt(quantidadeInput.value);
        if (quantidade < 1 || isNaN(quantidade)) {
            quantidade = 1;
            quantidadeInput.value = 1;
        }

        const preco = parseFloat(precoHidden.value || "0");
        const subtotal = preco * quantidade;

        subtotalCell.textContent = subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        calcularTotalPedido();
    });
}

//Carrega itens do pedido (modo edição)
function carregarItensExistentes() {
    const itensPedidoJson = document.getElementById("itensPedidoJson");
    const somenteVisualizacao = itensPedidoJson.dataset.visualizacao?.toLowerCase() === "true";
    if (!itensPedidoJson || !itensPedidoJson.value) return;

    let itens = [];
    try {
        itens = JSON.parse(itensPedidoJson.value);
    } catch (error) {
        mostrarMensagem("");
        return;
    }

    itens.forEach(item => adicionarItemPedido({
        produtoId: item.ProdutoId,
        quantidade: item.Quantidade,
        precoUnitario: item.PrecoUnitario
    },
        somenteVisualizacao));
}


//Soma total do pedido
function calcularTotalPedido() {
    let total = 0;

    document.querySelectorAll("#listaItensPedido tr").forEach(row => {
        const preco = parseFloat(row.querySelector(".preco-hidden")?.value || "0");
        const quantidade = parseInt(row.querySelector(".quantidade-input")?.value || "0");
        total += preco * quantidade;
    });

    const inputTotal = document.getElementById("valorTotalPedido");
    if (inputTotal) {
        inputTotal.value = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }
}

//Abre o modal de pedido (async/await, spinner até tudo pronto)
async function abrirModalPedido(id, somenteVisualizacao) {
    mostrarSpinner();

    try {
        let url = '/Pedido/PedidoModal';
        url += id ? `?id=${id}&somenteVisualizacao=${somenteVisualizacao}` : `?somenteVisualizacao=${somenteVisualizacao}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro ao carregar modal");

        const html = await response.text();

        document.getElementById('pedidoModalBody').innerHTML = html;

        await inicializarModalPedido();

        $('#pedidoModal').modal({ backdrop: 'static', keyboard: false });
        $('#pedidoModal').modal('show');
    } catch (error) {
        mostrarMensagem("");
    } finally {
        esconderSpinner();
    }
}

//Exclui pedido
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

//Inicializa autocomplete de cliente e produto
function inicializarAutocompletes() {
    const clienteInput = document.getElementById("clienteBusca");
    const clienteHidden = document.getElementById("clienteId");
    const sugestoesCliente = document.getElementById("sugestoesCliente");

    clienteInput?.addEventListener("input", () => {
        const termo = clienteInput.value.toLowerCase();
        sugestoesCliente.innerHTML = "";

        if (!termo || termo.length < 2) return;

        const resultados = clientesDisponiveis.filter(c =>
            c.Nome.toLowerCase().includes(termo)
        ).slice(0, 10);

        resultados.forEach(c => {
            const div = document.createElement("div");
            div.textContent = c.Nome;
            div.addEventListener("click", () => {
                clienteInput.value = c.Nome;
                clienteHidden.value = c.Id;
                sugestoesCliente.innerHTML = "";
            });
            sugestoesCliente.appendChild(div);
        });
    });

    document.addEventListener("click", e => {
        if (!sugestoesCliente.contains(e.target) && e.target !== clienteInput) {
            sugestoesCliente.innerHTML = "";
        }
    });

    const produtoInput = document.getElementById("produtoBusca");
    const sugestoesProduto = document.getElementById("sugestoesProduto");

    produtoInput?.addEventListener("input", () => {
        const termo = produtoInput.value.toLowerCase();
        sugestoesProduto.innerHTML = "";

        if (!termo || termo.length < 2) return;

        const resultados = produtosDisponiveis.filter(p =>
            p.Nome.toLowerCase().includes(termo)
        ).slice(0, 10);

        resultados.forEach(p => {
            const div = document.createElement("div");
            div.textContent = `${p.Nome} - ${p.Preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;
            div.addEventListener("click", () => {
                adicionarItemPedido({
                    produtoId: p.Id,
                    quantidade: 1,
                    precoUnitario: p.Preco
                });
                produtoInput.value = "";
                sugestoesProduto.innerHTML = "";
            });
            sugestoesProduto.appendChild(div);
        });
    });

    document.addEventListener("click", e => {
        if (!sugestoesProduto.contains(e.target) && e.target !== produtoInput) {
            sugestoesProduto.innerHTML = "";
        }
    });
}

//Salva o pedido
function salvarPedido() {
    const pedido = {
        Id: $('input[name="Id"]').val() || null,
        ClienteId: $('#clienteId').val(),
        Itens: []
    };

    $('#listaItensPedido tr').each(function () {
        const produtoId = $(this).find('input[name*="ProdutoId"]').val();
        const quantidade = parseInt($(this).find('input[name*="Quantidade"]').val());

        if (produtoId) {
            pedido.Itens.push({
                ProdutoId: produtoId,
                Quantidade: quantidade,
            });
        }
    });

    $.ajax({
        url: '/Pedido/SalvarPedido',
        type: 'POST',
        data: pedido,
        beforeSend: function () {
            mostrarSpinner();
        },
        success: function (response) {
            if (response?.contemErro) {
                mostrarMensagem(response.mensagem);
                esconderSpinner();
                return;
            }

            $('#pedidoModal').modal('hide');
            esconderSpinner();
            location.reload();
        },
        error: function () {
            mostrarMensagem("");
            esconderSpinner();
        }
    });
}

