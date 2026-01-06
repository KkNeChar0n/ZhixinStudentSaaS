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
            attributes: [],
            classifies: [],
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
            // 属性筛选条件
            attributeFilters: {
                id: '',
                classify: '',
                status: ''
            },
            // 类型筛选条件
            classifyFilters: {
                id: '',
                level: '',
                status: ''
            },
            // 筛选后的学生和教练数据
            filteredStudents: [],
            filteredCoaches: [],
            filteredOrders: [],
            filteredAttributes: [],
            filteredClassifies: [],
            // 弹窗状态
            showAddStudentModal: false,
            showAddCoachModal: false,
            showEditStudentModal: false,
            showEditCoachModal: false,
            showDeleteConfirm: false,
            showAddOrderModal: false,
            showEditOrderModal: false,
            showCancelOrderConfirm: false,
            showAddAttributeModal: false,
            showEditAttributeModal: false,
            showEnableAttributeConfirm: false,
            showDisableAttributeConfirm: false,
            showAddClassifyModal: false,
            showEditClassifyModal: false,
            showEnableClassifyConfirm: false,
            showDisableClassifyConfirm: false,
            showAttributeValuesModal: false,
            // 新增学生数据
            addStudentData: {
                name: '',
                sex_id: '',
                phone: '',
                grade_id: '',
                coach_ids: []
            },
            // 新增教练数据
            addCoachData: {
                name: '',
                sex_id: '',
                phone: '',
                subject_id: '',
                student_ids: []
            },
            // 编辑数据
            editStudentData: {
                id: '',
                name: '',
                sex_id: '',
                phone: '',
                grade_id: ''
            },
            editCoachData: {
                id: '',
                name: '',
                sex_id: '',
                phone: '',
                subject_id: ''
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
            // 新增属性数据
            addAttributeData: {
                name: '',
                classify: ''
            },
            // 编辑属性数据
            editAttributeData: {
                id: '',
                name: '',
                classify: ''
            },
            // 新增类型数据
            addClassifyData: {
                name: '',
                level: '',
                parent_id: ''
            },
            // 编辑类型数据
            editClassifyData: {
                id: '',
                name: '',
                level: '',
                parent_id: ''
            },
            // 父级类型列表
            parentClassifies: [],
            // 类型操作ID
            classifyId: null,
            // 属性值数据
            currentAttributeId: null,
            currentAttributeName: '',
            attributeValues: [''],
            // 删除确认数据
            deleteId: null,
            deleteType: '',
            cancelOrderId: null,
            attributeId: null,
            // 性别列表和启用的教练列表
            sexes: [],
            activeCoaches: [],
            activeStudents: [],
            activeGrades: [],
            activeSubjects: [],
            activeStudentsForOrder: [],
            // 展开的菜单列表
            expandedMenus: [],
            // 菜单树数据
            menuTree: []
        };
    },
    mounted() {
        // 页面加载时检查用户是否已登录
        this.checkLoginStatus();
        // 加载菜单数据
        this.fetchMenus();
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
        
        // 获取菜单数据
        async fetchMenus() {
            try {
                const response = await axios.get('/api/menus');
                this.menuTree = response.data.menus;
            } catch (err) {
                console.error('获取菜单失败:', err);
                // 如果获取失败，使用默认菜单结构
                this.menuTree = [
                    {
                        id: 1,
                        name: '学生管理',
                        route: null,
                        children: [{ id: 5, name: '学生管理', route: 'students' }]
                    },
                    {
                        id: 2,
                        name: '教练管理',
                        route: null,
                        children: [{ id: 6, name: '教练管理', route: 'coaches' }]
                    },
                    {
                        id: 3,
                        name: '订单管理',
                        route: null,
                        children: [{ id: 7, name: '订单管理', route: 'orders' }]
                    },
                    {
                        id: 4,
                        name: '系统设置',
                        route: null,
                        children: [{ id: 8, name: '账号管理', route: 'accounts' }]
                    }
                ];
            }
        },

        // 切换菜单展开/收起
        toggleMenu(menuKey) {
            const index = this.expandedMenus.indexOf(menuKey);
            if (index > -1) {
                // 如果已展开，则收起
                this.expandedMenus.splice(index, 1);
            } else {
                // 如果未展开，则展开
                this.expandedMenus.push(menuKey);
            }
        },

        // 获取菜单的key（用于展开/收起）
        getMenuKey(menu) {
            // 使用route作为key，如果没有route则使用name
            return menu.route || menu.name.toLowerCase();
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
            } else if (menu === 'attributes') {
                this.fetchAttributes();
            } else if (menu === 'classifies') {
                this.fetchClassifies();
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
            // 获取性别列表
            try {
                const response = await axios.get('/api/sexes', { withCredentials: true });
                this.sexes = response.data.sexes;
            } catch (err) {
                console.error('获取性别列表失败:', err);
                this.error = '获取性别列表失败';
            }

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
                sex_id: '',
                phone: '',
                grade_id: '',
                coach_ids: []
            };
        },

        async saveAddStudent() {
            // 验证必填字段
            if (!this.addStudentData.name || !this.addStudentData.sex_id ||
                !this.addStudentData.phone || !this.addStudentData.grade_id) {
                alert('请填写所有必填字段');
                return;
            }

            try {
                // 调用后端API来新增学生
                const response = await axios.post('/api/students', {
                    student_name: this.addStudentData.name,
                    sex_id: this.addStudentData.sex_id,
                    phone: this.addStudentData.phone,
                    grade_id: this.addStudentData.grade_id,
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
            // 获取性别列表
            try {
                const response = await axios.get('/api/sexes', { withCredentials: true });
                this.sexes = response.data.sexes;
            } catch (err) {
                console.error('获取性别列表失败:', err);
                this.error = '获取性别列表失败';
            }

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
                sex_id: '',
                phone: '',
                subject_id: '',
                student_ids: []
            };
        },

        async saveAddCoach() {
            // 验证必填字段
            if (!this.addCoachData.name || !this.addCoachData.sex_id ||
                !this.addCoachData.phone || !this.addCoachData.subject_id) {
                alert('请填写所有必填字段');
                return;
            }

            try {
                // 调用后端API来新增教练
                const response = await axios.post('/api/coaches', {
                    coach_name: this.addCoachData.name,
                    sex_id: this.addCoachData.sex_id,
                    phone: this.addCoachData.phone,
                    subject_id: this.addCoachData.subject_id,
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
            // 获取性别列表
            try {
                const response = await axios.get('/api/sexes', { withCredentials: true });
                this.sexes = response.data.sexes;
            } catch (err) {
                console.error('获取性别列表失败:', err);
                this.error = '获取性别列表失败';
            }

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
                sex_id: student.sex_id,
                phone: student.phone,
                grade_id: student.grade_id
            };
            this.showEditStudentModal = true;
        },

        closeEditStudentModal() {
            this.showEditStudentModal = false;
            this.editStudentData = {
                id: '',
                name: '',
                sex_id: '',
                phone: '',
                grade_id: ''
            };
        },

        async saveEditStudent() {
            try {
                // 调用后端API来更新学生信息
                const response = await axios.put(`/api/students/${this.editStudentData.id}`, {
                    student_name: this.editStudentData.name,
                    sex_id: this.editStudentData.sex_id,
                    phone: this.editStudentData.phone,
                    grade_id: this.editStudentData.grade_id
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
            // 获取性别列表
            try {
                const response = await axios.get('/api/sexes', { withCredentials: true });
                this.sexes = response.data.sexes;
            } catch (err) {
                console.error('获取性别列表失败:', err);
                this.error = '获取性别列表失败';
            }

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
                sex_id: coach.sex_id,
                phone: coach.phone,
                subject_id: coach.subject_id
            };
            this.showEditCoachModal = true;
        },

        closeEditCoachModal() {
            this.showEditCoachModal = false;
            this.editCoachData = {
                id: '',
                name: '',
                sex_id: '',
                phone: '',
                subject_id: ''
            };
        },

        async saveEditCoach() {
            try {
                // 调用后端API来更新教练信息
                const response = await axios.put(`/api/coaches/${this.editCoachData.id}`, {
                    coach_name: this.editCoachData.name,
                    sex_id: this.editCoachData.sex_id,
                    phone: this.editCoachData.phone,
                    subject_id: this.editCoachData.subject_id
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

        // 学生状态更新
        async updateStudentStatus(id, status) {
            try {
                await axios.put(`/api/students/${id}/status`, {
                    status: status
                }, { withCredentials: true });
                const statusText = status === 0 ? '启用' : '禁用';
                alert(`学生状态已更新为${statusText}`);
                await this.fetchStudents();
            } catch (err) {
                console.error('更新学生状态失败:', err);
                alert(err.response?.data?.error || '更新学生状态失败');
            }
        },

        // 教练状态更新
        async updateCoachStatus(id, status) {
            try {
                await axios.put(`/api/coaches/${id}/status`, {
                    status: status
                }, { withCredentials: true });
                const statusText = status === 0 ? '启用' : '禁用';
                alert(`教练状态已更新为${statusText}`);
                await this.fetchCoaches();
            } catch (err) {
                console.error('更新教练状态失败:', err);
                alert(err.response?.data?.error || '更新教练状态失败');
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

        async enableAccount(id) {
            try {
                await axios.put(`/api/accounts/${id}/status`, {
                    status: 0
                }, { withCredentials: true });
                alert('账号已启用');
                await this.fetchAccounts();
            } catch (err) {
                console.error('启用账号失败:', err);
                alert(err.response?.data?.error || '启用账号失败');
            }
        },

        async disableAccount(id) {
            try {
                await axios.put(`/api/accounts/${id}/status`, {
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
        },

        // ==================== 属性管理功能 ====================

        // 获取属性数据
        async fetchAttributes() {
            try {
                const response = await axios.get('/api/attributes', { withCredentials: true });
                this.attributes = response.data.attributes;
                this.filteredAttributes = this.attributes;
            } catch (err) {
                console.error('获取属性失败:', err);
                this.error = '获取属性失败';
            }
        },

        // 属性筛选功能
        searchAttributes() {
            this.filteredAttributes = this.attributes.filter(attr => {
                const idMatch = !this.attributeFilters.id || attr.id === parseInt(this.attributeFilters.id);
                const classifyMatch = this.attributeFilters.classify === '' || attr.classify === parseInt(this.attributeFilters.classify);
                const statusMatch = this.attributeFilters.status === '' || attr.status === parseInt(this.attributeFilters.status);
                return idMatch && classifyMatch && statusMatch;
            });
        },

        // 重置属性筛选
        resetAttributeFilters() {
            this.attributeFilters = {
                id: '',
                classify: '',
                status: ''
            };
            this.filteredAttributes = this.attributes;
        },

        // 获取分类文本
        getClassifyText(classify) {
            return classify === 0 ? '属性' : '规格';
        },

        // 获取状态文本
        getAttributeStatusText(status) {
            return status === 0 ? '启用' : '禁用';
        },

        // 打开新增属性弹窗
        openAddAttributeModal() {
            this.showAddAttributeModal = true;
        },

        // 关闭新增属性弹窗
        closeAddAttributeModal() {
            this.showAddAttributeModal = false;
            this.addAttributeData = {
                name: '',
                classify: ''
            };
        },

        // 保存新增属性
        async saveAddAttribute() {
            if (!this.addAttributeData.name || this.addAttributeData.classify === '') {
                alert('请填写所有必填字段');
                return;
            }

            try {
                const response = await axios.post('/api/attributes', {
                    name: this.addAttributeData.name,
                    classify: parseInt(this.addAttributeData.classify)
                }, { withCredentials: true });

                if (response.data.message === '属性创建成功') {
                    await this.fetchAttributes();
                    this.closeAddAttributeModal();
                    alert('属性创建成功');
                }
            } catch (err) {
                console.error('创建属性失败:', err);
                alert(err.response?.data?.error || '创建属性失败');
            }
        },

        // 打开编辑属性弹窗
        openEditAttributeModal(attribute) {
            this.editAttributeData = {
                id: attribute.id,
                name: attribute.name,
                classify: attribute.classify
            };
            this.showEditAttributeModal = true;
        },

        // 关闭编辑属性弹窗
        closeEditAttributeModal() {
            this.showEditAttributeModal = false;
            this.editAttributeData = {
                id: '',
                name: '',
                classify: ''
            };
        },

        // 保存编辑属性
        async saveEditAttribute() {
            if (!this.editAttributeData.name || this.editAttributeData.classify === '') {
                alert('请填写所有必填字段');
                return;
            }

            try {
                const response = await axios.put(`/api/attributes/${this.editAttributeData.id}`, {
                    name: this.editAttributeData.name,
                    classify: parseInt(this.editAttributeData.classify)
                }, { withCredentials: true });

                if (response.data.message === '属性更新成功') {
                    await this.fetchAttributes();
                    this.closeEditAttributeModal();
                    alert('属性更新成功');
                }
            } catch (err) {
                console.error('更新属性失败:', err);
                alert(err.response?.data?.error || '更新属性失败');
            }
        },

        // 打开启用属性确认弹窗
        openEnableAttributeConfirm(attributeId) {
            this.attributeId = attributeId;
            this.showEnableAttributeConfirm = true;
        },

        // 关闭启用属性确认弹窗
        closeEnableAttributeConfirm() {
            this.showEnableAttributeConfirm = false;
            this.attributeId = null;
        },

        // 确认启用属性
        async confirmEnableAttribute() {
            try {
                const response = await axios.put(`/api/attributes/${this.attributeId}/status`, {
                    status: 0
                }, { withCredentials: true });

                if (response.data.message === '状态更新成功') {
                    await this.fetchAttributes();
                    this.closeEnableAttributeConfirm();
                    alert('属性已启用');
                }
            } catch (err) {
                console.error('启用属性失败:', err);
                alert(err.response?.data?.error || '启用属性失败');
            }
        },

        // 打开禁用属性确认弹窗
        openDisableAttributeConfirm(attributeId) {
            this.attributeId = attributeId;
            this.showDisableAttributeConfirm = true;
        },

        // 关闭禁用属性确认弹窗
        closeDisableAttributeConfirm() {
            this.showDisableAttributeConfirm = false;
            this.attributeId = null;
        },

        // 确认禁用属性
        async confirmDisableAttribute() {
            try {
                const response = await axios.put(`/api/attributes/${this.attributeId}/status`, {
                    status: 1
                }, { withCredentials: true });

                if (response.data.message === '状态更新成功') {
                    await this.fetchAttributes();
                    this.closeDisableAttributeConfirm();
                    alert('属性已禁用');
                }
            } catch (err) {
                console.error('禁用属性失败:', err);
                alert(err.response?.data?.error || '禁用属性失败');
            }
        },

        // ==================== 属性值管理功能 ====================

        // 打开属性值管理弹窗
        async openAttributeValuesModal(attribute) {
            this.currentAttributeId = attribute.id;
            this.currentAttributeName = attribute.name;

            // 获取该属性的属性值列表
            try {
                const response = await axios.get(`/api/attributes/${attribute.id}/values`, { withCredentials: true });
                const values = response.data.values;

                // 如果有属性值，则回显；否则显示一个空输入框
                if (values && values.length > 0) {
                    this.attributeValues = values.map(v => v.name);
                } else {
                    this.attributeValues = [''];
                }
            } catch (err) {
                console.error('获取属性值失败:', err);
                this.attributeValues = [''];
            }

            this.showAttributeValuesModal = true;
        },

        // 关闭属性值管理弹窗
        closeAttributeValuesModal() {
            this.showAttributeValuesModal = false;
            this.currentAttributeId = null;
            this.currentAttributeName = '';
            this.attributeValues = [''];
        },

        // 添加属性值输入框
        addAttributeValue() {
            this.attributeValues.push('');
        },

        // 删除属性值输入框
        removeAttributeValue(index) {
            if (this.attributeValues.length > 1) {
                this.attributeValues.splice(index, 1);
            }
        },

        // 清除属性值输入框内容（当仅剩一个时）
        clearAttributeValue(index) {
            this.attributeValues[index] = '';
        },

        // 保存属性值
        async saveAttributeValues() {
            // 过滤掉空的属性值
            const validValues = this.attributeValues.filter(v => v && v.trim());

            // 验证至少有一个属性值
            if (validValues.length === 0) {
                alert('至少需要填入一条属性值');
                return;
            }

            try {
                const response = await axios.post(`/api/attributes/${this.currentAttributeId}/values`, {
                    values: validValues
                }, { withCredentials: true });

                if (response.data.message === '属性值保存成功') {
                    alert('属性值保存成功');
                    await this.fetchAttributes();
                    this.closeAttributeValuesModal();
                }
            } catch (err) {
                console.error('保存属性值失败:', err);
                alert(err.response?.data?.error || '保存属性值失败');
            }
        },

        // ==================== 类型管理功能 ====================

        // 获取类型数据
        async fetchClassifies() {
            try {
                const response = await axios.get('/api/classifies', { withCredentials: true });
                this.classifies = response.data.classifies;
                this.filteredClassifies = this.classifies;
            } catch (err) {
                console.error('获取类型失败:', err);
                this.error = '获取类型失败';
            }
        },

        // 获取启用的一级类型列表（父级类型）
        async fetchParentClassifies() {
            try {
                const response = await axios.get('/api/classifies/parents', { withCredentials: true });
                this.parentClassifies = response.data.parents;
            } catch (err) {
                console.error('获取父级类型失败:', err);
                this.error = '获取父级类型失败';
            }
        },

        // 类型筛选功能
        searchClassifies() {
            this.filteredClassifies = this.classifies.filter(classify => {
                const idMatch = !this.classifyFilters.id || classify.id === parseInt(this.classifyFilters.id);
                const levelMatch = this.classifyFilters.level === '' || classify.level === parseInt(this.classifyFilters.level);
                const statusMatch = this.classifyFilters.status === '' || classify.status === parseInt(this.classifyFilters.status);
                return idMatch && levelMatch && statusMatch;
            });
        },

        // 重置类型筛选
        resetClassifyFilters() {
            this.classifyFilters = {
                id: '',
                level: '',
                status: ''
            };
            this.filteredClassifies = this.classifies;
        },

        // 获取级别文本
        getClassifyLevelText(level) {
            return level === 0 ? '一级' : '二级';
        },

        // 获取类型状态文本
        getClassifyStatusText(status) {
            return status === 0 ? '启用' : '禁用';
        },

        // 打开新增类型弹窗
        async openAddClassifyModal() {
            await this.fetchParentClassifies();
            this.showAddClassifyModal = true;
        },

        // 关闭新增类型弹窗
        closeAddClassifyModal() {
            this.showAddClassifyModal = false;
            this.addClassifyData = {
                name: '',
                level: '',
                parent_id: ''
            };
        },

        // 新增类型级别变化时的处理
        onAddClassifyLevelChange() {
            // 如果切换到一级，清空父级选择
            if (this.addClassifyData.level === '0') {
                this.addClassifyData.parent_id = '';
            }
        },

        // 保存新增类型
        async saveAddClassify() {
            if (!this.addClassifyData.name || this.addClassifyData.level === '') {
                alert('请填写所有必填字段');
                return;
            }

            // 如果是二级类型，必须选择父级
            if (this.addClassifyData.level === '1' && !this.addClassifyData.parent_id) {
                alert('请选择父级类型');
                return;
            }

            try {
                const response = await axios.post('/api/classifies', {
                    name: this.addClassifyData.name,
                    level: parseInt(this.addClassifyData.level),
                    parent_id: this.addClassifyData.level === '1' ? parseInt(this.addClassifyData.parent_id) : null
                }, { withCredentials: true });

                if (response.data.message === '类型创建成功') {
                    await this.fetchClassifies();
                    this.closeAddClassifyModal();
                    alert('类型创建成功');
                }
            } catch (err) {
                console.error('创建类型失败:', err);
                alert(err.response?.data?.error || '创建类型失败');
            }
        },

        // 打开编辑类型弹窗
        async openEditClassifyModal(classify) {
            await this.fetchParentClassifies();
            this.editClassifyData = {
                id: classify.id,
                name: classify.name,
                level: classify.level,
                parent_id: classify.parent_id || ''
            };
            this.showEditClassifyModal = true;
        },

        // 关闭编辑类型弹窗
        closeEditClassifyModal() {
            this.showEditClassifyModal = false;
            this.editClassifyData = {
                id: '',
                name: '',
                level: '',
                parent_id: ''
            };
        },

        // 编辑类型级别变化时的处理
        onEditClassifyLevelChange() {
            // 如果切换到一级，清空父级选择
            const level = typeof this.editClassifyData.level === 'string'
                ? parseInt(this.editClassifyData.level)
                : this.editClassifyData.level;
            if (level === 0) {
                this.editClassifyData.parent_id = '';
            }
        },

        // 保存编辑类型
        async saveEditClassify() {
            const level = typeof this.editClassifyData.level === 'string'
                ? parseInt(this.editClassifyData.level)
                : this.editClassifyData.level;

            if (!this.editClassifyData.name || this.editClassifyData.level === '') {
                alert('请填写所有必填字段');
                return;
            }

            // 如果是二级类型，必须选择父级
            if (level === 1 && !this.editClassifyData.parent_id) {
                alert('请选择父级类型');
                return;
            }

            try {
                const response = await axios.put(`/api/classifies/${this.editClassifyData.id}`, {
                    name: this.editClassifyData.name,
                    level: level,
                    parent_id: level === 1 ? parseInt(this.editClassifyData.parent_id) : null
                }, { withCredentials: true });

                if (response.data.message === '类型更新成功') {
                    await this.fetchClassifies();
                    this.closeEditClassifyModal();
                    alert('类型更新成功');
                }
            } catch (err) {
                console.error('更新类型失败:', err);
                alert(err.response?.data?.error || '更新类型失败');
            }
        },

        // 打开启用类型确认弹窗
        openEnableClassifyConfirm(classifyId) {
            this.classifyId = classifyId;
            this.showEnableClassifyConfirm = true;
        },

        // 关闭启用类型确认弹窗
        closeEnableClassifyConfirm() {
            this.showEnableClassifyConfirm = false;
            this.classifyId = null;
        },

        // 确认启用类型
        async confirmEnableClassify() {
            try {
                const response = await axios.put(`/api/classifies/${this.classifyId}/status`, {
                    status: 0
                }, { withCredentials: true });

                if (response.data.message === '状态更新成功') {
                    await this.fetchClassifies();
                    this.closeEnableClassifyConfirm();
                    alert('类型已启用');
                }
            } catch (err) {
                console.error('启用类型失败:', err);
                alert(err.response?.data?.error || '启用类型失败');
            }
        },

        // 打开禁用类型确认弹窗
        openDisableClassifyConfirm(classifyId) {
            this.classifyId = classifyId;
            this.showDisableClassifyConfirm = true;
        },

        // 关闭禁用类型确认弹窗
        closeDisableClassifyConfirm() {
            this.showDisableClassifyConfirm = false;
            this.classifyId = null;
        },

        // 确认禁用类型
        async confirmDisableClassify() {
            try {
                const response = await axios.put(`/api/classifies/${this.classifyId}/status`, {
                    status: 1
                }, { withCredentials: true });

                if (response.data.message === '状态更新成功') {
                    await this.fetchClassifies();
                    this.closeDisableClassifyConfirm();
                    alert('类型已禁用');
                }
            } catch (err) {
                console.error('禁用类型失败:', err);
                alert(err.response?.data?.error || '禁用类型失败');
            }
        }
    }
}).mount('#app');
