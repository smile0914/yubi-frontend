export default [
  {name: '登录', path: '/user', layout: false, routes: [{path: '/user/login', component: './User/Login'}]},
  {path: '/', redirect: '/add/chart'},
  {path: '/add/chart', name:'智能分析', icon: 'barChart', component: './AddChart'},
  {path: '/add/chart_async', name:'智能分析(异步)', icon: 'barChart', component: './AddChartAsync'},
  {path: '/my_chart', name:'我的图表', icon: 'pieChart', component: './MyChart'},
  {
    path: '/admin',
    icon: 'crown',
    access: 'canAdmin',
    name: '管理员页面',
    routes: [
      {path: '/admin', name: '管理页面', redirect: '/admin/sub-page'},
      {path: '/admin/sub-page', component: './Admin'},
    ],
  },
  {path: '/', redirect: '/welcome'},
  {path: '*', layout: false, component: './404'},
];

