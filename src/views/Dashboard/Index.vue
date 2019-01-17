<template>
    <div class="dashboard-container">
        <img alt="stream" :src="imgSrc"/>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'

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
    }
  }
</script>
