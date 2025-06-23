function abrirModalProduto(id, somenteVisualizacao) {
    var url = '/Produto/ProdutoModal';

    if (id) {
        url += `?id=${id}&somenteVisualizacao=${somenteVisualizacao}`;
    } else {
        url += `?somenteVisualizacao=${somenteVisualizacao}`;
    }

    $.ajax({
        url: url,
        type: 'GET',
        beforeSend: function () {
            mostrarSpinner();
        },
        success: function (response) {
            if (response?.contemErro) {
                mostrarMensagem(response.mensagem);
                esconderSpinner();
                return;
            }
            $('#produtoModalBody').html(response);
            $('#produtoModal').modal({
                backdrop: 'static',
                keyboard: false
            });
            esconderSpinner();
            $('#produtoModal').modal('show');
        },
        error: function (resultado) {
            mostrarMensagem("Erro inesperado no servidor.");
            esconderSpinner();
        }
    });
}

function salvarProduto() {
    var form = $('#formProdutoModal');
    var url = form.attr('action');
    var data = form.serialize();
    debugger;
    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        beforeSend: function () {
            mostrarSpinner();
        },
        success: function (response) {
            if (response?.contemErro) {
                mostrarMensagem(response.mensagem);
                esconderSpinner();
                return;
            }
            $('#produtoModal').modal('hide');
            esconderSpinner();
            location.reload(); // opcional: depois pode substituir por atualização via JS
        },
        error: function (resultado) {
            mostrarMensagem("Erro inesperado no servidor.");
            esconderSpinner();
        }
    });
}

function filtroTabelaProduto() {
    const input = document.getElementById("searchProdutoInput");
    const filter = input.value.toLowerCase();
    const table = document.getElementById("tabelaProdutos");
    const trs = table.getElementsByTagName("tr");

    for (let i = 1; i < trs.length; i++) {
        const tds = trs[i].getElementsByTagName("td");
        let show = false;

        for (let j = 1; j < tds.length - 1; j++) {
            if (tds[j].textContent.toLowerCase().indexOf(filter) > -1) {
                show = true;
                break;
            }
        }

        trs[i].style.display = show ? "" : "none";
    }
}

function excluirProduto(id) {
    confirmarAcao("Tem certeza que deseja excluir este produto?", function (confirmado) {
        if (!confirmado) return;

        $.ajax({
            url: `/Produto/ExcluirProduto`,
            type: 'POST',
            data: { idProduto: id },
            beforeSend: function () {
                mostrarSpinner();
            },
            success: function (response) {
                if (response?.contemErro) {
                    mostrarMensagem(response.mensagem);
                    esconderSpinner();
                    return;
                }
                esconderSpinner();
                location.reload(); // opcional
            },
            error: function () {
                mostrarMensagem("Erro inesperado no servidor.");
                esconderSpinner();
            }
        });
    });
}

