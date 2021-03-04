const fs = require('fs');
class Archivo {
    constructor(nombre) {
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
    async guardar(message) {
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
async function saveChat(message) {
    await miArchivo.guardar(message)
}
module.export ={miArchivo,saveChat}