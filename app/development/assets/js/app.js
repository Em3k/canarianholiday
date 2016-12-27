console.log("-= Hello from test.js =-");

console.log("-= Hello from main.js =-");


window.addEventListener("load", function(){
  var load_screen = document.getElementById("load_screen");
  document.body.removeChild(load_screen);
});
