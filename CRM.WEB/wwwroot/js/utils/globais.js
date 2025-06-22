function mostrarSpinner() {
    $('#spinnerGlobal').show();
}

function esconderSpinner() {
    $('#spinnerGlobal').hide();
}

function mostrarMensagem(mensagem) {
     const classe = 'alert-info';

    const $wrapper = $('#popupMensagemWrapper');
    const $popup = $('#popupMensagem');

    $popup
        .removeClass()
        .addClass(`alert ${classe} mb-0`)
        .html(mensagem);

    $wrapper.show();

    $('#btnFecharPopup').off('click').on('click', function () {
        $wrapper.hide();
    });
}

