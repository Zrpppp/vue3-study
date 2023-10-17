<script setup>
import {getCheckInfoAPI, createOrderAPI} from "@/api/checkout";
import {ref, onMounted} from "vue";
import { useRouter } from 'vue-router'
import {useCartStore} from "@/stores/cart";
const router = useRouter()
const cartStore = useCartStore()

//获取订单信息
const checkInfo = ref({})
const curAddress = ref({})
const getCheckInfo = async () => {
  const res = await getCheckInfoAPI()
  checkInfo.value = res.result
  curAddress.value = res.result.userAddresses.find(item => item.isDefault === 0)
}
onMounted(() => getCheckInfo())

//切换地址弹框
const showChangeAddressDialog = ref(false)
const activeAddress = ref({})
const switchAddress = (item) =>  activeAddress.value = item

const confirm = () => {
  curAddress.value = activeAddress.value
  showChangeAddressDialog.value = false
  activeAddress.value = {}
}

//添加地址
const showAddAddressDialog = ref(false)
const form = ref({
  receiver: '',
  contact: '',
  fullLocation: '',
  address: '',
})
const confirmAddAddress = () => {
  //请求接口
  showAddAddressDialog.value = false
}

//配送时间
const deliveryTimeTypeList = [
  {
    label: '不限送货时间：周一至周日',
    value: 1
  }, {
    label: '工作日送货：周一至周五',
    value: 2
  }, {
    label: '双休日、假日送货：周六至周日',
    value: 3
  }
]
const activeDeliveryTimeType = ref(1)
const clickDeliveryTimeType = (e) => activeDeliveryTimeType.value = e

//支付方式
const payTypeList = [
  {
    label: '在线支付',
    value: 1
  }, {
    label: '货到付款',
    value: 2
  }
]
const activePayType = ref(1)
const clickPayType = (e) => activePayType.value = e
//订单备注
const buyerMessage = ref('')

//提交订单

const createOrder = async () => {
  const res = await createOrderAPI({
    deliveryTimeType: activeDeliveryTimeType.value,
    payType: activePayType.value,
    payChannel: 1,
    buyerMessage: buyerMessage.value,
    goods: checkInfo.value.goods.map(item => {
      return {
        skuId: item.skuId,
        count: item.count
      }
    }),
    addressId: curAddress.value.id
  })
  const orderId = res.result.id
  await router.push({
    path: '/pay',
    query: {
      id: orderId
    }
  })
  // 更新购物车
  await cartStore.getCartList()
}
</script>

<template>
  <div class="xtx-pay-checkout-page">
    <div class="container">
      <div class="wrapper">
        <!-- 收货地址 -->
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <div class="address">
            <div class="text">
              <div class="none" v-if="!curAddress">您需要先添加收货地址才可提交订单。</div>
              <ul v-else>
                <li><span>收<i/>货<i/>人：</span>{{ curAddress.receiver }}</li>
                <li><span>联系方式：</span>{{ curAddress.contact }}</li>
                <li><span>收货地址：</span>{{ curAddress.fullLocation }} {{ curAddress.address }}</li>
              </ul>
            </div>
            <div class="action">
              <el-button size="large" @click="showChangeAddressDialog = true">切换地址</el-button>
              <el-button size="large" @click="showAddAddressDialog = true">添加地址</el-button>
            </div>
          </div>
        </div>
        <!-- 商品信息 -->
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <table class="goods">
            <thead>
            <tr>
              <th width="520">商品信息</th>
              <th width="170">单价</th>
              <th width="170">数量</th>
              <th width="170">小计</th>
              <th width="170">实付</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="i in checkInfo.goods" :key="i.id">
              <td>
                <a href="javascript:;" class="info">
                  <img :src="i.picture" alt="">
                  <div class="right">
                    <p>{{ i.name }}</p>
                    <p>{{ i.attrsText }}</p>
                  </div>
                </a>
              </td>
              <td>&yen;{{ i.price }}</td>
              <td>{{ i.count }}</td>
              <td>&yen;{{ i.totalPrice }}</td>
              <td>&yen;{{ i.totalPayPrice }}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <!-- 配送时间 -->
        <h3 class="box-title">配送时间</h3>
        <div class="box-body">
          <a class="my-btn" href="javascript:;" :class="{active:activeDeliveryTimeType === item.value}"
             @click="clickDeliveryTimeType(item.value)" v-for="item in deliveryTimeTypeList">{{ item.label }}</a>
        </div>
        <!-- 支付方式 -->
        <h3 class="box-title">支付方式</h3>
        <div class="box-body">
          <a class="my-btn" href="javascript:;" :class="{active:activePayType === item.value}" @click="clickPayType(item.value)" v-for="item in payTypeList" >{{ item.label }}</a>
          <span style="color:#999">货到付款需付5元手续费</span>
        </div>
        <!--备注-->
        <h3 class="box-title">订单备注</h3>
        <div class="box-body">
          <el-input
              v-model="buyerMessage"
              maxlength="50"
              placeholder="请输入"
              show-word-limit
              type="textarea"
          />
        </div>
        <!-- 金额明细 -->
        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl>
              <dt>商品件数：</dt>
              <dd>{{ checkInfo.summary?.goodsCount }}件</dd>
            </dl>
            <dl>
              <dt>商品总价：</dt>
              <dd>¥{{ checkInfo.summary?.totalPrice.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>运<i></i>费：</dt>
              <dd>¥{{ checkInfo.summary?.postFee.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>应付总额：</dt>
              <dd class="price">{{ checkInfo.summary?.totalPayPrice.toFixed(2) }}</dd>
            </dl>
          </div>
        </div>
        <!-- 提交订单 -->
        <div class="submit">
          <el-button @click="createOrder" type="primary" size="large">提交订单</el-button>
        </div>
      </div>
    </div>
  </div>
  <!-- 切换地址 -->
  <el-dialog v-model="showChangeAddressDialog" title="切换收货地址" width="30%" center>
    <div class="addressWrapper">
      <div class="text item" :class="{ active: activeAddress.id === item.id }" @click="switchAddress(item)"
           v-for="item in checkInfo.userAddresses" :key="item.id">
        <ul>
          <li><span>收<i/>货<i/>人：</span>{{ item.receiver }}</li>
          <li><span>联系方式：</span>{{ item.contact }}</li>
          <li><span>收货地址：</span>{{ item.fullLocation + item.address }}</li>
        </ul>
      </div>
    </div>
    <template #footer>
            <span class="dialog-footer">
                <el-button @click="showChangeAddressDialog = false">取消</el-button>
                <el-button type="primary" @click="confirm">确定</el-button>
            </span>
    </template>
  </el-dialog>

  <!-- 添加地址 -->
  <el-dialog v-model="showAddAddressDialog" title="新增地址" width="30%" center>
    <el-form :model="form" label-width="80px">
      <el-form-item label="收货人">
        <el-input v-model="form.receiver" clearable/>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="form.contact" clearable/>
      </el-form-item>
      <el-form-item label="省市区">
        <el-input v-model="form.fullLocation" clearable/>
      </el-form-item>
      <el-form-item label="收货地址">
        <el-input v-model="form.address" type="textarea" clearable/>
      </el-form-item>
    </el-form>
    <template #footer>
            <span class="dialog-footer">
                <el-button @click="showAddAddressDialog = false">取消</el-button>
                <el-button type="primary" @click="confirmAddAddress">确定</el-button>
            </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.xtx-pay-checkout-page {
  margin-top: 20px;

  .wrapper {
    background: #fff;
    padding: 0 20px;

    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }

    .box-body {
      padding: 20px 0;
    }
  }
}

.address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;

  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;

    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }

    > ul {
      flex: 1;
      padding: 20px;

      li {
        line-height: 30px;

        span {
          color: #999;
          margin-right: 5px;

          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }

    > a {
      color: $xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }

  .action {
    width: 420px;
    text-align: center;

    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;

      &:first-child {
        margin-right: 10px;
      }
    }
  }
}

.goods {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;

  .info {
    display: flex;
    text-align: left;

    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
    }

    .right {
      line-height: 24px;

      p {
        &:last-child {
          color: #999;
        }
      }
    }
  }

  tr {
    th {
      background: #f5f5f5;
      font-weight: normal;
    }

    td,
    th {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;

      &:first-child {
        border-left: 1px solid #f5f5f5;
      }

      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}

.my-btn {
  width: 228px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-right: 25px;
  color: #666666;
  display: inline-block;

  &.active,
  &:hover {
    border-color: $xtxColor;
  }
}

.total {
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;

    dt {
      i {
        display: inline-block;
        width: 2em;
      }
    }

    dd {
      width: 240px;
      text-align: right;
      padding-right: 70px;

      &.price {
        font-size: 20px;
        color: $priceColor;
      }
    }
  }
}

.submit {
  text-align: right;
  padding: 60px;
  border-top: 1px solid #f5f5f5;
}

.addressWrapper {
  max-height: 500px;
  overflow-y: auto;
}

.text {
  flex: 1;
  min-height: 90px;
  display: flex;
  align-items: center;

  &.item {
    border: 1px solid #f5f5f5;
    margin-bottom: 10px;
    cursor: pointer;

    &.active,
    &:hover {
      border-color: $xtxColor;
      background: lighten($xtxColor, 50%);
    }

    > ul {
      padding: 10px;
      font-size: 14px;
      line-height: 30px;
    }
  }
}
</style>
