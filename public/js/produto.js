var pageProdCliente = {
    tableProduto: document.querySelector('#table-produtos'),
    produtos: [],
    diaDeHoje: document.querySelector('#diaDeHoje'),
    limparCarrinho: document.querySelector('#limparCarrinho'),
    enviarPedido: document.querySelector('#enviarPedido'),
    tableCompra: document.querySelector('#table-compra')
}
var htmlCarrinho = '';
var carrinho = [];
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
    if (produto.ativo) {
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

    //Verifica se já existe o produto no carrinho
    if (carrinho[produto.uid]) {
        alert("O produto já foi adicionado ao carrinho!");
    } else {
        htmlCarrinho = '';
        htmlCarrinho += '<tr class="idDosProdutosCarrinho" id="' + produto.uid + '">';
        htmlCarrinho += '<td class="nomeDoProduto">' + produto.nomeProduto + '</td>';
        htmlCarrinho += '<td class="qtdDoProduto-"><select id="qtdProduto' + produto.uid + '">';
        htmlCarrinho += '<option value="1">1</option>';
        htmlCarrinho += '<option value="2">2</option>';
        htmlCarrinho += '<option value="3">3</option>';
        htmlCarrinho += '<option value="4">4</option>';
        htmlCarrinho += '<option value="5">5</option>';
        htmlCarrinho += '<option value="6">6</option>';
        htmlCarrinho += '<option value="7">7</option>';
        htmlCarrinho += '<option value="8">8</option>';
        htmlCarrinho += '<option value="9">9</option>';
        htmlCarrinho += '<option value="10">10</option>';
        htmlCarrinho += '</select></td>';
        htmlCarrinho += '<td class="tipoProduto"><select id="tipoProd' + produto.uid + '">';
        htmlCarrinho += '<option value="congelado">Congelado</option>';
        htmlCarrinho += '<option value="frito">Frito</option>';
        htmlCarrinho += '</select></td>';
        htmlCarrinho += '<td class="confirmar" id="confirmaProduto">&nbsp;&nbsp;<a onclick="addCarrinho(\'' + produto.uid + '\' )" href="#"><i class="fa fa-check" aria-hidden="true" style="color:green; cursor: pointer;"></i> Adicionar</a></td>';
        htmlCarrinho += '</tr>';
        $('#body-compra').append(htmlCarrinho);
        qtdProduto = $("#qtdProduto" + produto.uid).val();
        cong = qtdProduto * produto.precoCongelado;
    }
    carrinho[produto.uid] = produto;
}

function addCarrinho(idProdutoCarrinho) {
    var tempProd = getProdutoById(idProdutoCarrinho);
    tempProd.valor = 0;

    if ($('#tipoProd' + tempProd.uid).val() == 'congelado') {
        qtdProduto = $("#qtdProduto" + tempProd.uid).val();
        cong = qtdProduto * tempProd.precoCongelado;
        carrinho[tempProd.uid].valor = cong;
        carrinho[tempProd.uid].tipo = 'congelado(s)';
    } else {
        qtdProduto = $("#qtdProduto" + tempProd.uid).val();
        frito = qtdProduto * tempProd.precoFrito;
        carrinho[tempProd.uid].valor = frito;
        carrinho[tempProd.uid].tipo = 'frito(s)';
    }
    carrinho[tempProd.uid].qtd = qtdProduto;
    alert("Produto adicionado");
    getValorPedido();
}

function getValorPedido() {
    valorPedido = 0;
    if (carrinho.pedido)
        delete carrinho.pedido;
    for (var key in carrinho) {
        valorPedido += carrinho[key].valor;
    }
    if (isNaN(valorPedido)) {
        $("#valorPedido").text(" Adicione todos os produtos ao pedido");
    } else {
        $("#valorPedido").text(" R$" + valorPedido);
    }
}

pageProdCliente.enviarPedido.addEventListener('click', function () {
    var msgWpp;
    var pedido = [];
    if (valorPedido == 0 || isNaN(valorPedido)) {
        alert("Adicione os produtos ao carrinho!");
    } else {
        msgWpp = 'Olá, segue o pedido realizado através do site:\n';
        for (var key in carrinho) {
            if (carrinho[key].valor == undefined) {
                carrinho.pedido = 'Erro';
            } else {
                carrinho.pedido = 'Ok';
                msgWpp += ' - ' + carrinho[key].qtd + ' pacote(s) de ' + carrinho[key].nomeProduto + ' ' + carrinho[key].tipo + '\n';
                pedido[carrinho[key].uid] = carrinho[key];
                delete pedido[carrinho[key].uid].fotoProduto;
                delete pedido[carrinho[key].uid].precoFrito;
                delete pedido[carrinho[key].uid].precoCongelado;
                delete pedido[carrinho[key].uid].quantidade;
            }
        }
        if (carrinho.pedido == 'Erro') {
            alert("Adicione os produtos ao carrinho!");
        } else {
            msgWpp += ';\n   Valor total do pedido: R$' + valorPedido;
            pedido.valortotal = valorPedido;
            firebase.database().ref('/pedido/').push(pedido).then(alert("Pedido criado com sucesso!!"));
            enviarPedidoWpp(msgWpp);
            limparCarrinho();
        }
    }
});

function enviarPedidoWpp(msgWpp) {
    window.open('https://api.whatsapp.com/send?phone=5521964365695&text=' + msgWpp);
}

pageProdCliente.limparCarrinho.addEventListener('click', function () {
    limparCarrinho();
});

function limparCarrinho() {
    valorPedido = 0;
    msgWpp = "";
    $("#valorPedido").text("");
    htmlCarrinho = '';
    carrinho = [];
    $('#body-compra').html("");
    $('#body-compra').html(htmlCarrinho);
    $("#areaCompra").hide();
    $("#promocoes").show();
}

function getProdutoById(idProd) {
    for (var key in pageProdCliente.produtos) {
        if (pageProdCliente.produtos[key].uid == idProd) {
            return pageProdCliente.produtos[key];
        }
    }
}