
$(function () {

    let socket = io.connect('');
    let message = $("#message");
    let send_message = $("#send_message");
    let chatroom = $("#chatroom");
    let feedback = $("#feedback");
    let usersList = $("#users-list");
    let nickName = $("#nickname-input");
    let send_nickName = $("#send_nickName");
    send_message.click(function () {
        socket.emit('new_message', { message: message.val() })
    });

    message.keypress(e => {
        let keycode = (e.keyCode ? e.keyCode : e.which);
        if (keycode == '13') {
            socket.emit('new_message', { message: message.val() })
        }
    })

    socket.on("new_message", (data) => {
        feedback.html('');
        message.val('');
        chatroom.append(`
                          <div >
                            <p  class="chat-text-user">${data.username} - </p>
                            <p  class="chat-text-date">${data.date}</p>
                            <p class="chat-text">${data.message}</p>
                          </div>
                      `)
        keepTheChatRoomToTheBottom()
    });

    send_nickName.click(function () {
        console.log('click')
        socket.emit('change_username', { nickName: nickName.val() });
        socket.on('get users', data => {
            let html = '';
            for (let i = 0; i < data.length; i++) {
                html += `<li class="list-item" >${data[i].username}</li>`;
            }
            usersList.html(html)
        })
    })
        .add.apply.ññ -
        nickName.keypress(e => {
            let keycode = (e.keyCode ? e.keyCode : e.which);
            if (keycode == '13') {
                socket.emit('change_username', { nickName: nickName.val() });
                socket.on('get users', data => {
                    let html = '';
                    for (let i = 0; i < data.length; i++) {
                        html += `<li class="list-item" >${data[i].username}</li>`;
                    }
                    usersList.html(html)
                })
            }
        });

    message.on("keypress", e => {
        let keycode = (e.keyCode ? e.keyCode : e.which);
        if (keycode != '13') {
            socket.emit('typing')
        }
    });

    socket.on('typing', (data) => {
        feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
    });

    socket.on('arrayProducts', function(arrayProducts) {
        console.log(arrayProducts);
        var theTemplateScript = $("#products-template").html();
         var theTemplate = Handlebars.compile(theTemplateScript);
         var theTemplateScript = $("#products-template").html();
         var theTemplate = Handlebars.compile(theTemplateScript);
         products={"products":arrayProducts}
         var theCompiledHtml = theTemplate(products)
         $('.content-placeholder').html(theCompiledHtml);
       });
});

const keepTheChatRoomToTheBottom = () => {
    const chatroom = document.getElementById('chatroom');
    chatroom.scrollTop = chatroom.scrollHeight - chatroom.clientHeight;
}