function mostrarSpinner() {
    $('#spinnerGlobal').show();
}

function esconderSpinner() {
    $('#spinnerGlobal').hide();
}

function mostrarMensagem(mensagem) {
     const classe = 'alert-info';

    const $wrapper = $('#popupMensagemWrapper');
    const $popup = $('#popupMensagemConteudo');

    $popup
        .removeClass()
        .addClass(`alert ${classe} mb-0`)
        .html(mensagem);

    $wrapper.show();

    $('#btnFecharPopup').off('click').on('click', function () {
        $wrapper.hide();
    });
}

function confirmarAcao(mensagem, callback) {
    $('#popupConfirmacaoConteudo').text(mensagem || 'Deseja confirmar esta ação?');
    $('#popupConfirmacaoWrapper').fadeIn(150);

    function fechar() {
        $('#popupConfirmacaoWrapper').fadeOut(150);
        $('#btnConfirmarSim').off('click');
        $('#btnConfirmarNao').off('click');
        $('#btnFecharPopupConfirmacaoTopo').off('click');
    }

    $('#btnConfirmarSim').on('click', function () {
        fechar();
        if (typeof callback === 'function') callback(true);
    });

    $('#btnConfirmarNao, #btnFecharPopupConfirmacaoTopo').on('click', function () {
        fechar();
        if (typeof callback === 'function') callback(false);
    });
}
function filtrarTabela(inputId, tabelaId) {
    const input = document.getElementById(inputId);
    const filtro = input.value.toLowerCase();
    const linhas = document.querySelectorAll(`#${tabelaId} tbody tr`);

    linhas.forEach(tr => {
        const texto = tr.textContent.toLowerCase();
        tr.style.display = texto.includes(filtro) ? "" : "none";
    });
}



