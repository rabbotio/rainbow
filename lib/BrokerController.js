'use strict'

function BrokerController () {
  this.__reqs = {}
  this.__srq = {}

  this.init()
}

BrokerController.prototype.init = function () {}

BrokerController.prototype._srq = function (srv) {
  console.log('BrokerController.prototype._srq')
  console.log(srv)

  if (this.__srq[srv]) {
    return this.__srq[srv]
  }

  var srq = (this.__srq[srv] = [])
  return srq
}

BrokerController.prototype.rset = function (req, callback) {
  console.log('BrokerController.prototype.rset')

  this.__reqs[req.rid] = req

  if (callback) {
    callback()
  }
}

BrokerController.prototype.rgetall = function (callback) {
  var self = this

  setImmediate(function () {
    console.log('BrokerController.prototype.rgetall', self.__reqs)
    callback(null, self.__reqs)
  })
}

BrokerController.prototype.rget = function (rid, callback) {
  console.log('BrokerController.prototype.rget')

  var self = this

  setImmediate(function () {
    callback(null, self.__reqs[rid])
  })
}

BrokerController.prototype.rdel = function (req) {
  console.log('BrokerController.prototype.rdel')

  delete this.__reqs[req.rid]
}

module.exports = BrokerController
