
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
