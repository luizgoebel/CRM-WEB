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