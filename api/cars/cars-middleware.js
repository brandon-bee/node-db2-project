const Cars = require('./cars-model')
var vinValidator = require('vin-validator')
const db = require('../../data/db-config')

const checkCarId = async (req, res, next) => {
  const { id } = req.params
  try {
    const car = await Cars.getById(id)
    if (!car) {
      next({
        status: 404,
        message: `car with id ${id} is not found`
      })
    } else {
      req.car = car
      next()
    }
  } catch (err) {
    next(err)
  }
}

const checkCarPayload = (req, res, next) => {
  const { vin, make, model, mileage } = req.body;
  if (!vin) {
    next({
      status: 400,
      message: 'vin is missing'
    })
  } else if (!make) {
    next({
      status: 400,
      message: 'make is missing'
    })
  } else if (!model) {
    next({
      status: 400,
      message: 'model is missing'
    })
  } else if (!mileage) {
    next({
      status: 400,
      message: 'mileage is missing'
    })
  } else {
    next()
  }
}

const checkVinNumberValid = (req, res, next) => {
  const { vin } = req.body;
  if (vinValidator.validate(vin)) {
    next()
  } else {
    next({
      status: 400,
      message: `vin ${vin} is invalid`
    })
  }
}

const checkVinNumberUnique = async (req, res, next) => {
  const { vin } = req.body;
  try {
    const existing = await db('cars')
      .where({ vin: vin.trim() })
      .first()

    if (existing) {
      next({
        status: 400,
        message: `vin ${vin} already exists`
      })
    } else {
      next()
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  checkCarId,
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique
}