const { createApp } = Vue;

createApp({
    data() {
        return {
            username: '',
            password: '',
            isLoggedIn: false,
            isLoading: false,
            error: null,
            activeMenu: 'students',
            students: [],
            coaches: [],
            accounts: [],
            orders: [],
            // 学生筛选条件
            studentFilters: {
                id: '',
                name: '',
                grade: '',
                status: ''
            },
            // 教练筛选条件
            coachFilters: {
                id: '',
                name: '',
                sex: '',
                subject: '',
                status: ''
            },
            // 订单筛选条件
            orderFilters: {
                id: '',
                uid: '',
                status: ''
            },
            // 筛选后的学生和教练数据
            filteredStudents: [],
            filteredCoaches: [],
            filteredOrders: [],
            // 弹窗状态
            showAddStudentModal: false,
            showAddCoachModal: false,
            showEditStudentModal: false,
            showEditCoachModal: false,
            showDeleteConfirm: false,
            showAddOrderModal: false,
            showEditOrderModal: false,
            showCancelOrderConfirm: false,
            // 新增学生数据
            addStudentData: {
                name: '',
                sex: '',
                phone: '',
                grade: '',
                coach_ids: []
            },
            // 新增教练数据
            addCoachData: {
                name: '',
                sex: '',
                phone: '',
                subject: '',
                student_ids: []
            },
            // 编辑数据
            editStudentData: {
                id: '',
                name: '',
                sex: '',
                phone: '',
                grade: ''
            },
            editCoachData: {
                id: '',
                name: '',
                sex: '',
                phone: '',
                subject: ''
            },
            // 新增订单数据
            addOrderData: {
                student_id: '',
                student_name: '',
                amount_receivable: ''
            },
            // 编辑订单数据
            editOrderData: {
                id: '',
                student_id: '',
                student_name: '',
                amount_receivable: ''
            },
            // 删除确认数据
            deleteId: null,
            deleteType: '',
            cancelOrderId: null,
            // 性别选项和启用的教练列表
            sexOptions: ['男', '女'],
            activeCoaches: [],
            activeStudents: [],
            activeGrades: [],
            activeSubjects: [],
            activeStudentsForOrder: []
        };
    },
    mounted() {
        // 页面加载时检查用户是否已登录
        this.checkLoginStatus();
    },
    methods: {
        // 检查登录状态
        async checkLoginStatus() {
            try {
                const response = await axios.get('/api/profile', { withCredentials: true });
                if (response.data.username) {
                    this.isLoggedIn = true;
                    this.username = response.data.username;
                    this.error = null;
                    // 登录成功后获取学生和教练数据
                    this.fetchStudents();
                    this.fetchCoaches();
                }
            } catch (err) {
                // 未登录或其他错误，不显示错误信息
                this.isLoggedIn = false;
            }
        },
        
        // 设置活动菜单
        setActiveMenu(menu) {
            this.activeMenu = menu;
            // 切换菜单时刷新对应页面的数据
            if (menu === 'students') {
                this.fetchStudents();
            } else if (menu === 'coaches') {
                this.fetchCoaches();
            } else if (menu === 'orders') {
                this.fetchOrders();
            } else if (menu === 'accounts') {
                this.fetchAccounts();
            }
        },
        
        // 获取学生数据
        async fetchStudents() {
            try {
                const response = await axios.get('/api/students');
                this.students = response.data.students;
                // 获取数据后自动筛选
                this.filteredStudents = this.students;
            } catch (err) {
                console.error('获取学生数据失败:', err);
                this.error = '获取学生数据失败';
            }
        },
        
        // 获取教练数据
        async fetchCoaches() {
            try {
                const response = await axios.get('/api/coaches');
                this.coaches = response.data.coaches;
                // 获取数据后自动筛选
                this.filteredCoaches = this.coaches;
            } catch (err) {
                console.error('获取教练数据失败:', err);
                this.error = '获取教练数据失败';
            }
        },
        
        // 学生筛选功能
        searchStudents() {
            this.filteredStudents = this.students.filter(student => {
                // ID 精确匹配
                const idMatch = !this.studentFilters.id || student.id === parseInt(this.studentFilters.id);
                // 姓名模糊匹配
                const nameMatch = !this.studentFilters.name || student.student_name.toLowerCase().includes(this.studentFilters.name.toLowerCase());
                // 年级精确匹配
                const gradeMatch = !this.studentFilters.grade || student.grade === this.studentFilters.grade;
                // 状态精确匹配
                const statusMatch = this.studentFilters.status === '' || student.status === parseInt(this.studentFilters.status);
                return idMatch && nameMatch && gradeMatch && statusMatch;
            });
        },
        
        // 重置学生筛选
        resetStudentFilters() {
            this.studentFilters = {
                id: '',
                name: '',
                grade: '',
                status: ''
            };
            this.filteredStudents = this.students;
        },
        
        // 教练筛选功能
        searchCoaches() {
            this.filteredCoaches = this.coaches.filter(coach => {
                // ID 精确匹配
                const idMatch = !this.coachFilters.id || coach.id === parseInt(this.coachFilters.id);
                // 姓名模糊匹配
                const nameMatch = !this.coachFilters.name || coach.coach_name.toLowerCase().includes(this.coachFilters.name.toLowerCase());
                // 性别精确匹配
                const sexMatch = !this.coachFilters.sex || coach.sex === this.coachFilters.sex;
                // 学科精确匹配
                const subjectMatch = !this.coachFilters.subject || coach.subject === this.coachFilters.subject;
                // 状态精确匹配
                const statusMatch = this.coachFilters.status === '' || coach.status === parseInt(this.coachFilters.status);
                return idMatch && nameMatch && sexMatch && subjectMatch && statusMatch;
            });
        },
        
        // 重置教练筛选
        resetCoachFilters() {
            this.coachFilters = {
                id: '',
                name: '',
                sex: '',
                subject: '',
                status: ''
            };
            this.filteredCoaches = this.coaches;
        },
        
        // 登录方法
        async login() {
            if (!this.username || !this.password) {
                this.error = '用户名和密码不能为空';
                return;
            }
            
            try {
                this.isLoading = true;
                this.error = null;
                
                const response = await axios.post('/api/login', {
                    username: this.username,
                    password: this.password
                }, { withCredentials: true });
                
                if (response.data.message === '登录成功') {
                    this.isLoggedIn = true;
                    this.username = response.data.username;
                    this.password = ''; // 清空密码
                    // 登录成功后获取学生和教练数据
                    this.fetchStudents();
                    this.fetchCoaches();
                }
            } catch (err) {
                this.error = err.response?.data?.error || '登录失败，请检查用户名和密码';
                console.error('Login error:', err);
            } finally {
                this.isLoading = false;
            }
        },
        
        // 登出方法
        async logout() {
            try {
                this.isLoading = true;
                await axios.post('/api/logout', {}, { withCredentials: true });
                this.isLoggedIn = false;
                this.username = '';
                this.error = null;
            } catch (err) {
                this.error = '登出失败，请稍后重试';
                console.error('Logout error:', err);
            } finally {
                this.isLoading = false;
            }
        },
        
        // 学生新增功能
        async openAddStudentModal() {
            // 获取启用的教练列表
            try {
                const response = await axios.get('/api/coaches/active', { withCredentials: true });
                this.activeCoaches = response.data.coaches;
            } catch (err) {
                console.error('获取启用教练列表失败:', err);
                this.error = '获取启用教练列表失败';
            }

            // 获取启用的年级列表
            try {
                const response = await axios.get('/api/grades/active', { withCredentials: true });
                this.activeGrades = response.data.grades;
            } catch (err) {
                console.error('获取启用年级列表失败:', err);
                this.error = '获取启用年级列表失败';
            }

            this.showAddStudentModal = true;
        },

        closeAddStudentModal() {
            this.showAddStudentModal = false;
            this.addStudentData = {
                name: '',
                sex: '',
                phone: '',
                grade: '',
                coach_ids: []
            };
        },

        async saveAddStudent() {
            // 验证必填字段
            if (!this.addStudentData.name || !this.addStudentData.sex ||
                !this.addStudentData.phone || !this.addStudentData.grade) {
                alert('请填写所有必填字段');
                return;
            }

            try {
                // 调用后端API来新增学生
                const response = await axios.post('/api/students', {
                    student_name: this.addStudentData.name,
                    sex: this.addStudentData.sex,
                    phone: this.addStudentData.phone,
                    grade: this.addStudentData.grade,
                    coach_ids: this.addStudentData.coach_ids
                }, { withCredentials: true });

                if (response.data.message === '学生添加成功') {
                    // 添加成功后刷新学生数据
                    await this.fetchStudents();
                    this.closeAddStudentModal();
                    alert('学生添加成功');
                }
            } catch (err) {
                console.error('新增学生失败:', err);
                alert(err.response?.data?.error || '新增学生失败');
            }
        },

        // 教练新增功能
        async openAddCoachModal() {
            // 获取启用的学生列表
            try {
                const response = await axios.get('/api/students/active', { withCredentials: true });
                this.activeStudents = response.data.students;
            } catch (err) {
                console.error('获取启用学生列表失败:', err);
                this.error = '获取启用学生列表失败';
            }

            // 获取启用的学科列表
            try {
                const response = await axios.get('/api/subjects/active', { withCredentials: true });
                this.activeSubjects = response.data.subjects;
            } catch (err) {
                console.error('获取启用学科列表失败:', err);
                this.error = '获取启用学科列表失败';
            }

            this.showAddCoachModal = true;
        },

        closeAddCoachModal() {
            this.showAddCoachModal = false;
            this.addCoachData = {
                name: '',
                sex: '',
                phone: '',
                subject: '',
                student_ids: []
            };
        },

        async saveAddCoach() {
            // 验证必填字段
            if (!this.addCoachData.name || !this.addCoachData.sex ||
                !this.addCoachData.phone || !this.addCoachData.subject) {
                alert('请填写所有必填字段');
                return;
            }

            try {
                // 调用后端API来新增教练
                const response = await axios.post('/api/coaches', {
                    coach_name: this.addCoachData.name,
                    sex: this.addCoachData.sex,
                    phone: this.addCoachData.phone,
                    subject: this.addCoachData.subject,
                    student_ids: this.addCoachData.student_ids
                }, { withCredentials: true });

                if (response.data.message === '教练添加成功') {
                    // 添加成功后刷新教练数据
                    await this.fetchCoaches();
                    this.closeAddCoachModal();
                    alert('教练添加成功');
                }
            } catch (err) {
                console.error('新增教练失败:', err);
                alert(err.response?.data?.error || '新增教练失败');
            }
        },

        // 学生编辑功能
        async openEditStudentModal(student) {
            // 获取启用的年级列表
            try {
                const response = await axios.get('/api/grades/active', { withCredentials: true });
                this.activeGrades = response.data.grades;
            } catch (err) {
                console.error('获取启用年级列表失败:', err);
                this.error = '获取启用年级列表失败';
            }

            this.editStudentData = {
                id: student.id,
                name: student.student_name,
                sex: student.sex,
                phone: student.phone,
                grade: student.grade
            };
            this.showEditStudentModal = true;
        },
        
        closeEditStudentModal() {
            this.showEditStudentModal = false;
            this.editStudentData = {
                id: '',
                name: '',
                sex: '',
                phone: '',
                grade: ''
            };
        },
        
        async saveEditStudent() {
            try {
                // 调用后端API来更新学生信息
                const response = await axios.put(`/api/students/${this.editStudentData.id}`, {
                    student_name: this.editStudentData.name,
                    sex: this.editStudentData.sex,
                    phone: this.editStudentData.phone,
                    grade: this.editStudentData.grade
                }, { withCredentials: true });
                
                if (response.data.message === '学生信息更新成功') {
                    // 更新成功后刷新学生数据
                    await this.fetchStudents();
                    this.closeEditStudentModal();
                }
            } catch (err) {
                console.error('更新学生信息失败:', err);
                this.error = err.response?.data?.error || '更新学生信息失败';
            }
        },
        
        // 教练编辑功能
        async openEditCoachModal(coach) {
            // 获取启用的学科列表
            try {
                const response = await axios.get('/api/subjects/active', { withCredentials: true });
                this.activeSubjects = response.data.subjects;
            } catch (err) {
                console.error('获取启用学科列表失败:', err);
                this.error = '获取启用学科列表失败';
            }

            this.editCoachData = {
                id: coach.id,
                name: coach.coach_name,
                sex: coach.sex,
                phone: coach.phone,
                subject: coach.subject
            };
            this.showEditCoachModal = true;
        },
        
        closeEditCoachModal() {
            this.showEditCoachModal = false;
            this.editCoachData = {
                id: '',
                name: '',
                sex: '',
                phone: '',
                subject: ''
            };
        },
        
        async saveEditCoach() {
            try {
                // 调用后端API来更新教练信息
                const response = await axios.put(`/api/coaches/${this.editCoachData.id}`, {
                    coach_name: this.editCoachData.name,
                    sex: this.editCoachData.sex,
                    phone: this.editCoachData.phone,
                    subject: this.editCoachData.subject
                }, { withCredentials: true });
                
                if (response.data.message === '教练信息更新成功') {
                    // 更新成功后刷新教练数据
                    await this.fetchCoaches();
                    this.closeEditCoachModal();
                }
            } catch (err) {
                console.error('更新教练信息失败:', err);
                this.error = err.response?.data?.error || '更新教练信息失败';
            }
        },
        
        // 删除功能
        openDeleteConfirm(id, type) {
            this.deleteId = id;
            this.deleteType = type;
            this.showDeleteConfirm = true;
        },
        
        closeDeleteConfirm() {
            this.showDeleteConfirm = false;
            this.deleteId = null;
            this.deleteType = '';
        },
        
        async confirmDelete() {
            try {
                let response;
                // 根据删除类型调用相应的后端API
                if (this.deleteType === 'student') {
                    response = await axios.delete(`/api/students/${this.deleteId}`, { withCredentials: true });
                    if (response.data.message === '学生删除成功') {
                        await this.fetchStudents(); // 更新学生数据
                    }
                } else if (this.deleteType === 'coach') {
                    response = await axios.delete(`/api/coaches/${this.deleteId}`, { withCredentials: true });
                    if (response.data.message === '教练删除成功') {
                        await this.fetchCoaches(); // 更新教练数据
                    }
                }
                this.closeDeleteConfirm();
            } catch (err) {
                console.error('删除数据失败:', err);
                this.error = err.response?.data?.error || '删除数据失败';
                this.closeDeleteConfirm();
            }
        },

        // 账号管理功能
        async fetchAccounts() {
            try {
                const response = await axios.get('/api/accounts', { withCredentials: true });
                this.accounts = response.data.accounts;
            } catch (err) {
                console.error('获取账号数据失败:', err);
                this.error = '获取账号数据失败';
            }
        },

        async enableAccount(username) {
            try {
                await axios.put(`/api/accounts/${username}/status`, {
                    status: 0
                }, { withCredentials: true });
                alert('账号已启用');
                await this.fetchAccounts();
            } catch (err) {
                console.error('启用账号失败:', err);
                alert(err.response?.data?.error || '启用账号失败');
            }
        },

        async disableAccount(username) {
            try {
                await axios.put(`/api/accounts/${username}/status`, {
                    status: 1
                }, { withCredentials: true });
                alert('账号已禁用');
                await this.fetchAccounts();
            } catch (err) {
                console.error('禁用账号失败:', err);
                alert(err.response?.data?.error || '禁用账号失败');
            }
        },

        // ==================== 订单管理功能 ====================

        // 获取订单数据
        async fetchOrders() {
            try {
                const response = await axios.get('/api/orders', { withCredentials: true });
                this.orders = response.data.orders;
                this.filteredOrders = this.orders;
            } catch (err) {
                console.error('获取订单失败:', err);
                this.error = '获取订单失败';
            }
        },

        // 订单筛选功能
        searchOrders() {
            this.filteredOrders = this.orders.filter(order => {
                const idMatch = !this.orderFilters.id || order.id === parseInt(this.orderFilters.id);
                const uidMatch = !this.orderFilters.uid || order.uid === parseInt(this.orderFilters.uid);
                const statusMatch = this.orderFilters.status === '' || order.status === parseInt(this.orderFilters.status);
                return idMatch && uidMatch && statusMatch;
            });
        },

        // 重置订单筛选
        resetOrderFilters() {
            this.orderFilters = {
                id: '',
                uid: '',
                status: ''
            };
            this.filteredOrders = this.orders;
        },

        // 获取订单状态文本
        getOrderStatusText(status) {
            const statusMap = {
                10: '草稿',
                20: '审核中',
                30: '已通过',
                40: '已驳回',
                99: '已作废'
            };
            return statusMap[status] || '未知';
        },

        // 打开新增订单弹窗
        async openAddOrderModal() {
            // 获取启用的学生列表
            try {
                const response = await axios.get('/api/students/active', { withCredentials: true });
                this.activeStudentsForOrder = response.data.students;
            } catch (err) {
                console.error('获取启用学生列表失败:', err);
                this.error = '获取启用学生列表失败';
            }
            this.showAddOrderModal = true;
        },

        // 关闭新增订单弹窗
        closeAddOrderModal() {
            this.showAddOrderModal = false;
            this.addOrderData = {
                student_id: '',
                student_name: '',
                amount_receivable: ''
            };
        },

        // 学生选择变化时更新学生姓名
        onStudentChange() {
            const student = this.activeStudentsForOrder.find(s => s.id === parseInt(this.addOrderData.student_id));
            if (student) {
                this.addOrderData.student_name = student.student_name;
            } else {
                this.addOrderData.student_name = '';
            }
        },

        // 保存新增订单
        async saveAddOrder() {
            if (!this.addOrderData.student_id || !this.addOrderData.amount_receivable) {
                alert('请填写所有必填字段');
                return;
            }

            try {
                const response = await axios.post('/api/orders', {
                    student_id: this.addOrderData.student_id,
                    amount_receivable: this.addOrderData.amount_receivable
                }, { withCredentials: true });

                if (response.data.message === '订单创建成功') {
                    await this.fetchOrders();
                    this.closeAddOrderModal();
                    alert('订单创建成功');
                }
            } catch (err) {
                console.error('创建订单失败:', err);
                alert(err.response?.data?.error || '创建订单失败');
            }
        },

        // 打开编辑订单弹窗
        async openEditOrderModal(order) {
            // 获取启用的学生列表
            try {
                const response = await axios.get('/api/students/active', { withCredentials: true });
                this.activeStudentsForOrder = response.data.students;
            } catch (err) {
                console.error('获取启用学生列表失败:', err);
                this.error = '获取启用学生列表失败';
            }

            this.editOrderData = {
                id: order.id,
                student_id: order.uid,
                student_name: order.student_name,
                amount_receivable: order.amount_receivable
            };
            this.showEditOrderModal = true;
        },

        // 关闭编辑订单弹窗
        closeEditOrderModal() {
            this.showEditOrderModal = false;
            this.editOrderData = {
                id: '',
                student_id: '',
                student_name: '',
                amount_receivable: ''
            };
        },

        // 编辑时学生选择变化更新学生姓名
        onEditStudentChange() {
            const student = this.activeStudentsForOrder.find(s => s.id === parseInt(this.editOrderData.student_id));
            if (student) {
                this.editOrderData.student_name = student.student_name;
            } else {
                this.editOrderData.student_name = '';
            }
        },

        // 保存编辑订单
        async saveEditOrder() {
            if (!this.editOrderData.student_id || !this.editOrderData.amount_receivable) {
                alert('请填写所有必填字段');
                return;
            }

            try {
                const response = await axios.put(`/api/orders/${this.editOrderData.id}`, {
                    student_id: this.editOrderData.student_id,
                    amount_receivable: this.editOrderData.amount_receivable
                }, { withCredentials: true });

                if (response.data.message === '订单更新成功') {
                    await this.fetchOrders();
                    this.closeEditOrderModal();
                    alert('订单更新成功');
                }
            } catch (err) {
                console.error('更新订单失败:', err);
                alert(err.response?.data?.error || '更新订单失败');
            }
        },

        // 打开作废订单确认弹窗
        openCancelOrderConfirm(orderId) {
            this.cancelOrderId = orderId;
            this.showCancelOrderConfirm = true;
        },

        // 关闭作废订单确认弹窗
        closeCancelOrderConfirm() {
            this.showCancelOrderConfirm = false;
            this.cancelOrderId = null;
        },

        // 确认作废订单
        async confirmCancelOrder() {
            try {
                const response = await axios.put(`/api/orders/${this.cancelOrderId}/cancel`, {}, { withCredentials: true });

                if (response.data.message === '订单已作废') {
                    await this.fetchOrders();
                    this.closeCancelOrderConfirm();
                    alert('订单已作废');
                }
            } catch (err) {
                console.error('作废订单失败:', err);
                alert(err.response?.data?.error || '作废订单失败');
            }
        }
    }
}).mount('#app');
