var page = {
    loginBtn: document.querySelector('#loginUsuario'),
    usuarioField: document.querySelector('#usuario'),
    passField: document.querySelector('#pass-user')
}

page.loginBtn.addEventListener('click', function () {
    var user = firebase.auth().signInWithEmailAndPassword(page.usuarioField.value, page.passField.value).then(function () {
    if(user)
    {
        alert("Bem vindo à Área de Promoção");
        window.location = "/pagepromocao.html";
    }
    });
});