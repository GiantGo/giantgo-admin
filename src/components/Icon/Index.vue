<template>
  <div>
    <el-button @click="selectIcon" :disabled="disabled" type="primary" plain circle>
      <svg-icon :icon-class="icon"/>
    </el-button>
    <el-dialog title="选择图标" :visible.sync="iconDialog.isShow" :close-on-click-modal="false" width="70%">
      <div class="icons-container">
        <div class="icons-wrapper">
          <div class="icon-item" v-for="item of iconsMap" :key="item"
               @click="handleCopy(generateIconCode(item), item, $event)">
            <el-tooltip placement="top">
              <div slot="content">
                {{ item }}
              </div>
              <div class="icon-tag">
                <svg-icon :icon-class="item" class-name="disabled"/>
              </div>
            </el-tooltip>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import icons from './requireIcons'
  import clipboard from '@/utils/clipboard'
  import Emitter from 'element-ui/src/mixins/emitter'

  export default {
    name: 'Icons',
    mixins: [Emitter],
    data () {
      return {
        iconsMap: icons,
        iconDialog: {
          isShow: false
        }
      }
    },
    model: {
      prop: 'icon',
      event: 'change'
    },
    props: {
      icon: {
        type: String,
        required: true
      },
      disabled: {
        type: Boolean
      }
    },
    methods: {
      generateIconCode (symbol) {
        return `<svg-icon icon-class="${symbol}" />`
      },
      handleCopy (text, item, event) {
        this.$emit('change', item)
        this.dispatch('ElFormItem', 'el.form.change', item)
        this.iconDialog.isShow = false
        clipboard(text, event, false)
      },
      selectIcon () {
        this.iconDialog.isShow = true
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '../../styles/variables.scss';

  .icons-container {
    margin: 10px 20px 0;
    overflow: hidden;
    .icons-wrapper {
      margin: 0 auto;
    }
    .icon-item {
      margin: 10px;
      height: 80px;
      text-align: center;
      width: 80px;
      float: left;
      color: #24292e;
      cursor: pointer;

      .icon-tag {
        margin: 0 auto;
        width: 80px;
        height: 80px;
        line-height: 80px;
        border-radius: 3px;
        font-size: 30px;
        background: #f4f9ff;
        color: $primary-color;
      }

      .icon-name {
        font-size: 14px;
      }
    }
    span {
      display: block;
      font-size: 16px;
      margin-top: 10px;
    }
    .disabled {
      pointer-events: none;
    }
  }
</style>
