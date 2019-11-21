import userScreening from 'components/userScreening/index.vue'
export default {
	components: {
		userScreening,
	},
	data() {
		return {
			positionList: [{
				account_name: '某某',
				user_tree: '归属',
				trading_lots: '0',
				trading_count: '0',
				payback: '0.00',
			}],
			
		}
	}
}