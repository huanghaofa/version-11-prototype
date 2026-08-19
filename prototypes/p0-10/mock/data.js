window.MockData = {
  behaviorEvents: [
    {
      code: "55511",
      category: "商城订单",
      name: "客户在商城下单",
      reverse: "商城订单销退／活动指定商品退款",
      status: "existing"
    },
    {
      code: "55512",
      category: "商城订单",
      name: "商城订单核销",
      reverse: "无",
      status: "existing"
    },
    {
      code: "55513",
      category: "商城订单",
      name: "商城已加入购物车但未下单",
      reverse: "无",
      status: "existing"
    },
    {
      code: "55514",
      category: "商城订单",
      name: "商城已下单但未付款",
      reverse: "商城订单－取消支付",
      status: "existing"
    },
    {
      code: "待分配",
      category: "商城订单",
      name: "用户订单消费金额达N元",
      reverse: "无（退款追溯规则待确认）",
      status: "new"
    }
  ]
};
