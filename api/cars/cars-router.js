const router = require('express').Router()
const Cars = require('./cars-model')
const { checkCarId, checkCarPayload, checkVinNumberValid, checkVinNumberUnique } = require('./cars-middleware')

router.get('/', (req, res, next) => {
  Cars.getAll()
    .then(cars => {
      res.json(cars)
    })
    .catch(next)
})

router.use((err, req, res, next) => {// eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  })
})

module.exports = router