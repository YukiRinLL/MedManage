<template>
  <div class="news-management">
    <div class="page-header">
      <h2>新闻管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加新闻
      </el-button>
    </div>

    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入标题关键词"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <el-table
        :data="newsList"
        v-loading="loading"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="封面" width="120" align="center">
          <template #default="{ row }">
            <el-image
              v-if="row.coverImage"
              :src="row.coverImage"
              :preview-src-list="[row.coverImage]"
              fit="cover"
              style="width: 80px; height: 60px; border-radius: 4px;"
            />
            <div v-else class="no-image">无封面</div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="source" label="来源" width="120" show-overflow-tooltip />
        <el-table-column prop="viewCount" label="浏览量" width="100" align="center" />
        <el-table-column prop="isTop" label="置顶" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.isTop ? 'danger' : 'info'">
              {{ row.isTop ? '置顶' : '正常' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '已发布' : '已下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="publishTime" label="发布时间" width="180" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="primary" link @click="handlePreview(row)">
              <el-icon><View /></el-icon>
              预览
            </el-button>
            <el-button 
              :type="row.isTop ? 'warning' : 'success'" 
              link 
              @click="handleToggleTop(row)"
            >
              <el-icon><Top /></el-icon>
              {{ row.isTop ? '取消置顶' : '置顶' }}
            </el-button>
            <el-popconfirm
              title="确定删除这条新闻吗？"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button type="danger" link>
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model="pagination.page"
          :page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="900px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="news-form"
      >
        <el-form-item label="文章链接" prop="url">
          <el-input
            v-model="form.url"
            placeholder="请输入微信公众号文章链接（可选）"
            @blur="handleUrlBlur"
          >
            <template #append>
              <el-button-group>
                <el-button @click="fetchTitle" :loading="fetchingTitle" size="small">
                  获取标题
                </el-button>
                <el-button @click="fetchContentFromUrl" :loading="fetchingContent" type="primary" size="small">
                  获取内容
                </el-button>
              </el-button-group>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>

        <el-form-item label="封面图">
          <el-input v-model="form.coverImage" placeholder="请输入封面图URL或上传图片">
            <template #append>
              <el-upload
                class="cover-upload"
                action=""
                :auto-upload="false"
                :on-change="handleCoverUpload"
                accept="image/*"
              >
                <el-button type="primary">上传封面</el-button>
              </el-upload>
            </template>
          </el-input>
          <div v-if="form.coverImage" class="cover-preview">
            <el-image
              :src="form.coverImage"
              fit="cover"
              style="width: 200px; height: 120px; border-radius: 4px; margin-top: 10px;"
            />
          </div>
        </el-form-item>

        <el-form-item label="来源">
          <el-input v-model="form.source" placeholder="请输入文章来源" />
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <div class="editor-container">
            <Toolbar
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              mode="default"
              style="border-bottom: 1px solid #dcdfe6;"
            />
            <Editor
              v-model="form.content"
              :defaultConfig="editorConfig"
              mode="default"
              @onCreated="handleEditorCreated"
              style="height: 400px; overflow-y: hidden;"
            />
          </div>
        </el-form-item>

        <el-form-item label="发布时间" prop="publishTime">
          <el-date-picker
            v-model="form.publishTime"
            type="datetime"
            placeholder="选择发布时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%;"
          />
          <span class="form-tip">不选择则默认为当前时间</span>
        </el-form-item>

        <el-form-item label="置顶">
          <el-switch
            v-model="form.isTop"
            active-text="置顶"
            inactive-text="正常"
            :active-value="true"
            :inactive-value="false"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">发布</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="previewVisible"
      title="文章预览"
      width="900px"
      destroy-on-close
      class="preview-dialog"
    >
      <div class="article-preview" v-loading="previewLoading">
        <h1 class="article-title">{{ previewData.title }}</h1>
        <div class="article-meta">
          <span v-if="previewData.source">来源：{{ previewData.source }}</span>
          <span>发布时间：{{ previewData.createdAt }}</span>
        </div>
        <div class="article-content" v-html="previewData.content"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Search, Edit, Delete, View, Top } from '@element-plus/icons-vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { getNewsList, createNews, updateNews, deleteNews, toggleNewsTop, fetchTitle as apiFetchTitle, fetchContent, fetchCover as apiFetchCover } from '@/api/news'

console.log('News Index.vue 组件加载 - WangEditor已导入')

const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('添加新闻')
const submitting = ref(false)
const fetchingTitle = ref(false)
const fetchingCover = ref(false)
const fetchingContent = ref(false)
const formRef = ref(null)
const isEdit = ref(false)
const currentId = ref(null)

const searchForm = reactive({
  keyword: ''
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const newsList = ref([])

const form = reactive({
  title: '',
  url: '',
  content: '',
  coverImage: '',
  source: '',
  isTop: false,
  publishTime: '',
  status: 1
})

const editorRef = ref(null)

const toolbarConfig = {}

const editorConfig = { 
  placeholder: '请输入文章内容',
  MENU_CONF: {
    uploadImage: {
      customUpload(file, insertFn) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function (e) {
          const base64Str = e.target.result
          insertFn(base64Str, '', '')
        }
        reader.onerror = function () {
          ElMessage.error('图片上传失败')
        }
      }
    }
  }
}

const handleEditorCreated = (editorInstance) => {
  editorRef.value = editorInstance
}

const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 2, max: 200, message: '标题长度在2-200个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' }
  ]
}

const previewVisible = ref(false)
const previewLoading = ref(false)
const previewData = reactive({
  title: '',
  content: '',
  source: '',
  createdAt: ''
})

const loadData = async () => {
  loading.value = true
  try {
    const res = await getNewsList(pagination.page - 1, pagination.size)
    if (res.code === 200) {
      newsList.value = res.data.content
      pagination.total = res.data.totalElements
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  if (searchForm.keyword) {
    searchNews()
  } else {
    loadData()
  }
}

const searchNews = async () => {
  loading.value = true
  try {
    const res = await getNewsList(pagination.page - 1, pagination.size, searchForm.keyword)
    if (res.code === 200) {
      newsList.value = res.data.content
      pagination.total = res.data.totalElements
    }
  } catch (error) {
    console.error('搜索失败:', error)
    ElMessage.error('搜索失败')
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  searchForm.keyword = ''
  pagination.page = 1
  loadData()
}

const handleAdd = () => {
  isEdit.value = false
  currentId.value = null
  dialogTitle.value = '添加新闻'
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  currentId.value = row.id
  dialogTitle.value = '编辑新闻'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  try {
    const res = await deleteNews(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadData()
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch (error) {
    console.error('删除失败:', error)
    ElMessage.error('删除失败')
  }
}

const handleToggleTop = async (row) => {
  try {
    const res = await toggleNewsTop(row.id, !row.isTop)
    if (res.code === 200) {
      ElMessage.success(row.isTop ? '已取消置顶' : '已置顶')
      loadData()
    } else {
      ElMessage.error(res.message || '操作失败')
    }
  } catch (error) {
    console.error('置顶操作失败:', error)
    ElMessage.error('操作失败')
  }
}

const handleSubmit = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    let res
    if (isEdit.value) {
      res = await updateNews(currentId.value, form)
    } else {
      res = await createNews(form)
    }

    if (res.code === 200) {
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      dialogVisible.value = false
      loadData()
    } else {
      ElMessage.error(res.message || (isEdit.value ? '更新失败' : '创建失败'))
    }
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
  } finally {
    submitting.value = false
  }
}

const handleUrlBlur = () => {
  if (form.url && !form.title) {
    fetchTitle()
  }
}

const fetchTitle = async () => {
  if (!form.url) {
    ElMessage.warning('请先输入文章链接')
    return
  }
  fetchingTitle.value = true
  try {
    const res = await apiFetchTitle(form.url)
    if (res.code === 200 && res.data) {
      form.title = res.data
      ElMessage.success('获取标题成功')
    } else {
      ElMessage.warning('获取标题失败，请手动输入')
    }
  } catch (error) {
    console.error('获取标题失败:', error)
    ElMessage.error('获取标题失败')
  } finally {
    fetchingTitle.value = false
  }
}

const fetchContentFromUrl = async () => {
  if (!form.url) {
    ElMessage.warning('请先输入文章链接')
    return
  }
  fetchingContent.value = true
  try {
    const res = await fetchContent(form.url)
    if (res.code === 200 && res.data) {
      form.content = res.data
      ElMessage.success('获取内容成功，已导入编辑器')
    } else {
      ElMessage.warning('获取内容失败，请手动输入')
    }
  } catch (error) {
    console.error('获取内容失败:', error)
    ElMessage.error('获取内容失败')
  } finally {
    fetchingContent.value = false
  }
}

const handleCoverUpload = (file) => {
  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = function (e) {
    const base64Str = e.target.result
    form.coverImage = base64Str
    ElMessage.success('封面上传成功')
  }
}

const handlePreview = async (row) => {
  previewVisible.value = true
  previewLoading.value = true
  previewData.title = row.title
  previewData.source = row.source
  previewData.createdAt = row.createdAt

  if (row.content) {
    previewData.content = row.content
    previewLoading.value = false
  } else if (row.url) {
    try {
      const res = await fetchContent(row.url)
      if (res.code === 200 && res.data) {
        previewData.content = res.data
      } else {
        previewData.content = '<p style="text-align: center; color: #999;">无法获取文章内容</p>'
      }
    } catch (error) {
      console.error('获取内容失败:', error)
      previewData.content = '<p style="text-align: center; color: #999;">无法获取文章内容</p>'
    } finally {
      previewLoading.value = false
    }
  } else {
    previewData.content = '<p style="text-align: center; color: #999;">文章内容为空</p>'
    previewLoading.value = false
  }
}

const resetForm = () => {
  form.title = ''
  form.url = ''
  form.content = ''
  form.coverImage = ''
  form.source = ''
  form.sortOrder = 0
  form.status = 1
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

const handleSizeChange = (size) => {
  pagination.size = size
  loadData()
}

const handlePageChange = (page) => {
  pagination.page = page
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.news-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.table-card {
  margin-bottom: 20px;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.no-image {
  width: 80px;
  height: 60px;
  background: #f5f7fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 12px;
}

.form-tip {
  margin-left: 10px;
  color: #909399;
  font-size: 12px;
}

.cover-preview {
  margin-top: 5px;
}

.cover-upload {
  margin-left: 10px;
}

.editor-container {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.editor-container :deep(.w-e-toolbar) {
  border-bottom: 1px solid #dcdfe6;
  background-color: #f5f7fa;
}

.editor-container :deep(.w-e-text-container) {
  min-height: 400px;
  background-color: #fff;
  padding: 10px;
}

:deep(.preview-dialog .el-dialog__body) {
  max-height: 70vh;
  overflow-y: auto;
  padding: 20px 30px;
}

.article-preview {
  background: #fff;
}

.article-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  line-height: 1.4;
}

.article-meta {
  color: #999;
  font-size: 14px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.article-meta span {
  margin-right: 20px;
}

.article-content {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
}

.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 15px auto;
}

.article-content :deep(p) {
  margin-bottom: 15px;
}
</style>
