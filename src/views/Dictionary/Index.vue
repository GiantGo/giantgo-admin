<template>
  <div class="app-container bg-color">
    <el-row>
      <el-col :xs="24" :sm="24" :lg="8" style="padding: 10px;">
        <div class="menu-tree">
          <el-tree
            :data="dictionaryTypes"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            :props="defaultProps"
            @node-click="editDictionaryType">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>
                <svg-icon class-name="dictionary-icon" icon-class="dictionary"/>{{ node.label }}
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="16" style="padding: 10px;">
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import iconPicker from '@/components/Icon/Index'

  export default {
    name: 'Menu',
    components: {
      iconPicker
    },
    data () {
      return {
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        dictionaryBreadcrumbs: [],
        dictionaryTypeForm: {
          id: '',
          title: '',
          slug: '',
          isSubmitting: false
        },
        dictionaryItemForm: {
          id: '',
          parentId: '',
          title: '',
          slug: '',
          isSubmitting: false
        },
        dictionaryRule: {
          title: [
            {required: true, message: '请输入标题', trigger: 'change'}
          ],
          slug: [
            {required: true, message: '请输入编码', trigger: 'change'}
          ]
        },
        dictionaryTypes: [],
        dictionaryItems: []
      }
    },
    computed: {
      ...mapGetters([])
    },
    methods: {
      getDictionaryTypeList () {
        this.$store.dispatch('getDictionaryTypeList', {
          page: -1
        }).then(res => {
          this.dictionaryTypes = res.data.rows
        })
      },
      editDictionaryType () {

      },
      handleDrop (draggingNode, dropNode, dropType, ev) {
        console.log('tree drop: ', draggingNode, dropNode, dropType)
      }
    },
    mounted () {
      this.getDictionaryTypeList()
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import '../../styles/variables.scss';

  .menu-tree {
    padding: 20px;
    background: $white;
    .el-tree-node__content {
      height: 30px;
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '../../styles/variables.scss';

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .dictionary-icon {
    margin-right: 5px;
  }
</style>
