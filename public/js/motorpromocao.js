var page = {
    btnCriar: document.querySelector('#criarpromocao'),
    tituloPromocao: document.querySelector('#titulo-promocao'),
    descricaoPromocao: document.querySelector('#descricao-promocao'),
    mensagemPromocao: document.querySelector('#mensagem-promocao'),
    promocoes: [],
    criarPromocao: document.querySelector('#criarNovaPromocao'),
    voltarPagePromocao: document.querySelector('#voltar'),
    tablePromocao: document.querySelector('#table-promocao')
}

window.addEventListener('load', function(){
    getPromocoes();
});

page.btnCriar.addEventListener('click', function(){
    var promocao = {
        titulo: page.tituloPromocao.value,
        descricao: page.descricaoPromocao.value,
        mensagem: page.mensagemPromocao.value
    }
    if(promocao.titulo != "" && promocao.descricao != "" && promocao.mensagem != "")
    {
        firebase.database().ref('/promocao/').push(promocao).then(function(promocaoRef){
            promocao.uid = promocaoRef.key;
            page.promocoes[promocaoRef.key] = (promocao);
        }).then(alert("Promocao criada com sucesso!!"));
        $("#table-promocao").show();
        $("#criapromo").hide();
        getPromocoes();
    }
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
    html += '<td class="tituloPromocao">' + promocao.titulo + '</td>';
    html += '<td class="descricaoPromocao">' + promocao.descricao + '</td>';
    html += '<td class="mensagemPromocao">' + promocao.mensagem + '</td>';
    html += '<td><a onclick="excluirPromocao(\'' + promocao.uid + '\' )" href="#" class="excluir-promocao"><i class="fa fa-trash-o fa-2x" style="color: White;" aria-hidden="true"></i></td>';
    html += '</tr>';
    $('#body-promocao').append(html);
}

function excluirPromocao(idPromocao){
    firebase.database().ref('/promocao/'+idPromocao).remove().then(alert("Promocao excluída com sucesso!!"));
    getPromocoes();
}

function limparTabela() {
    var promocoesNaTela = document.querySelectorAll('.idDasPromocoes');
    promocoesNaTela.forEach(function () {
        page.tablePromocao.querySelector('#body-promocao').innerHTML = '';
    });
}

page.criarPromocao.addEventListener('click', function(){
    $("#table-promocao").hide();
    $("#criapromo").show();
});

page.voltarPagePromocao.addEventListener('click', function(){
    $("#table-promocao").show();
    $("#criapromo").hide();
});