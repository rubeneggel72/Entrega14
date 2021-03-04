const express = require('express')
const router = express.Router();

router.get('/productos', (req, res) => {
    if (arrayProducts.length > 0) {
        res.send(arrayProducts);
    }
    else {
        res.send({ error: 'No hay products cargados' });
    }
})

router.get('/productos/:id', (req, res) => {
    let id = parseInt(req.params.id)
    let idx = getindex(id)
    let product = arrayProducts[idx]
    if (product != undefined) {
        res.send(product);
        return
    }
    else {
        res.send({ error: 'product no encontrado' });
    }
    res.send(JSON.stringify(product));
})

router.post('/productos', (req, res) => {
    var id = 1
    if (arrayProducts.length > 0) {
        id = arrayProducts[arrayProducts.length - 1].id + 1
    }
    req.body.id = id
    arrayProducts.push(req.body)
   
    res.send(req.body);
})

router.put('/productos/:id', (req, res) => {
    let id = parseInt(req.params.id)
    let idx = getindex(id)
    let product = arrayProducts[idx]
    if (product != undefined) {
        req.body.id = id
        arrayProducts[idx] = req.body
        res.send(req.body);
    }
    else {
        res.send({ error: 'product no encontrado' });
    }
})

router.delete('/productos/:id', (req, res) => {
    let id = parseInt(req.params.id)
    let idx = getindex(id)
    let product = arrayProducts[idx]

    if (product != undefined) {
        arrayProducts.splice(idx, 1);
        res.send(product);
        return
    }
    else {
        res.send({ error: 'product no encontrado' });
    }
})

function getindex(id) {
    var index = -1;
    arrayProducts.filter(function (product, i) {
        if (product.id === id) {
            index = i;
        }
    });
    return index;
}

module.exports = router