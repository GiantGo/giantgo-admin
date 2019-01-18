<template>
    <div class="app-container">
        <el-input v-model="currentRole" placeholder="Please input" style="width:400px;max-width:100%;"/>
        <el-button type="primary" icon="document" @click="handleCopy(currentRole, $event)">copy</el-button>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import clipboard from '@/utils/clipboard'

  export default {
    name: 'Dashboard',
    components: {},
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
