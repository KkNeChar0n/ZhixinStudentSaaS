const { createApp } = Vue;

createApp({
    data() {
        return {
            username: '',
            password: '',
            isLoggedIn: false,
            isLoading: false,
            error: null,
            // 学生相关数据
            students: [],
            isLoadingStudents: false,
            studentsError: null,
            // 教练相关数据
            coaches: [],
            isLoadingCoaches: false,
            coachesError: null,
            // 页面切换
            currentPage: 'students' // 默认显示学生管理页面
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
                const response = await axios.get('http://localhost:5000/api/profile', { withCredentials: true });
                if (response.data.username) {
                    this.isLoggedIn = true;
                    this.username = response.data.username;
                    this.error = null;
                    // 登录状态下获取学生列表（默认页面）
                    this.getStudents();
                }
            } catch (err) {
                // 未登录或其他错误，不显示错误信息
                this.isLoggedIn = false;
            }
        },
        
        // 获取学生列表
        async getStudents() {
            try {
                this.isLoadingStudents = true;
                this.studentsError = null;
                
                const response = await axios.get('http://localhost:5000/api/students', { withCredentials: true });
                this.students = response.data.students;
            } catch (err) {
                this.studentsError = err.response?.data?.error || '获取学生列表失败';
                console.error('Get students error:', err);
            } finally {
                this.isLoadingStudents = false;
            }
        },
        
        // 获取教练列表
        async getCoaches() {
            try {
                this.isLoadingCoaches = true;
                this.coachesError = null;
                
                const response = await axios.get('http://localhost:5000/api/coaches', { withCredentials: true });
                this.coaches = response.data.coaches;
            } catch (err) {
                this.coachesError = err.response?.data?.error || '获取教练列表失败';
                console.error('Get coaches error:', err);
            } finally {
                this.isLoadingCoaches = false;
            }
        },
        
        // 页面切换
        switchPage(page) {
            this.currentPage = page;
            // 根据页面切换加载对应的数据
            if (page === 'students') {
                this.getStudents();
            } else if (page === 'coaches') {
                this.getCoaches();
            }
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
                
                const response = await axios.post('http://localhost:5000/api/login', {
                    username: this.username,
                    password: this.password
                }, { withCredentials: true });
                
                if (response.data.message === '登录成功') {
                    this.isLoggedIn = true;
                    this.username = response.data.username;
                    this.password = ''; // 清空密码
                    // 登录成功后获取学生列表（默认页面）
                    this.getStudents();
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
                await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
                this.isLoggedIn = false;
                this.username = '';
                this.error = null;
                this.students = []; // 清空学生列表
                this.coaches = []; // 清空教练列表
            } catch (err) {
                this.error = '登出失败，请稍后重试';
                console.error('Logout error:', err);
            } finally {
                this.isLoading = false;
            }
        }
    }
}).mount('#app');
