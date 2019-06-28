<template>
  <div class="app-container">
    <el-table
      :data="postList.items"
      border
      style="width: 100%">
      <el-table-column type="index" label="序号" align="center" width="80"/>
      <el-table-column
        prop="title"
        label="标题"
        width="100">
      </el-table-column>
      <el-table-column
        prop="abstract"
        label="简介"
        width="180">
      </el-table-column>
      <el-table-column
        label="图片">
        <template slot-scope="scope">
          <img v-for="extension in scope.row.extensions" :key="extension" :src="extension" style="width: 100%;"/>
        </template>
      </el-table-column>
      <el-table-column
        label="最后更新时间"
        width="160px"
        align="center">
        <template slot-scope="scope">
          {{formatTime(scope.row.updatedAt)}}
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="getPostList"
        @current-change="getPostList"
        :current-page.sync="postList.pager.page"
        :page-sizes="[5, 10, 20, 30, 40]"
        :page-size.sync="postList.pager.limit"
        layout="total, sizes, prev, pager, next"
        :total="postList.pager.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getPostList } from '@/api/post'
  import { formatTime } from '@/utils'

  export default {
    name: 'List',
    data () {
      return {
        postList: {
          items: [],
          loading: false,
          keyword: '',
          pager: {
            page: 1,
            limit: 5,
            total: 0
          }
        }
      }
    },
    methods: {
      formatTime,
      getPostList () {
        getPostList(this.postList.pager.page, this.postList.pager.limit).then(res => {
          this.postList.items = res.data.rows
          this.postList.pager.total = res.data.count
        })
      }
    },
    mounted () {
      this.getPostList()
    }
  }
</script>

<style scoped>

</style>
