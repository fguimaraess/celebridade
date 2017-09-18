var pageProdCliente = {
    tableProduto: document.querySelector('#table-produtos'),
    produtos: [],
    diaDeHoje: document.querySelector('#diaDeHoje')
}

window.addEventListener('load', function(){
    getProd();
    var data = new Date();
    y = data.getFullYear();
    m = data.getMonth() + 1;
    d = data.getDate();
    //pageProdCliente.diaDeHoje.innerHTML = d + "/" + m + "/" + y;
});

function getProd(){
    limparTabelaProd();
    firebase.database().ref('/produto/').once('value').then(function (snapshot) {
        snapshot.forEach(function (produtoRef) {
            var tempProd = produtoRef.val();
            tempProd.uid = produtoRef.key;
            pageProdCliente.produtos[produtoRef.key] = (tempProd);
            preencheTabelaProduto(tempProd);
        });
    });
}

function preencheTabelaProduto(produto){
    var htmlFoto = '<img width="250" height=200" src="' + produto.fotoProduto + '"/>';
    var html = '';
    html += '<p>';
    html += '<tr class="idDosProdutos" id="' + produto.uid + '">';
    html += '<td class="foto">' + htmlFoto + '</td></tr>';
    html += '<tr class="nomeProduto"><td class="text-uppercase my-0"><strong>' + produto.nomeProduto + '</strong></tr>';
    html += '<tr class="pcongelado"><td>Preço congelado: R$' + produto.precoCongelado + '</td></tr>';
    html += '<tr class="pfrito"><td>Preço frito: R$' + produto.precoFrito + '</td></tr>';
    html += '<tr class="quantidade"><td>Pacote com ' + produto.quantidade + ' unidades</td><br/></tr>';
    html+= '<td class="comprar"><a target="_blank" href="https://api.whatsapp.com/send?phone=5521964365695&text='+produto.nomeProduto+'"><i title='+produto.nomeProduto+' class="fa fa-whatsapp fa-2x" style="color: green;" aria-hidden="true"></i></a>&nbsp;&nbsp;';
    html+= '<a href="tel:5521964365695"><i class="fa fa-phone fa-2x" aria-hidden="true"></i></a><br/><span style="font-size: 12px;"><a target="_blank" href="https://api.whatsapp.com/send?phone=5521964365695&text='+produto.nomeProduto+'">Faça seu pedido</span></a>';
    html += '</td>';
    html += '</tr><br/>';
    html += '</p>';
    $('#body-produtos').append(html);
}

function limparTabelaProd() {
    var promocoesNaTela = document.querySelectorAll('.idDosProdutos');
    promocoesNaTela.forEach(function () {
        pageProdCliente.tableProduto.querySelector('#body-produtos').innerHTML = '';
    });
}