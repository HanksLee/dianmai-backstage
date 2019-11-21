<template>
	<div>
		<div class="pagination">
			<el-pagination layout="total, sizes, prev, pager, next, jumper" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pagingNumber" :page-size="page_size" :total="total" :current-page="page_no">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				pagingNumber: [20, 60, 100, 140, 200], //每页显示个数选择器的选项设置
				page_size: 20, //每页显示条目个数
				total: 0,
				page_no: 1,
				page_count: 0,
			}
		},
		props: {
			getList: Function,
			page: Object
		},
		watch: {
			page() {
				this.getPage()
			}
		},
		methods: {
			getPage() {
				this.total = parseFloat(this.page.total) || 0
				this.page_no = parseFloat(this.page.page_no) || 1
				this.page_count = parseFloat(this.page.page_count) || 0
			},
			handleSizeChange(val) {
				this.page_size = val
				this.getList()
				scrollTo(0, 0)
			},
			handleCurrentChange(val) {
				this.page_no = val
				this.getList()
				scrollTo(0, 0)
			},
		},
		created() {
			this.getPage()
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	.el-pagination {
		margin-bottom: 10px;
	}
</style>