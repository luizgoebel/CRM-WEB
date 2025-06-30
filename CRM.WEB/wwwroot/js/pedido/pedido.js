function abrirModalPedido(id, somenteVisualizacao) {
    var url = '/Pedido/PedidoModal';

    if (id) {
        url += `?id=${id}&somenteVisualizacao=${somenteVisualizacao}`;
    } else {
        url += `?somenteVisualizacao=${somenteVisualizacao}`;
    }

    $.ajax({
        url: url,
        type: 'GET',
        beforeSend: function () {
            mostrarSpinner()
        },
        success: function (response) {
            if (response?.contemErro) {
                mostrarMensagem(resultado.mensagem);
                esconderSpinner()
                return;
            }
            $('#pedidoModalBody').html(response);
            $('#pedidoModal').modal({
                backdrop: 'static',
                keyboard: false
            });
            esconderSpinner()
            $('#pedidoModal').modal('show');
        },
        error: function (resultado) {
            mostrarMensagem("");
            esconderSpinner()
        }
    });
}

function excluirProduto(id) {
    confirmarAcao("Tem certeza que deseja excluir este produto?", function (confirmado) {
        if (!confirmado) return;

        $.ajax({
            url: `/Pedido/ExcluirPedido`,
            type: 'POST',
            data: { idPedido: id },
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