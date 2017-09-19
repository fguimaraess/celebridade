var pageProdCliente = {
    tableProduto: document.querySelector('#table-produtos'),
    produtos: [],
    diaDeHoje: document.querySelector('#diaDeHoje'),
    limparCarrinho: document.querySelector('#limparCarrinho'),
    enviarPedido: document.querySelector('#enviarPedido')
}
var htmlCarrinho = '';
var carrinho = [];
var i = 0;
var valorPedido = 0;
var qtdProduto;
var cong;
var frito;

window.addEventListener('load', function () {
    getProd();
    var data = new Date();
    y = data.getFullYear();
    m = data.getMonth() + 1;
    d = data.getDate();
    //pageProdCliente.diaDeHoje.innerHTML = d + "/" + m + "/" + y;
});

function getProd() {
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

function preencheTabelaProduto(produto) {
    var htmlFoto = '<img width="250" height=200" src="' + produto.fotoProduto + '"/>';
    var html = '';
    html += '<p>';
    html += '<tr class="idDosProdutos" id="' + produto.uid + '">';
    html += '<td class="foto">' + htmlFoto + '</td></tr>';
    html += '<tr class="nomeProduto"><td class="text-uppercase my-0"><strong>' + produto.nomeProduto + '</strong></tr>';
    html += '<tr class="pcongelado"><td>Preço congelado: R$' + produto.precoCongelado + '</td></tr>';
    html += '<tr class="pfrito"><td>Preço frito: R$' + produto.precoFrito + '</td></tr>';
    html += '<tr class="quantidade"><td>Pacote com ' + produto.quantidade + ' unidades</td><br/></tr>';
    html += '<td class="comprar"><a target="_blank" href="https://api.whatsapp.com/send?phone=5521964365695&text=' + produto.nomeProduto + '"><i title=' + produto.nomeProduto + ' class="fa fa-whatsapp fa-2x" style="color: green;" aria-hidden="true"></i></a>&nbsp;&nbsp;';
    html += '<a href="tel:5521964365695"><i class="fa fa-phone fa-2x" aria-hidden="true"></i></a>&nbsp;&nbsp;';
    html += '<a onclick="addCompra(\'' + produto.uid + '\' )" href="#" class="add-produto"><i class="fa fa-shopping-cart fa-2x" aria-hidden="true"></i><br/><span style="font-size: 12px;">Adicionar ao carrinho';
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


function addCompra(idProduto) {
    var produto = getProdutoById(idProduto);

    $("#areaCompra").show();
    $("#promocoes").hide();
    htmlCarrinho = '';
    htmlCarrinho += '<tr class="idDosProdutos" id="' + produto.uid + '">';
    htmlCarrinho += '<td class="nomeDoProduto">' + produto.nomeProduto + '</td>';
    htmlCarrinho += '<td class="qtdDoProduto"><input size="2" type="text" id="qtdProduto" value="1"/></td>';
    htmlCarrinho += '<td class="tipoProduto"><select id="tipoProd">';
    htmlCarrinho += '<option value="congelado">Congelado</option>';
    htmlCarrinho += '<option value="frito">Frito</option>';
    htmlCarrinho += '</select></td>';
    //htmlCarrinho += '<td class="valorProduto" id="precoProd">R$' + produto.precoCongelado + '</td>';
    htmlCarrinho += '<td class="confirmar" id="confirmaProduto"><a onclick="addCarrinho(\'' + produto.uid + '\' )" href="#"><i class="fa fa-check fa-2x" aria-hidden="true" style="color:green; cursor: pointer;"></i></a></td>';
    htmlCarrinho += '</tr>';
    $('#body-compra').append(htmlCarrinho);
    qtdProduto = $("#qtdProduto").val();
    cong = qtdProduto * produto.precoCongelado;
    carrinho[produto.uid] = produto;

    //GetValorQuantidade
    $("#qtdProduto").on('change', function () {
        qtdProduto = $("#qtdProduto").val();
        cong = qtdProduto * produto.precoCongelado;
        frito = qtdProduto * produto.precoFrito;
        /*if($('#tipoProd').val() == 'congelado'){
            $("#precoProd").text("R$"+cong);
        } else {
            $("#precoProd").text("R$"+frito);
        }*/
    });

    //GetValorCongelado ou Frito
    $('#tipoProd').on('change', function () {
        qtdProduto = $("#qtdProduto").val();
        cong = qtdProduto * produto.precoCongelado;
        frito = qtdProduto * produto.precoFrito;
        /*if($('#tipoProd').val() == 'congelado'){
            $("#precoProd").text("R$"+cong);
        } else {
            $("#precoProd").text("R$"+frito);
        }*/
    });
    i++;
}

function addCarrinho(idProdutoCarrinho) {
    var tempProd = getProdutoById(idProdutoCarrinho);
    if ($('#tipoProd').val() == 'congelado') {
        carrinho[tempProd.uid].valor = cong;
    } else {
        carrinho[tempProd.uid].valor = frito;
    }
    carrinho[tempProd.uid].qtd = qtdProduto;
    alert("Produto adicionado");
    getValorPedido();
}

function getValorPedido() {
    valorPedido = 0;
    for (var key in carrinho) {
        valorPedido += carrinho[key].valor;
    }
    $("#valorPedido").text(" R$" + valorPedido);
}

pageProdCliente.limparCarrinho.addEventListener('click', function () {
    i = 0;
    valorPedido = 0;
    htmlCarrinho = '';
    carrinho = [];
    $('#body-compra').html("");
    $('#body-compra').html(htmlCarrinho);
    $("#areaCompra").hide();
    $("#promocoes").show();
});

function getProdutoById(idProd) {
    for (var key in pageProdCliente.produtos) {
        if (pageProdCliente.produtos[key].uid == idProd) {
            return pageProdCliente.produtos[key];
        }
    }
}