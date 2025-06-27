function abrirModalCliente(id, somenteVisualizacao) {
    var url = '/Cliente/ClienteModal';

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
            $('#clienteModalBody').html(response);
            $('#clienteModal').modal({
                backdrop: 'static',
                keyboard: false
            });
            esconderSpinner()
            $('#clienteModal').modal('show');
        },
        error: function (resultado) {
            mostrarMensagem("");
            esconderSpinner()
        }
    });
}

function salvarCliente() {
    var form = $('#formClienteModal');
    var url = form.attr('action');
    var data = form.serialize();

    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        beforeSend: function () {
            mostrarSpinner()
        },
        success: function (response) {
            if (response?.contemErro) {
                mostrarMensagem(response.mensagem);
                esconderSpinner()
                return;
            }
            $('#clienteModal').modal('hide');
            esconderSpinner()
            location.reload();
        },
        error: function (resultado) {
            mostrarMensagem("");
            esconderSpinner();
        }
    });
}

