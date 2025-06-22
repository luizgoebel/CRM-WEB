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
        success: function (html) {
            $('#clienteModalBody').html(html);
            $('#clienteModal').modal('show');
        },
        error: function (xhr, status, error) {
            alert("Erro ao carregar o conteúdo do modal.");
            console.error(error);
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
            location.reload();
        },
        error: function (resultado) {
            mostrarMensagem(resultado.mensagem);
            esconderSpinner()
        }
    });
}
