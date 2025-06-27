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
            mostrarMensagem("");
            esconderSpinner();
        },
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
            location.reload();
        },
        error: function (resultado) {
            mostrarMensagem("");
            esconderSpinner();
        }
    });
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
                location.reload();
            },
            error: function () {
                mostrarMensagem("");
                esconderSpinner();
            }
        });
    });
}

