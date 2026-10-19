from fredapi import Fred
import pandas as pd

fred = Fred(api_key="78ee2a0b88a6417d321613e9f4fb1e14")

macro_dict = {
    "联邦基金利率": "FEDFUNDS",
    "SOFR利率": "SOFR",
    "投资级公司债": "BAMLC0A0CMEY",
    "高收益债": "BAMLH0A0HYM2EY",  # <--- 已修正为最新可用 Ticker
    "BBB级信用债": "BAMLC0A4CBBBEY",
    "2年期国债": "GS2",
    "10年期国债": "GS10",
    "30年期国债": "GS30",
    "M2供应量": "M2SL",
    "实际GDP": "GDPC1",
    "名义GDP": "GDP",
}
# for name,ticker in macro_dict.items():
#     print(ticker)
#     df = fred.get_series(ticker)
#     print(df)




## 时间序列曾

# 2. 工业生产子行业字典
ip_sectors = {
    "总制造业": "IPMAN",
    "电脑与电子": "IPG334S",
    "机械制造": "IPG333S",
    "汽车及零部件": "IPG3361T3S",
    "化学工业": "IPG325S",
}

# 3. 批量抓取并合并为宽表
df_ip_sectors = pd.DataFrame(
    {name: fred.get_series(code) for name, code in ip_sectors.items()}
)

# 4. 查看数据
print("--- 美国制造业子行业生产指数月度数据 ---")
print(df_ip_sectors.tail(10))

# 5. 保存至本地
df_ip_sectors.to_csv("us_industrial_production_sectors.csv")
print("\n子行业生产数据已成功保存！")