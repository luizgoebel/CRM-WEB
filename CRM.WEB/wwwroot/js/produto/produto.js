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
    const input = document.getElementById("searchProdutoInput").value.toLowerCase();
    const linhas = document.querySelectorAll("#tabelaProdutos tbody tr");

    linhas.forEach(tr => {
        const texto = tr.textContent.toLowerCase();
        tr.style.display = texto.includes(input) ? "" : "none";
    });
}
