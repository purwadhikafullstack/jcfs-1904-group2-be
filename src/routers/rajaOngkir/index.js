const express = require('express')
const router = express.Router()
const axios = require('axios')

// Config Defaults Axios dengan Detail Akun Rajaongkir
axios.defaults.baseURL = 'https://api.rajaongkir.com/starter'
axios.defaults.headers.common['key'] = '0dfef8ec291820c10a62c0223e92e331'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// Router GET province
router.get('/province', (req, res) => {
  axios.get('/province')
    .then(response => res.json(response.data))
    .catch(err => res.send(err))
})

// Router GET city by province_id
router.get('/city/:provId', (req, res) => {
  const id = req.params.provId
  axios.get(`/city?province=${id}`)
    .then(response => res.json(response.data))
    .catch(err => res.send(err))
})

// Router GET costs
router.get('/cost/:origin/:destination/:weight/:courier', (req, res) => {
  const param = req.params
  axios.post('/cost', {
      origin: param.origin,
      destination: param.destination,
      weight: param.weight,
      courier: param.courier
    })
    .then(response => res.json(response.data))
    .catch(err => res.send(err))
})

module.exports = router