
// 净值数据
interface navType {
  date: string,
  p: number,
  b: number
}


// 穿透资产配置
interface assetType {
  name: string,
  value: number
}

// 实时涨跌幅数据
interface changeType {
  name: string,
  value: number
}

// 基金平均仓位
interface avgPosType {
  date: string,
  normal_stock: number,
  mix_stock: number,
  mix_equal: number,
  mix_flexible: number,
}

// 客户问卷摘要
interface questionType {
  id?: number,
  port_code?: string,
  risk?: string,
  maturity?: string,
  arr?: string,
  volatility?: string,
  fluidity?: string,
  age?: number,
  experience?: string,
  plan?: string,
  tolerance?: string,
  alter_limit?: string,
  cross_border_limit?: string
}
