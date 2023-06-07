import React, {useEffect, useState} from 'react';
import {listMyChartByPageUsingPOST} from "@/services/yubi/chartController";
import {Avatar, Card, List, message, Result} from "antd";
import ReactECharts from "echarts-for-react";
import {useModel} from "@@/exports";
import Search from "antd/es/input/Search";

const MyChartPage: React.FC = () => {

  const initSearchParams = {
    current: 1,
    pageSize: 4,
    sortField: 'createTime',
    sortOrder: 'desc'
  }

  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({ ...initSearchParams});
  const {initialState} = useModel('@@initialState');
  const {currentUser} = initialState ?? {};
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total,  setTotal] = useState<number>(0);
  const [loading,setLoading] = useState<boolean>(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await listMyChartByPageUsingPOST(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0)

        if(res.data.records){
          res.data.records.forEach(data => {
            if( data.status === 'succeed'){
              const chartOption = JSON.parse(data.genChart ?? '{}');
              chartOption.title = undefined
              data.genChart = JSON.stringify(chartOption)
            }
          })
        }

      } else {
        message.error('获取我的图表失败')
      }
    } catch (e: any){
      message.error('获取我的图标失败' + e.message)
    }
    setLoading(false )
  }

  useEffect(()=> {
    loadData()
  }, [searchParams])

  return (
    <div className="margin-16">
      <div>
        <Search placeholder="请输入图表名称" enterButton loading={loading} onSearch={(value) => {
          setSearchParams({
            ...initSearchParams,
            name:value
          })

        }}/>
      </div>
      <div className="margin-16"></div>
      <List
        grid={{gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 1,
          xl: 1,
          xxl: 2 }}
        pagination={{
          onChange: (page,pageSize) => {
            setSearchParams({
              ...searchParams,
              current:page,
              pageSize
            })
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total:total
        }}
        dataSource={chartList}
        footer={
          <div>
            <b>ant design</b> footer part
          </div>
        }
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card>
              <List.Item.Meta
                avatar={<Avatar src={currentUser.userAvatar } />}
                title={item.name}
                description={item.chartType ? '图表类型:' + item.chartType : undefined}
              />
              <>
              {
                item.status === 'wait' &&
                <>
                  <Result status="warning" title="待生成" subTitle={item.execMessage ?? '当前图表生成队列繁忙，请耐心等待'}/>
                </>
              }
              {
                item.status === 'running' &&
                <>
                  <Result status="info" title="图表生成中" subTitle={item.execMessage}/>
                </>
              }
              {
                item.status === 'failed' &&
                <>
                  <Result status="info" title="图表生成错误" subTitle={item.execMessage}/>
                </>
              }
              {
                item.status === 'succeed' &&
                <>
                  <div className={'margin-16'}>
                    <p>分析目标：{item.goal}</p>
                  </div>
                  <p>创建时间：{item.createTime.substring(0,19)}</p>
                  <ReactECharts option={JSON.parse(item.genChart ?? '{}')}/>
                </>
              }
              </>

            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};
export default MyChartPage;

