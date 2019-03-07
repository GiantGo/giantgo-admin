<template>
  <div class="app-container bg-color">
    <el-row>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="panel">
          <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                       @click="addDictionaryType">
              添加分类
            </el-button>
          </div>
          <el-tree
            :data="dictionaryTypes"
            ref="dictionaryTypeTree"
            node-key="id"
            default-expand-all
            highlight-current
            :expand-on-click-node="false"
            :props="defaultProps"
            @current-change="(data) => changeDictionaryTypeId(data.id)">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>
                {{ node.label }}
              </span>
              <span>
                <el-button
                  type="text"
                  size="mini"
                  @click="($event) => editDictionaryType(data, node, $event)">
                  编辑
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  v-if="data.id !== -1"
                  @click="($event) => deleteDictionaryType(data, node, $event)">
                  删除
                </el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="16">
        <dictionary-item :dictionary-type-id="currentDictionaryTypeId"></dictionary-item>
      </el-col>
    </el-row>
    <el-dialog :title="dictionaryTypeDialog.title" :visible.sync="dictionaryTypeDialog.isShow"
               :close-on-click-modal="false">
      <el-form ref="dictionaryTypeForm" :model="dictionaryTypeForm" :rules="dictionaryTypeRule" label-position="left"
               label-width="120px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="分类标题" prop="title">
          <el-input v-model="dictionaryTypeForm.title"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="slug">
          <el-input v-model="dictionaryTypeForm.slug"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="closeDictionaryTypeDialog">取 消</el-button>
        <el-button type="primary" @click="saveDictionaryType" :loading="dictionaryTypeForm.isSubmitting">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import iconPicker from '@/components/Icon/Index'
  import DictionaryItem from './components/DictionaryItem'

  export default {
    name: 'Dictionary',
    components: {
      DictionaryItem,
      iconPicker
    },
    data () {
      return {
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        dictionaryTypeDialog: {
          isShow: false,
          title: ''
        },
        dictionaryTypeForm: {
          id: '',
          title: '',
          slug: '',
          isSubmitting: false
        },
        dictionaryTypeRule: {
          title: [
            {required: true, message: '请输入标题', trigger: 'change'}
          ],
          slug: [
            {required: true, message: '请输入编码', trigger: 'change'}
          ]
        },
        currentDictionaryTypeId: -1,
        dictionaryTypes: []
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
          if (this.currentDictionaryTypeId) {
            this.$nextTick(() => {
              this.$refs.dictionaryTypeTree.setCurrentKey(this.currentDictionaryTypeId)
            })
          }
        })
      },
      changeDictionaryTypeId (dictionaryTypeId) {
        this.currentDictionaryTypeId = dictionaryTypeId
      },
      addDictionaryType () {
        this.dictionaryTypeDialog.isShow = true
        this.dictionaryTypeDialog.title = '创建分类'
        this.dictionaryTypeForm.id = ''
        this.dictionaryTypeForm.title = ''
        this.dictionaryTypeForm.slug = ''
        this.$nextTick(() => {
          this.$refs.dictionaryTypeForm && this.$refs.dictionaryTypeForm.clearValidate()
        })
      },
      editDictionaryType (dictionaryType, node, e) {
        e.stopPropagation()
        this.dictionaryTypeDialog.isShow = true
        this.dictionaryTypeDialog.title = '编辑分类'
        this.dictionaryTypeForm.id = dictionaryType.id
        this.dictionaryTypeForm.title = dictionaryType.title
        this.dictionaryTypeForm.slug = dictionaryType.slug
        this.$nextTick(() => {
          this.$refs.dictionaryTypeForm && this.$refs.dictionaryTypeForm.clearValidate()
        })
      },
      deleteDictionaryType (dictionaryType, node, e) {
        e.stopPropagation()
        this.$confirm('确定要删除该分类及其字典项吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('deleteDictionaryType', {
            dictionaryTypeId: dictionaryType.id
          }).then(() => {
            this.$message.success('删除成功')
            this.getDictionaryTypeList()
          })
        }).catch(() => {
          this.$message.info('已取消')
        })
      },
      closeDictionaryTypeDialog () {
        this.dictionaryTypeDialog.isShow = false
      },
      saveDictionaryType () {
        this.$refs.dictionaryTypeForm.validate((valid) => {
          if (valid) {
            this.dictionaryTypeForm.isSubmitting = true

            this.$store.dispatch(!this.dictionaryTypeForm.id ? 'createDictionaryType' : 'updateDictionaryType', {
              id: this.dictionaryTypeForm.id,
              title: this.dictionaryTypeForm.title,
              slug: this.dictionaryTypeForm.slug
            }).then(() => {
              this.dictionaryTypeForm.isSubmitting = false
              this.dictionaryTypeDialog.isShow = false
              this.getDictionaryTypeList()
              this.$message.success('保存成功')
            }).catch(({response}) => {
              this.dictionaryTypeForm.isSubmitting = false
              this.$message.error(response.data.desc)
            })
          }
        })
      }
    },
    mounted () {
      this.getDictionaryTypeList()
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import '../../../styles/variables';

  .panel {
    margin: 10px;
    padding: 10px;
    background: $white;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '../../../styles/variables';

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
