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
        success: function () {
            $('#clienteModal').modal('hide');
            //alert('Cliente salvo com sucesso!');
            location.reload(); // depois podemos melhorar só atualizando a tabela via AJAX
        },
        error: function (xhr) {
            alert('Erro ao salvar cliente.');
            console.error(xhr.responseText);
        }
    });
}
