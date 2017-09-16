var page = {
    tablePromocao: document.querySelector('#table-pagina-promoca'),
    promocoes: [],
    diaDeHoje: document.querySelector('#diaDeHoje')
}

window.addEventListener('load', function(){
    getPromocoes();
    var data = new Date();
    y = data.getFullYear();
    m = data.getMonth() + 1;
    d = data.getDate();
    page.diaDeHoje.innerHTML = d + "/" + m + "/" + y;
});

function getPromocoes(){
    limparTabela();
    firebase.database().ref('/promocao/').once('value').then(function (snapshot) {
        snapshot.forEach(function (promocaoRef) {
            var tempPromo = promocaoRef.val();
            tempPromo.uid = promocaoRef.key;
            page.promocoes[promocaoRef.key] = (tempPromo);
            preencheTabelaPromocao(tempPromo);
        });
    });
}

function preencheTabelaPromocao(promocao){
    var html = '';
    html += '<tr class="idDasPromocoes" id="' + promocao.uid + '">';
    html += '<td class="descricaoPromocao">' + promocao.descricao + '</td>';
    html += '<td class="tituloPromocao"><a target="_blank" href="https://api.whatsapp.com/send?phone=5521964365695&text='+promocao.mensagem+'"><i title='+promocao.titulo+' class="fa fa-whatsapp fa-2x" style="color: green;" aria-hidden="true"></i><br/><span style="font-size: 12px;">'+promocao.titulo+'</span></td>';
    html += '</tr>';
    $('#body-pagina-promocao').append(html);
}

function limparTabela() {
    var promocoesNaTela = document.querySelectorAll('.idDasPromocoes');
    promocoesNaTela.forEach(function () {
        page.tablePromocao.querySelector('#body-promocao').innerHTML = '';
    });
}