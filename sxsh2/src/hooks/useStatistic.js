import { reactive, ref, computed } from "vue"
import moment from "moment"

export default (orders) => {
    const salesDimension = ref("salesPrice")
    const timeDimension = ref("day")
    const timeRange = ref([])
    const goodsStore = {}

    const getInitTime = () => {
        return {
            day: { ...Array(24).fill(0) },
            week: { ...Array(7).fill(0) },
            month: { ...Array(31).fill(0) },
            year: { ...Array(12).fill(0) },
        }
    }
    const rankCollection = reactive({
        salesPriceRank: [],
        salesCountRank: [],
    })
    const totalAggregation = reactive({
        salesPrice: 0,
        salesCount: 0,
        payCount: 0,
    })
    const timesAggregation = reactive({
        salesPrice: getInitTime(),
        salesCount: getInitTime(),
        payCount: getInitTime(),
    })
    const clearAllAggregation = () => {
        totalAggregation.salesPrice = 0
        totalAggregation.salesCount = 0
        totalAggregation.payCount = 0
        timesAggregation.salesPrice = getInitTime()
        timesAggregation.salesCount = getInitTime()
        timesAggregation.payCount = getInitTime()
        rankCollection.salesPriceRank = []
        rankCollection.salesCountRank = []
    }

    const calcAggregation = () => {
        clearAllAggregation()
        const salesPirceRank = {}
        const salesCountRank = {}
        totalAggregation.salesPrice = 0
        totalAggregation.salesCount = 0
        totalAggregation.payCount = 0

        orders.forEach((order) => {
            totalAggregation.salesPrice += order.dRealPay
            totalAggregation.salesCount += order.iCount
            totalAggregation.payCount += 1

            order.aGoods.forEach((goods) => {
                if (!goodsStore[goods.sBarCode]) {
                    goodsStore[goods.sBarCode] = JSON.parse(
                        JSON.stringify(goods),
                    )
                }

                if (salesPirceRank[goods.sBarCode]) {
                    salesPirceRank[goods.sBarCode] += +goods.dPay
                } else {
                    salesPirceRank[goods.sBarCode] = +goods.dPay
                }

                if (salesCountRank[goods.sBarCode]) {
                    salesCountRank[goods.sBarCode] += +goods.iCount
                } else {
                    salesCountRank[goods.sBarCode] = +goods.iCount
                }
            })

            const momentTarget = moment(order.dtCreate)
            if (timeRange.value?.length) {
                let currentTimeStamp = momentTarget.unix()
                let startTimeStamp = moment(timeRange.value[0]).unix()
                let endTimeStamp = moment(timeRange.value[1]).unix()
                if (
                    currentTimeStamp < startTimeStamp ||
                    currentTimeStamp > endTimeStamp
                ) {
                    return
                }
            }
            if (timeDimension.value === "day") {
                const hour = momentTarget.hour()
                timesAggregation.salesPrice.day[hour] += order.dRealPay
                timesAggregation.salesCount.day[hour] += order.iCount
                timesAggregation.payCount.day[hour] += 1
            }
            if (timeDimension.value === "week") {
                const weekday = momentTarget.weekday()
                timesAggregation.salesPrice.week[weekday] += order.dRealPay
                timesAggregation.salesCount.week[weekday] += order.iCount
                timesAggregation.payCount.week[weekday] += 1
            }
            if (timeDimension.value === "month") {
                const date = momentTarget.date()
                timesAggregation.salesPrice.month[date] += order.dRealPay
                timesAggregation.salesCount.month[date] += order.iCount
                timesAggregation.payCount.month[date] += 1
            }
            if (timeDimension.value === "year") {
                const month = momentTarget.month()
                timesAggregation.salesPrice.year[month] += order.dRealPay
                timesAggregation.salesCount.year[month] += order.iCount
                timesAggregation.payCount.year[month] += 1
            }
        })

        rankCollection.salesPriceRank = Object.keys(salesPirceRank)
            .sort((a, b) => salesPirceRank[b] - salesPirceRank[a])
            .map((c) => ({key: c, value: salesPirceRank[c]}))
        rankCollection.salesCountRank = Object.keys(salesCountRank)
            .sort((a, b) => salesCountRank[b] - salesCountRank[a])
            .map((c) => ({ key: c, value: salesCountRank[c] }))
    }

    return {
        salesDimension,
        timeDimension,
        timeRange,
        goodsStore,
        totalAggregation,
        timesAggregation,
        rankCollection,
        calcAggregation,
    }
}
