// Get the modal
const modal = document.getElementById("modal");
const main = document.getElementById("main");
const chat = document.getElementById("chat");
const nicknameInput = document.getElementById('nickname-input');
const send_nickName = document.getElementById('send_nickName');

nicknameInput.onkeypress = e => {
    let keycode = (e.keyCode ? e.keyCode : e.which);
    if(keycode == '13'){
        modal.style.display = "none";
        main.style.display = "block";
        chat.style.display = "block";
    }
};

send_nickName.onclick = function(){
        modal.style.display = "none";
        main.style.display = "block";
        chat.style.display = "block";
    }
  