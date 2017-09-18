var pageProduto = {
    btnCriarProduto: document.querySelector('#btnCriarProduto'),
    fotoProduto: document.querySelector('#foto-produto'),
    nomeProduto: document.querySelector('#nome-produto'),
    precoCongelado: document.querySelector('#precoCongelado'),
    precoFrito: document.querySelector('#precoFrito'),
    quantidade: document.querySelector('#quantidade'),
    produtos: [],
    criarNovoProduto: document.querySelector('#criarNovoProduto'),
    voltarPageProduto: document.querySelector('#voltarProduto'),
    tableProduto: document.querySelector('#table-produto'),
    uploader: document.querySelector('#uploader'),
    fileButton: document.querySelector('#fileButton'),
    mostraFoto: document.querySelector('#mostra-foto')
}


pageProduto.btnCriarProduto.addEventListener('click', function () {
    var produto = {
        fotoProduto: pageProduto.fotoProduto,
        nomeProduto: pageProduto.nomeProduto.value,
        precoCongelado: pageProduto.precoCongelado.value,
        precoFrito: pageProduto.precoFrito.value,
        quantidade: pageProduto.quantidade.value
    }
    if (pageProduto.nomeProduto.value != "" && pageProduto.precoCongelado.value != "" && 
    pageProduto.precoFrito.value != "" && pageProduto.fotoProduto.value != "" && pageProduto.quantidade.value != "") {
        criarProduto(produto);
    } else {
        alert("Preencha os campos!");
    }
});

function criarProduto(produto){
    firebase.database().ref('/produto/').push(produto).then(function (produtoRef) {
            produto.uid = produtoRef.key;
            pageProduto.produtos[produtoRef.key] = (produto);
        }).then(alert("Produto criado com sucesso!!"));
        $("#table-produto").show();
        $("#criarproduto").hide();
        getProdutos();
}

window.addEventListener('load', function () {
    getProdutos();
    var user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            window.location = '/loginpromocao.html';
        }
    });
});

function getProdutos() {
    limparTabela();
    firebase.database().ref('/produto/').once('value').then(function (snapshot) {
        snapshot.forEach(function (produtoRef) {
            var tempProd = produtoRef.val();
            tempProd.uid = produtoRef.key;
            pageProduto.produtos[produtoRef.key] = (tempProd);
            preencheTabelaProduto(tempProd);
        });
    });
}

function preencheTabelaProduto(produto) {
    var html = '';
    if(produto.fotoProduto)
    {
        var htmlFoto = '<img width="50" height=40" src="' + produto.fotoProduto + '"/>';
        html += '<tr class="idDosProdutos" id="' + produto.uid + '">';
        html += '<td class="fotoProduto">' + htmlFoto + '</td>';
        html += '<td class="nomeProduto">' + produto.nomeProduto + '</td>';
        html += '<td class="precoCongelado">' + produto.precoCongelado + '</td>';
        html += '<td class="precoFrito">' + produto.precoFrito + '</td>';
        html += '<td class="quantidadeProduto">' + produto.quantidade + '</td>';
        html += '<td><a onclick="excluirProduto(\'' + produto.uid + '\' )" href="#" class="excluir-produto"><i class="fa fa-trash-o fa-2x" style="color: White;" aria-hidden="true"></i></td>';
        html += '</tr>';
        $('#body-produto').append(html);
    }
}

function excluirProduto(idProduto) {
    firebase.database().ref('/produto/' + idProduto).remove().then(alert("Produto excluído com sucesso!!"));
    getProdutos();
}

function limparTabela() {
    var produtosNaTela = document.querySelectorAll('.idDosProdutos');
    produtosNaTela.forEach(function () {
        pageProduto.tableProduto.querySelector('#body-produto').innerHTML = '';
    });
}

pageProduto.criarNovoProduto.addEventListener('click', function () {
    $("#table-produto").hide();
    $("#criarproduto").show();
});

pageProduto.voltarPageProduto.addEventListener('click', function () {
    $("#table-produto").show();
    $("#criarproduto").hide();
});

//Upload foto
pageProduto.fileButton.addEventListener('change', function (e) {
    //Pega o arquivo
    var file = e.target.files[0];
    //Referencia Storage
    var storageRef = firebase.storage().ref('produtos/' + file.name);
    //Enviar
    var task = storageRef.put(file);
    //Atualiza progress bar
    task.on('state_changed', function progress(snapshot) {
        var porcentagem = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        pageProduto.uploader.value = porcentagem;
        if (porcentagem == 100) {
            alert('Sucesso!', "", "success");
        }
        var fotoProduto = task.snapshot.downloadURL;
        pageProduto.fotoProduto = fotoProduto;
        pageProduto.mostraFoto.innerHTML = '<input width="150" height="100" type="image" src="' + fotoProduto + '">';
    }, function error(err) {
        console.log(err);
    })
})