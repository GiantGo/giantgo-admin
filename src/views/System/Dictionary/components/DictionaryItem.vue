<template>
  <div class="panel">
    <div class="dictionary-item-tip" v-show="dictionaryTypeId <= 0">
      <svg-icon class-name="drag-icon" icon-class="tip"/>
      请选择字典分类
    </div>
    <div v-show="dictionaryTypeId > -1">
      <div class="filter-container">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                   @click="addDictionaryItem">
          添加字典项
        </el-button>
      </div>
      <tree-table :data="dictionaryItemTable" :expand-all="true" border :columns="columns">
        <el-table-column prop="createdAt" label="创建日期">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createdAt) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="editDictionaryItem(scope.row)">编 辑</el-button>
            <el-button type="danger" @click="deleteDictionaryItem(scope.row)">删 除</el-button>
          </template>
        </el-table-column>
      </tree-table>
    </div>
    <el-dialog :title="dictionaryItemDialog.title" :visible.sync="dictionaryItemDialog.isShow"
               :close-on-click-modal="false">
      <el-form ref="dictionaryItemForm" :model="dictionaryItemForm" :rules="dictionaryItemRule" label-position="left"
               label-width="120px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="字典项标题" prop="title">
          <el-input v-model="dictionaryItemForm.title"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="slug">
          <el-input v-model="dictionaryItemForm.slug"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="dictionaryItemForm.order"></el-input-number>
        </el-form-item>
        <el-form-item label="所属上级" prop="parentId">
          <tree-select v-model="dictionaryItemForm.parentId" :options="dictionaryItemTree"
                       :normalizer="treeSelectNormalizer({label: 'title'})"
                       placeholder="请选择所属上级"
                       @input="parentIdChange">
          </tree-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="closeDictionaryItemDialog">取 消</el-button>
        <el-button type="primary" @click="saveDictionaryItem" :loading="dictionaryItemForm.isSubmitting">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import treeSelect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import treeTable from '@/components/TreeTable/Index'
  import { cloneDeep } from 'lodash'
  import { treeSelectNormalizer, setTreeDisable } from '@/utils/tree'
  import { parseTime } from '@/utils'

  export default {
    name: 'DictionaryItem',
    components: {treeSelect, treeTable},
    props: {
      dictionaryTypeId: {
        type: Number
      }
    },
    data () {
      return {
        columns: [
          {
            text: '标题',
            value: 'title'
          },
          {
            text: '编码',
            value: 'slug'
          }
        ],
        dictionaryItemDialog: {
          isShow: false,
          title: ''
        },
        dictionaryItemForm: {
          id: '',
          parentId: '',
          title: '',
          slug: '',
          order: '',
          isSubmitting: false
        },
        dictionaryItemRule: {
          title: [
            {required: true, message: '请输入标题', trigger: 'change'}
          ],
          slug: [
            {required: true, message: '请输入编码', trigger: 'change'}
          ],
          parentId: [
            {required: true, message: '请选择所属上级', trigger: 'change'}
          ]
        },
        dictionaryItemTable: [],
        dictionaryItemTree: []
      }
    },
    watch: {
      dictionaryTypeId () {
        this.getDictionaryItemList()
      }
    },
    methods: {
      parseTime,
      treeSelectNormalizer,
      getDictionaryItemList () {
        this.$store.dispatch('getDictionaryItemTree', {
          dictionaryTypeId: this.dictionaryTypeId
        }).then(res => {
          this.dictionaryItemTable = res.data
        })
      },
      parentIdChange () {
        this.$refs.dictionaryItemForm.validateField('parentId')
      },
      addDictionaryItem () {
        this.dictionaryItemDialog.isShow = true
        this.dictionaryItemDialog.title = '创建字典项'
        this.dictionaryItemForm.id = ''
        this.dictionaryItemForm.title = ''
        this.dictionaryItemForm.slug = ''
        this.dictionaryItemForm.order = ''
        this.dictionaryItemForm.parentId = -1
        this.dictionaryItemTree = [{id: -1, title: '顶级', children: cloneDeep(this.dictionaryItemTable)}]
        this.$nextTick(() => {
          this.$refs.dictionaryItemForm.clearValidate()
        })
      },
      editDictionaryItem (dictionaryItem) {
        this.dictionaryItemDialog.isShow = true
        this.dictionaryItemDialog.title = '编辑字典项'
        this.dictionaryItemForm.id = dictionaryItem.id
        this.dictionaryItemForm.title = dictionaryItem.title
        this.dictionaryItemForm.slug = dictionaryItem.slug
        this.dictionaryItemForm.order = dictionaryItem.order
        this.dictionaryItemForm.parentId = dictionaryItem.parentId
        this.dictionaryItemTree = [{id: -1, title: '顶级', children: cloneDeep(this.dictionaryItemTable)}]
        setTreeDisable(dictionaryItem.id, this.dictionaryItemTree)
        this.$nextTick(() => {
          this.$refs.dictionaryItemForm.clearValidate()
        })
      },
      deleteDictionaryItem (dictionaryItem) {
        this.$confirm('确定要删除该字典项吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('deleteDictionaryItem', {
            dictionaryTypeId: this.dictionaryTypeId,
            dictionaryItemId: dictionaryItem.id
          }).then(() => {
            this.$message.success('删除成功')
            this.getDictionaryItemList()
          })
        }).catch(() => {
          this.$message.info('已取消')
        })
      },
      closeDictionaryItemDialog () {
        this.dictionaryItemDialog.isShow = false
      },
      saveDictionaryItem () {
        this.$refs.dictionaryItemForm.validate((valid) => {
          if (valid) {
            this.dictionaryItemForm.isSubmitting = true

            this.$store.dispatch(!this.dictionaryItemForm.id ? 'createDictionaryItem' : 'updateDictionaryItem', {
              dictionaryTypeId: this.dictionaryTypeId,
              dictionaryItemInfo: {
                id: this.dictionaryItemForm.id,
                title: this.dictionaryItemForm.title,
                slug: this.dictionaryItemForm.slug,
                order: this.dictionaryItemForm.order,
                parentId: this.dictionaryItemForm.parentId
              }
            }).then(() => {
              this.dictionaryItemForm.isSubmitting = false
              this.dictionaryItemDialog.isShow = false
              this.getDictionaryItemList()
              this.$message.success('保存成功')
            }).catch(({response}) => {
              this.dictionaryItemForm.isSubmitting = false
              this.$message.error(response.data.desc)
            })
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '../../../../styles/variables';

  .dictionary-item-tip {
    height: 365px;
    line-height: 365px;
    text-align: center;
    font-size: 18px;
    color: $primary-color;
  }
</style>
