var fs = require('fs');
const regeneratorRuntime = require("regenerator-runtime");
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const uuid = require('uuid');

const server = app.listen(process.env.PORT || 8080);
//socket.io instantiation
const io = require("socket.io")(server);

var arrayProducts:Array<Object> = [{ "id": 1, "title": "iPhone 11 64 GB (Product)Red", "price": 159000, "thumbnail": "https://raw.githubusercontent.com/rubeneggel72/Entrega10/main/img/img-001.jpg" },
{ "id": 3, "title": "iPhone 12 64 GB azul", "price": 200000, "thumbnail": "https://raw.githubusercontent.com/rubeneggel72/Entrega10/main/img/img-002.jpg" },
{ "id": 4, "title": "iPhone XR 64 GB negro", "price": 139000, "thumbnail": "https://raw.githubusercontent.com/rubeneggel72/Entrega10/main/img/img-003.jpg" },
{ "id": 5, "title": "iPhone XR 64 GB negro", "price": 139000, "thumbnail": "https://raw.githubusercontent.com/rubeneggel72/Entrega10/main/img/img-004.jpg" },
]

let users:Array<any> = [];
let connnections:Array<number> = [];
class Archivo {
    private nombre:String
    constructor(nombre:String) {
        this.nombre = nombre;
    }
    async leer() {
        try {
            return await fs.promises.readFile(this.nombre, 'utf-8') || "[]";
        } catch (error) {
            console.log('No existe archivo :' + this.nombre)
            return "[]";
        }
    }
    async guardar(message:String) {
        const dataJSON = await this.leer();
        let data = JSON.parse(dataJSON)
        console.log
        data.push(message);
        try {
            await fs.promises.writeFile(this.nombre, JSON.stringify(data));
            return `Mensaje fué guardado en archivo  `;
        } catch (error) {
            return (console.log(error));
        }
    }
}

const miArchivo = new Archivo("chat.txt")
async function saveChat(message:String) {
    await miArchivo.guardar(message)
}

//middlewares
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use('/api', require('../rutas/api'))
app.use('/', router)

//listen on every connection
io.on('connection', (socket:any) => {
    console.log('New user connected');
    connnections.push(socket)

    //initialize a random color for the socket
    
    socket.username = 'Anonymous';
    setInterval(function () {
        socket.broadcast.emit('arrayProducts', arrayProducts);
    }, 3000);

    //listen on change_username
    socket.on('change_username', (data:{nickName:string})=> {
       
        let id = uuid.v4();
        socket.id = id;
        
        socket.username = data.nickName;
        users.push({ id, username: socket.username, color: socket.color });
        updateUsernames();
    })

    //update Usernames in the client
    const updateUsernames = () => {
        io.sockets.emit('get users', users)
    }

    //listen on new_message
    socket.on('new_message', (data:{message: string}) => {
        interface MessageObj{
            message: string;
            username: string;
            date: string;
        }
        
        //broadcast the new message
        let messageObj:any = { message: data.message, username: socket.username, date: getDateTime() }
        io.sockets.emit('new_message', messageObj);
        saveChat(messageObj);
    })
    
    //listen on typing
    socket.on('typing', (data:{}) => {
        socket.broadcast.emit('typing', { username: socket.username })
    })

    //Disconnect
    socket.on('disconnect', (data:{}) => {
        if (!socket.username)
            return;

        //find the user and delete from the users list
        let user:any = undefined;
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === socket.id) {
                user = users[i];
                break;
            }
        }
        users = users.filter(x => x !== user);

        //Update the users list
        updateUsernames();
        connnections.splice(connnections.indexOf(socket), 1);
    })
})


function getDateTime() {
    let date = new Date();
    let h= date.getHours();
    let hour:string= (h < 10 ? "0" : "") + h;
    let m = date.getMinutes();
    let min:string = (m < 10 ? "0" : "") + m;
    var s = date.getSeconds();
    let sec:string = (s < 10 ? "0" : "") + s;
    var y = date.getFullYear();
    let year:string=""+y
    var mo = date.getMonth() + 1;
    var month:string = (mo < 10 ? "0" : "") + mo;
    var day = date.getDate();
    var d = (day < 10 ? "0" : "") + day;
    return day + ":" + month + ":" + year + "-" + hour + ":" + min + ":" + sec;

}