<template>
  <div class="app-container bg-color">
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <radar-chart/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart/>
        </div>
      </el-col>
    </el-row>
    <img :src="imgSrc" alt=""/>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import clipboard from '@/utils/clipboard'
  import RadarChart from './components/RadarChart'
  import PieChart from './components/PieChart'
  import BarChart from './components/BarChart'

  export default {
    name: 'Dashboard',
    components: {
      RadarChart,
      PieChart,
      BarChart
    },
    data () {
      return {
        currentRole: 'adminDashboard',
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    },
    computed: {
      ...mapGetters([
        'roles',
        'imgSrc'
      ])
    },
    created () {
      if (!this.roles.includes('admin')) {
        this.currentRole = 'editorDashboard'
      }
    },
    methods: {
      handleCopy (text, event) {
        clipboard(text, event)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
</style>
