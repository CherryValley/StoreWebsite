var express = require('express');
var commonService = require('../../service/commonService');
var commonData = require('../../service/commonData');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var customerID = req.cookies['loginCustomerID'];
  var service = new commonService.commonInvoke('shoppingCart4Customer');
  commonData.getCommonData(req, res, function(commonResult){
    if(commonResult.err){
      res.render('error', {
        title: '网站出错啦',
        errorCode: commonResult.code,
        message: commonResult.msg,
        navigate: commonResult.navigate
      });
    }else{
      if(customerID === undefined){
        res.redirect('/login');
        return false;
      }
      service.get(customerID, function (result) {
        if(result.err){
          res.render('error', {
            title: '网站出错啦',
            errorCode: result.code,
            message: result.msg,
            navigate: commonResult.navigate
          });
        }else{
          res.render('order/order', {
            title: '订单结算',
            navigate: commonResult.navigate,
            shoppingCartList: result.content.responseData
          });
        }
      });
    }
  });
});

router.post('/', function (req, res, next) {
  var service = new commonService.commonInvoke('order');
  var data = {
    customerID: req.body.customerID,
    orderAmount: req.body.orderAmount,
    shippingAddressID: req.body.shippingAddressID,
    currencyType: req.body.currencyType,
    memo: req.body.memo,
    shoppingCartIdList: req.body.shoppingCartIdList,
    orderItemsJson: req.body.orderItems,
    loginUser: req.body.loginUser
  };

  service.add(data, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        data: result.content.responseData
      });
    }
  });
});

router.post('/shippingAddress', function (req, res, next) {
  var service = new commonService.commonInvoke('shippingAddress');
  var data = {
    customerID: req.body.customerID,
    shippingCountryID: req.body.shippingCountryID,
    shippingProvinceID: req.body.shippingProvinceID,
    shippingCityID: req.body.shippingCityID,
    shippingStreet: req.body.shippingStreet,
    consignee: req.body.consignee,
    cellphone: req.body.cellphone,
    loginUser: req.body.loginUser
  };

  service.add(data, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        data: result.content
      });
    }
  });
});

router.put('/shippingAddress', function (req, res, next) {
  var service = new commonService.commonInvoke('shippingAddress');
  var data = {
    customerID: req.body.customerID,
    shippingID: req.body.shippingID,
    loginUser: req.body.loginUser
  };

  service.change(data, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        data: result.content
      });
    }
  });
});

router.delete('/shippingAddress', function (req, res, next) {
  var service = new commonService.commonInvoke('shippingAddress');
  var shippingID = req.query.shippingID;

  service.delete(shippingID, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        data: result.content
      });
    }
  });
});

module.exports = router;