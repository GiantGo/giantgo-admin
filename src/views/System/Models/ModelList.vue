<template>
    <div>
        <el-row>
            <el-table :data="models.items" border @sort-change="sortChange">
                <el-table-column prop="CompanyName" label="企业名称" min-width="220">
                </el-table-column>
            </el-table>
            <div class="pager">
                <el-pagination @current-change="fetchModels"
                               :current-page.sync="models.pager.currentPage"
                               :page-size="models.pager.pageSize"
                               layout="total, prev, pager, next"
                               :total="models.pager.total">
                </el-pagination>
            </div>
        </el-row>
    </div>
</template>
<script>
  export default {
    data () {
      return {
        models: {
          items: [],
          sort: {
            field: undefined,
            order: undefined
          },
          pager: {
            currentPage: 1,
            pageSize: 15,
            total: 0
          }
        }
      }
    },
    components: {},
    methods: {
      sortChange (sort) {
        this.models.sort.field = sort.prop
        this.models.sort.order = sort.order
        this.fetchModels()
      },
      fetchModels () {
        this.$store.dispatch('getModelList', {
          sortField: this.models.sort.field,
          order: this.models.sort.order,
          pageIndex: this.models.pager.currentPage,
          pageSize: this.models.pager.pageSize
        }).then(data => {
          this.models.items = data.items
          this.models.pager.total = data.total
        })
      }
    },
    mounted () {
      this.fetchModels()
    }
  }
</script>
<style lang="scss">

</style>
