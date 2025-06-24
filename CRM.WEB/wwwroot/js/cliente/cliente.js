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
            mostrarMensagem("Erro inesperado no servidor.");
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
            mostrarMensagem("Erro inesperado no servidor.");
            esconderSpinner();
        }
    });
}
function filtroTabelaCliente() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toLowerCase();
    const table = document.getElementById("tabelaClientes");
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

