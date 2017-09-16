// Initialize Firebase
    var config = {
      apiKey: "AIzaSyC-odWvTobuYdMzTfmRh7mnFgbfgBHWew8",
      authDomain: "celebridade-90565.firebaseapp.com",
      databaseURL: "https://celebridade-90565.firebaseio.com",
      projectId: "celebridade-90565",
      storageBucket: "celebridade-90565.appspot.com",
      messagingSenderId: "518057020500"
    };
    firebase.initializeApp(config);
    var storage = firebase.storage();
    var database = firebase.database();