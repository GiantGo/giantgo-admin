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
            @current-change="(data) => getDictionaryItemList(data.id)">
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
        <div class="panel">
          <div class="dictionary-item-tip" v-show="currentDictionaryTypeId === ''">
            <svg-icon class-name="drag-icon" icon-class="tip"/>
            请选择字典分类
          </div>
          <div v-show="currentDictionaryTypeId !== ''">
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
        </div>
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
  import { mapGetters } from 'vuex'
  import { cloneDeep } from 'lodash'
  import iconPicker from '@/components/Icon/Index'
  import treeTable from '@/components/TreeTable/Index'
  import { parseTime } from '@/utils'
  import { treeSelectNormalizer, setTreeDisable } from '@/utils/tree'
  import treeSelect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    name: 'Dictionary',
    components: {
      iconPicker,
      treeTable,
      treeSelect
    },
    data () {
      const parentValidator = (rule, value, callback) => {
        if (value === this.dictionaryItemForm.id) {
          callback(new Error('所属上级不能是本身'))
        } else {
          callback()
        }
      }
      return {
        defaultProps: {
          children: 'children',
          label: 'title'
        },
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
        dictionaryBreadcrumbs: [],
        dictionaryTypeDialog: {
          isShow: false,
          title: ''
        },
        dictionaryItemDialog: {
          isShow: false,
          title: ''
        },
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
          order: '',
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
        dictionaryItemRule: {
          title: [
            {required: true, message: '请输入标题', trigger: 'change'}
          ],
          slug: [
            {required: true, message: '请输入编码', trigger: 'change'}
          ],
          parentId: [
            {required: true, message: '请选择所属上级', trigger: 'change'},
            {validator: parentValidator, trigger: 'change'}
          ]
        },
        currentDictionaryTypeId: '',
        dictionaryTypes: [],
        dictionaryItemTable: [],
        dictionaryItemTree: []
      }
    },
    computed: {
      ...mapGetters([])
    },
    methods: {
      parseTime,
      treeSelectNormalizer,
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
      getDictionaryItemList (dictionaryTypeId) {
        this.currentDictionaryTypeId = dictionaryTypeId
        this.$store.dispatch('getDictionaryItemTree', {
          dictionaryTypeId: dictionaryTypeId
        }).then(res => {
          this.dictionaryItemTable = res.data
        })
      },
      parentIdChange () {
        this.$refs.dictionaryItemForm.validateField('parentId')
      },
      addDictionaryType () {
        this.dictionaryTypeDialog.isShow = true
        this.dictionaryTypeDialog.title = '创建分类'
        this.dictionaryTypeForm.id = ''
        this.dictionaryTypeForm.title = ''
        this.dictionaryTypeForm.slug = ''
        this.$nextTick(() => {
          this.$refs.dictionaryTypeForm.clearValidate()
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
          this.$refs.dictionaryTypeForm.clearValidate()
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
            dictionaryTypeId: this.currentDictionaryTypeId,
            dictionaryItemId: dictionaryItem.id
          }).then(() => {
            this.$message.success('删除成功')
            this.getDictionaryItemList(this.currentDictionaryTypeId)
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
              dictionaryTypeId: this.currentDictionaryTypeId,
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
              this.getDictionaryItemList(this.currentDictionaryTypeId)
              this.$message.success('保存成功')
            }).catch(({response}) => {
              this.dictionaryItemForm.isSubmitting = false
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

  .panel {
    margin: 10px;
    padding: 10px;
    background: $white;
  }

  .dictionary-item-tip {
    height: 365px;
    line-height: 365px;
    text-align: center;
    font-size: 18px;
    color: $primary-color;
  }
</style>
