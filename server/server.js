"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var fs = require('fs');

var regeneratorRuntime = require("regenerator-runtime");

var express = require('express');

var app = express();
var router = express.Router();

var bodyParser = require("body-parser");

var uuid = require('uuid');

var server = app.listen(process.env.PORT || 8080); //socket.io instantiation

var io = require("socket.io")(server);

var arrayProducts = [{
  "id": 1,
  "title": "iPhone 11 64 GB (Product)Red",
  "price": 159000,
  "thumbnail": "https://raw.githubusercontent.com/rubeneggel72/Entrega10/main/img/img-001.jpg"
}, {
  "id": 3,
  "title": "iPhone 12 64 GB azul",
  "price": 200000,
  "thumbnail": "https://raw.githubusercontent.com/rubeneggel72/Entrega10/main/img/img-002.jpg"
}, {
  "id": 4,
  "title": "iPhone XR 64 GB negro",
  "price": 139000,
  "thumbnail": "https://raw.githubusercontent.com/rubeneggel72/Entrega10/main/img/img-003.jpg"
}, {
  "id": 5,
  "title": "iPhone XR 64 GB negro",
  "price": 139000,
  "thumbnail": "https://raw.githubusercontent.com/rubeneggel72/Entrega10/main/img/img-004.jpg"
}];
var users = [];
var connnections = [];

var Archivo = /*#__PURE__*/function () {
  function Archivo(nombre) {
    (0, _classCallCheck2["default"])(this, Archivo);
    this.nombre = nombre;
  }

  (0, _createClass2["default"])(Archivo, [{
    key: "leer",
    value: function () {
      var _leer = (0, _asyncToGenerator2["default"])( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return fs.promises.readFile(this.nombre, 'utf-8');

              case 3:
                _context.t0 = _context.sent;

                if (_context.t0) {
                  _context.next = 6;
                  break;
                }

                _context.t0 = "[]";

              case 6:
                return _context.abrupt("return", _context.t0);

              case 9:
                _context.prev = 9;
                _context.t1 = _context["catch"](0);
                console.log('No existe archivo :' + this.nombre);
                return _context.abrupt("return", "[]");

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 9]]);
      }));

      function leer() {
        return _leer.apply(this, arguments);
      }

      return leer;
    }()
  }, {
    key: "guardar",
    value: function () {
      var _guardar = (0, _asyncToGenerator2["default"])( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(message) {
        var dataJSON, data;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.leer();

              case 2:
                dataJSON = _context2.sent;
                data = JSON.parse(dataJSON);
                console.log;
                data.push(message);
                _context2.prev = 6;
                _context2.next = 9;
                return fs.promises.writeFile(this.nombre, JSON.stringify(data));

              case 9:
                return _context2.abrupt("return", "Mensaje fu\xE9 guardado en\xA0archivo \xA0");

              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2["catch"](6);
                return _context2.abrupt("return", console.log(_context2.t0));

              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[6, 12]]);
      }));

      function guardar(_x) {
        return _guardar.apply(this, arguments);
      }

      return guardar;
    }()
  }]);
  return Archivo;
}();

var miArchivo = new Archivo("chat.txt");

function saveChat(_x2) {
  return _saveChat.apply(this, arguments);
} //middlewares


function _saveChat() {
  _saveChat = (0, _asyncToGenerator2["default"])( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(message) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return miArchivo.guardar(message);

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _saveChat.apply(this, arguments);
}

app.use(express["static"]('./public'));
app.set('view engine', 'ejs');
app.use(express["static"]('./public'));
app.use(express.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use('/api', require('../rutas/api'));
app.use('/', router); //listen on every connection

io.on('connection', function (socket) {
  console.log('New user connected');
  connnections.push(socket); //initialize a random color for the socket

  socket.username = 'Anonymous';
  setInterval(function () {
    socket.broadcast.emit('arrayProducts', arrayProducts);
  }, 3000); //listen on change_username

  socket.on('change_username', function (data) {
    var id = uuid.v4();
    socket.id = id;
    socket.username = data.nickName;
    users.push({
      id: id,
      username: socket.username,
      color: socket.color
    });
    updateUsernames();
  }); //update Usernames in the client

  var updateUsernames = function updateUsernames() {
    io.sockets.emit('get users', users);
  }; //listen on new_message


  socket.on('new_message', function (data) {
    //broadcast the new message
    var message = {
      message: data.message,
      username: socket.username,
      date: getDateTime()
    };
    io.sockets.emit('new_message', message);
    saveChat(message);
  }); //listen on typing

  socket.on('typing', function (data) {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  }); //Disconnect

  socket.on('disconnect', function (data) {
    if (!socket.username) return; //find the user and delete from the users list

    var user = undefined;

    for (var i = 0; i < users.length; i++) {
      if (users[i].id === socket.id) {
        user = users[i];
        break;
      }
    }

    users = users.filter(function (x) {
      return x !== user;
    }); //Update the users list

    updateUsernames();
    connnections.splice(connnections.indexOf(socket), 1);
  });
});

function getDateTime() {
  var date = new Date();
  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;
  var min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;
  var sec = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;
  var day = date.getDate();
  day = (day < 10 ? "0" : "") + day;
  return day + ":" + month + ":" + year + "-" + hour + ":" + min + ":" + sec;
}
