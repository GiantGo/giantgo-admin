<template>
  <div class="app-container">
    <el-input v-model="currentRole" placeholder="Please input" style="width:400px;max-width:100%;"/>
    <el-button type="primary" icon="document" @click="handleCopy(currentRole, $event)">复制</el-button>
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
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="300" :back-position="50" transition-name="fade"></back-to-top>
    </el-tooltip>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import clipboard from '@/utils/clipboard'
  import BackToTop from '@/components/BackToTop/Index'
  import RadarChart from './components/RadarChart'
  import PieChart from './components/PieChart'
  import BarChart from './components/BarChart'

  export default {
    name: 'Dashboard',
    components: {
      BackToTop,
      RadarChart,
      PieChart,
      BarChart
    },
    data () {
      return {
        currentRole: 'adminDashboard'
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
