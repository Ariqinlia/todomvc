(function () {
	Vue.directive('focus',{
		inserted: function (el) {
			el.focus();
		}
	})
	//该指令被作用到了所有li中的input上了 每当模板更新的时候就会执行
	Vue.directive('todo-focus',{
		update (el,binding) {
			if(binding.value){
				el.focus();
			}
		}
	})
	window.app = new Vue({
		data: {
			todos: JSON.parse(window.localStorage.getItem('todos')||'[]'),
			currentEditing: null,
			filterText: 'all'
		},
		computed: {
			remainCount: {
				get () {
					return this.todos.filter(item => !item.completed).length
				}
			},

			toggleAllState: {
				get () {
					return this.todos.every(item => item.completed)
				},

				set () {
					const checked=!this.toggleAllState
					this.todos.forEach(item => item.completed=checked)
				}
			},

			filterTodos () {
				switch (this.filterText) {
					case 'active':
						return this.todos.filter(item => !item.completed)
						break
					case 'completed':
						return this.todos.filter(item => item.completed)
						break
					default:
						return this.todos
						break
				}
			}
		},
		watch: {
			todos: {
				handler () {
					window.localStorage.setItem('todos',JSON.stringify(this.todos))
				},
				deep: true //深度监视
			}
		},
		methods: {
			handleNewTodoKeydown (e) {
				const target=e.target
				const value=target.value.trim()
				// 数据校验
				if(!value.length) return
				this.todos.push({
					id:this.todos.length+1,
					title:value,
					completed:false
				})
				target.value=""
			},

			handleDeleteClick (index) {
				this.todos.splice(index,1)
			},

			handleDblclickLabel (item) {
				// 如果currentEditing=item 则作用editing样式
				this.currentEditing=item
			},

			handleSaveEditingKeydown (item,index,e) {
				// 按下enter保存title并且移除editing样式
				// 如果编辑后为空 则直接删除
				const target=e.target
				const value=target.value.trim()
				if(!value.length) {
					this.todos.splice(index,1)
				}else{
					item.title=value
					this.currentEditing=null
				}
			},

			handleEscEditingKeydown (item) {
				// 按下esc取消编辑状态 title还是原来的title
				this.currentEditing=null
			},

			handleClearCompleted () {
				console.log(112);
				for(let i=0;i<this.todos.length;i++){
					if(this.todos[i].completed){
						this.todos.splice(i,1);
						i--;
					}
				}
				console.log(this.todos);
			},
		}
	}).$mount('#app')
	
	//页面初始化的时候调用一次，保持过滤状态
	handleHashChange()

	window.onhashchange=handleHashChange

	function handleHashChange() {
		app.filterText=window.location.hash.substr(2)
		// console.log(app.filterText)
	}
})()
