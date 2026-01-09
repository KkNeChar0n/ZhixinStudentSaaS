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
            brands: [],
            goods: [],
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
            // 子产品订单筛选条件
            childOrderFilters: {
                id: '',
                parentsid: '',
                goodsid: '',
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
            // 品牌筛选条件
            brandFilters: {
                id: '',
                name: '',
                status: ''
            },
            // 商品筛选条件
            goodsFilters: {
                id: '',
                name: '',
                brandid: '',
                classifyid: '',
                status: ''
            },
            // 筛选后的学生和教练数据
            filteredStudents: [],
            filteredCoaches: [],
            filteredOrders: [],
            filteredChildOrders: [],
            filteredAttributes: [],
            filteredClassifies: [],
            filteredBrands: [],
            filteredGoods: [],
            // 子产品订单原始数据
            childOrders: [],
            // 分页数据
            pageSize: 10,
            studentCurrentPage: 1,
            coachCurrentPage: 1,
            orderCurrentPage: 1,
            childOrderCurrentPage: 1,
            accountCurrentPage: 1,
            attributeCurrentPage: 1,
            classifyCurrentPage: 1,
            brandCurrentPage: 1,
            goodsCurrentPage: 1,
            // 弹窗状态
            showAddStudentModal: false,
            showAddCoachModal: false,
            showEditStudentModal: false,
            showEditCoachModal: false,
            showDeleteConfirm: false,
            showAddOrderDrawer: false,
            showAddOrderGoodsModal: false,
            showEditOrderDrawer: false,
            showEditOrderGoodsModal: false,
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
            showAddBrandModal: false,
            showEditBrandModal: false,
            showEnableBrandConfirm: false,
            showDisableBrandConfirm: false,
            showAddGoodsDrawer: false,
            showEditGoodsDrawer: false,
            showEnableGoodsConfirm: false,
            showDisableGoodsConfirm: false,
            // 活动模板弹窗状态
            showAddActivityTemplateDrawer: false,
            showEditActivityTemplateDrawer: false,
            showAddTemplateGoodsModal: false,
            showEditTemplateGoodsModal: false,
            // 活动管理弹窗状态
            showAddActivityDrawer: false,
            showEditActivityDrawer: false,
            // 活动模板数据
            activityTemplates: [],
            filteredActivityTemplates: [],
            activityTemplateFilters: {
                id: '',
                name: '',
                type: '',
                status: ''
            },
            activityTemplateCurrentPage: 1,
            addActivityTemplateData: {
                name: '',
                type: '',
                select_type: '',
                status: 0,
                classify_ids: [],
                selected_classify_id: ''
            },
            templateClassifyGoods: [],
            templateClassifyGoodsCurrentPage: 1,
            // 活动模板详情
            showActivityTemplateDetailDrawer: false,
            activityTemplateDetailData: {
                id: '',
                name: '',
                type: '',
                select_type: '',
                status: 0,
                classifies: [],
                goods: []
            },
            templateDetailGoodsCurrentPage: 1,
            editActivityTemplateData: {
                id: '',
                name: '',
                type: '',
                select_type: '',
                status: 0,
                classify_ids: []
            },
            selectedTemplateGoods: [],
            editSelectedTemplateGoods: [],
            addTemplateGoodsData: {
                goods_id: '',
                name: '',
                brand_name: '',
                classify_name: '',
                price: 0
            },
            editTemplateGoodsData: {
                goods_id: '',
                name: '',
                brand_name: '',
                classify_name: '',
                price: 0
            },
            // 活动管理数据
            activities: [],
            filteredActivities: [],
            activityFilters: {
                id: '',
                name: '',
                template_id: '',
                status: ''
            },
            activityCurrentPage: 1,
            activeActivityTemplates: [],
            addActivityData: {
                name: '',
                template_id: '',
                template_type: '',
                template_select_type: '',
                start_time: '',
                end_time: '',
                status: 0,
                details: []
            },
            editActivityData: {
                id: '',
                name: '',
                template_id: '',
                template_type: '',
                template_select_type: '',
                start_time: '',
                end_time: '',
                status: 0,
                details: []
            },
            activityTemplateGoods: [],
            editActivityTemplateGoods: [],
            activityTemplateGoodsCurrentPage: 1,
            // 活动详情
            showActivityDetailDrawer: false,
            activityDetailData: {
                id: '',
                name: '',
                template_id: '',
                template_name: '',
                template_type: '',
                template_select_type: '',
                start_time: '',
                end_time: '',
                status: 0,
                details: [],
                goods: []
            },
            activityDetailGoodsCurrentPage: 1,
            // 合同管理数据
            contracts: [],
            filteredContracts: [],
            contractFilters: {
                id: '',
                student_id: '',
                student_name: '',
                type: '',
                status: '',
                payment_status: ''
            },
            contractCurrentPage: 1,
            showAddContractDrawer: false,
            showContractDetailDrawer: false,
            showSubmitContractConfirm: false,
            showRevokeContractConfirm: false,
            showTerminateContractModal: false,
            addContractData: {
                student_id: '',
                student_name: '',
                type: '',
                signature_form: '',
                name: '',
                contract_amount: '',
                signatory: ''
            },
            contractDetailData: {
                id: '',
                student_id: '',
                student_name: '',
                type: '',
                signature_form: '',
                name: '',
                contract_amount: '',
                signatory: '',
                initiating_party: '',
                initiator: '',
                status: '',
                payment_status: '',
                create_time: ''
            },
            terminationAgreementFile: null,
            // 收款管理数据
            paymentCollections: [],
            filteredPaymentCollections: [],
            paymentCollectionTab: 'regular',
            paymentCollectionSubTab: 'received',
            paymentCollectionFilters: {
                id: '',
                student_id: '',
                payer: '',
                payment_method: '',
                trading_date: '',
                status: ''
            },
            paymentCollectionCurrentPage: 1,
            showAddPaymentCollectionModal: false,
            showConfirmPaymentModal: false,
            showDeletePaymentModal: false,
            currentPaymentCollection: null,
            studentUnpaidOrders: [],
            selectedOrderInfo: null,
            paymentCollectionForm: {
                student_id: '',
                order_id: '',
                pending_amount: '',
                payment_scenario: '',
                payment_method: '',
                payment_amount: '',
                payer: '',
                payee_entity: '',
                trading_hours: ''
            },
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
                expected_payment_time: '',      // 新增：预计付款时间
                participating_activities: '',   // 新增：参加活动显示文本
                activity_ids: [],               // 新增：活动ID数组
                discount_amount: 0              // 新增：优惠金额
            },
            // 选择的订单商品列表
            selectedOrderGoods: [],
            // 可选商品列表（用于订单选择商品）
            availableGoodsForOrder: [],
            // 新增订单商品子弹窗数据
            addOrderGoodsData: {
                goods_id: '',
                name: '',
                brand_name: '',
                classify_name: '',
                attributes: '',
                price: 0,
                total_price: 0,
                isgroup: 1
            },
            // 编辑订单数据
            editOrderData: {
                id: '',
                student_id: '',
                student_name: '',
                expected_payment_time: '',      // 新增：预计付款时间
                participating_activities: '',   // 新增：参加活动显示文本
                activity_ids: [],               // 新增：活动ID数组
                discount_amount: 0              // 新增：优惠金额
            },
            // 编辑订单选择的商品列表
            editSelectedOrderGoods: [],
            // 编辑订单商品子弹窗数据
            editOrderGoodsData: {
                goods_id: '',
                name: '',
                brand_name: '',
                classify_name: '',
                attributes: '',
                price: 0,
                total_price: 0,
                isgroup: 1
            },
            // 新增：订单活动相关数据
            orderActivities: [],          // 可用活动列表
            orderActivityTemplateGoods: [], // 订单活动模板包含的商品列表
            childDiscounts: {},           // 子订单优惠分摊 {goods_id: amount}
            editChildDiscounts: {},       // 编辑订单的子订单优惠分摊
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
            // 新增品牌数据
            addBrandData: {
                name: ''
            },
            // 编辑品牌数据
            editBrandData: {
                id: '',
                name: ''
            },
            // 品牌操作ID
            brandId: null,
            // 新增商品数据
            addGoodsData: {
                name: '',
                brandid: '',
                classifyid: '',
                isgroup: 1,  // 0=组合售卖，1=非组合售卖，默认为非组合
                price: '',
                attributevalue_ids: []
            },
            // 编辑商品数据
            editGoodsData: {
                id: '',
                name: '',
                brandid: '',
                classifyid: '',
                isgroup: 1,
                price: '',
                attributevalue_ids: []
            },
            // 商品操作ID
            goodsId: null,
            // 启用的品牌、类型、属性列表
            activeBrands: [],
            activeClassifies: [],
            activeAttributes: [],
            // 商品属性选择数据（三列布局：属性 | 属性值 | +/-）
            goodsAttributeRows: [{ attributeId: '', valueId: '' }],
            // 商品规格选择数据（三列布局：规格 | 规格值 | +/-）
            goodsSpecRows: [{ attributeId: '', valueId: '' }],
            // 可用于组合的商品列表
            availableGoodsForCombo: [],
            // 已选择的包含商品列表（前端展示用）
            selectedIncludedGoods: [],
            // 子弹窗状态
            showAddIncludedGoodsModal: false,
            // 子弹窗数据
            addIncludedGoodsData: {
                goods_id: '',
                goods_name: '',
                brand_name: '',
                classify_name: '',
                attributes: '',
                price: ''
            },
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
    computed: {
        // 获取属性列表（classify=0）
        attributesList() {
            return this.activeAttributes.filter(attr => attr.classify === 0);
        },
        // 获取规格列表（classify=1）
        specsList() {
            return this.activeAttributes.filter(attr => attr.classify === 1);
        },
        // 学生分页数据
        paginatedStudents() {
            const start = (this.studentCurrentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.filteredStudents.slice(start, end);
        },
        studentTotalPages() {
            return Math.ceil(this.filteredStudents.length / this.pageSize);
        },
        // 教练分页数据
        paginatedCoaches() {
            const start = (this.coachCurrentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.filteredCoaches.slice(start, end);
        },
        coachTotalPages() {
            return Math.ceil(this.filteredCoaches.length / this.pageSize);
        },
        // 订单分页数据
        paginatedOrders() {
            const start = (this.orderCurrentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.filteredOrders.slice(start, end);
        },
        orderTotalPages() {
            return Math.ceil(this.filteredOrders.length / this.pageSize);
        },
        // 子产品订单分页数据
        paginatedChildOrders() {
            const start = (this.childOrderCurrentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.filteredChildOrders.slice(start, end);
        },
        childOrderTotalPages() {
            return Math.ceil(this.filteredChildOrders.length / this.pageSize);
        },
        // 订单应收金额（所有商品的商品总价之和）
        orderTotalReceivable() {
            if (!this.selectedOrderGoods || this.selectedOrderGoods.length === 0) {
                return 0;
            }
            return this.selectedOrderGoods.reduce((sum, goods) => {
                return sum + parseFloat(goods.total_price || 0);
            }, 0);
        },
        // 订单优惠金额
        orderDiscountAmount() {
            return parseFloat(this.addOrderData.discount_amount || 0);
        },
        // 订单实收金额（所有商品的标准售价之和 - 优惠金额）
        orderTotalReceived() {
            if (!this.selectedOrderGoods || this.selectedOrderGoods.length === 0) {
                return 0;
            }
            const subtotal = this.selectedOrderGoods.reduce((sum, goods) => {
                return sum + parseFloat(goods.price || 0);
            }, 0);
            return subtotal - this.orderDiscountAmount;
        },
        // 过滤掉已选择的商品（用于订单选择商品子弹窗）
        availableGoodsForOrderSelection() {
            const selectedIds = this.selectedOrderGoods.map(g => g.goods_id);
            return this.availableGoodsForOrder.filter(g => !selectedIds.includes(g.id));
        },
        // 编辑订单应收金额
        editOrderTotalReceivable() {
            if (!this.editSelectedOrderGoods || this.editSelectedOrderGoods.length === 0) {
                return 0;
            }
            return this.editSelectedOrderGoods.reduce((sum, goods) => {
                return sum + parseFloat(goods.total_price || 0);
            }, 0);
        },
        // 编辑订单优惠金额
        editOrderDiscountAmount() {
            return parseFloat(this.editOrderData.discount_amount || 0);
        },
        // 编辑订单实收金额（所有商品的标准售价之和 - 优惠金额）
        editOrderTotalReceived() {
            if (!this.editSelectedOrderGoods || this.editSelectedOrderGoods.length === 0) {
                return 0;
            }
            const subtotal = this.editSelectedOrderGoods.reduce((sum, goods) => {
                return sum + parseFloat(goods.price || 0);
            }, 0);
            return subtotal - this.editOrderDiscountAmount;
        },
        // 过滤掉已选择的商品（用于编辑订单选择商品子弹窗）
        availableGoodsForEditOrderSelection() {
            const selectedIds = this.editSelectedOrderGoods.map(g => g.goods_id);
            return this.availableGoodsForOrder.filter(g => !selectedIds.includes(g.id));
        },
        // 账号分页数据
        paginatedAccounts() {
            const start = (this.accountCurrentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.accounts.slice(start, end);
        },
        accountTotalPages() {
            return Math.ceil(this.accounts.length / this.pageSize);
        },
        // 属性分页数据
        paginatedAttributes() {
            const start = (this.attributeCurrentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.filteredAttributes.slice(start, end);
        },
        attributeTotalPages() {
            return Math.ceil(this.filteredAttributes.length / this.pageSize);
        },
        // 类型分页数据
        paginatedClassifies() {
            const start = (this.classifyCurrentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.filteredClassifies.slice(start, end);
        },
        classifyTotalPages() {
            return Math.ceil(this.filteredClassifies.length / this.pageSize);
        },
        // 品牌分页数据
        paginatedBrands() {
            const start = (this.brandCurrentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.filteredBrands.slice(start, end);
        },
        brandTotalPages() {
            return Math.ceil(this.filteredBrands.length / this.pageSize);
        },
        // 商品分页数据
        paginatedGoods() {
            const start = (this.goodsCurrentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.filteredGoods.slice(start, end);
        },
        goodsTotalPages() {
            return Math.ceil(this.filteredGoods.length / this.pageSize);
        },
        // 计算商品总价（仅前端显示，不保存）
        totalGoodsPrice() {
            if (!this.selectedIncludedGoods || this.selectedIncludedGoods.length === 0) {
                return 0;
            }
            return this.selectedIncludedGoods.reduce((sum, goods) => {
                return sum + parseFloat(goods.price || 0);
            }, 0).toFixed(2);
        },
        // 过滤掉已选择的商品（用于子弹窗下拉框）
        availableGoodsForSelection() {
            const selectedIds = this.selectedIncludedGoods.map(g => g.id);
            return this.availableGoodsForCombo.filter(g => !selectedIds.includes(g.id));
        },
        // 活动模板分页数据
        paginatedActivityTemplates() {
            const start = (this.activityTemplateCurrentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.filteredActivityTemplates.slice(start, end);
        },
        activityTemplateTotalPages() {
            return Math.ceil(this.filteredActivityTemplates.length / this.pageSize);
        },
        // 活动分页数据
        paginatedActivities() {
            const start = (this.activityCurrentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.filteredActivities.slice(start, end);
        },
        activityTotalPages() {
            return Math.ceil(this.filteredActivities.length / this.pageSize);
        },
        // 合同分页数据
        paginatedContracts() {
            const start = (this.contractCurrentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.filteredContracts.slice(start, end);
        },
        contractTotalPages() {
            return Math.ceil(this.filteredContracts.length / this.pageSize);
        },
        // 收款分页数据
        paginatedPaymentCollections() {
            const start = (this.paymentCollectionCurrentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.filteredPaymentCollections.slice(start, end);
        },
        paymentCollectionTotalPages() {
            return Math.ceil(this.filteredPaymentCollections.length / this.pageSize);
        },
        // 计算是否可以选择线上付款（预计付款日期未过）
        canSelectOnlinePayment() {
            if (!this.selectedOrderInfo || !this.selectedOrderInfo.expected_payment_time) {
                return true;
            }
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const expectedDate = new Date(this.selectedOrderInfo.expected_payment_time);
            expectedDate.setHours(0, 0, 0, 0);
            return expectedDate >= today;
        },
        // 过滤掉已选择的商品（用于新增活动模板）
        availableGoodsForTemplate() {
            const selectedIds = this.selectedTemplateGoods.map(g => g.goods_id);
            return this.availableGoodsForOrder.filter(g => !selectedIds.includes(g.id));
        },
        // 过滤掉已选择的商品（用于编辑活动模板）
        availableGoodsForEditTemplate() {
            const selectedIds = this.editSelectedTemplateGoods.map(g => g.goods_id);
            return this.availableGoodsForOrder.filter(g => !selectedIds.includes(g.id));
        },
        // 模板类型关联商品分页
        paginatedTemplateClassifyGoods() {
            const start = (this.templateClassifyGoodsCurrentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.templateClassifyGoods.slice(start, end);
        },
        templateClassifyGoodsTotalPages() {
            return Math.ceil(this.templateClassifyGoods.length / this.pageSize);
        },
        // 模板详情商品分页
        paginatedTemplateDetailGoods() {
            const start = (this.templateDetailGoodsCurrentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.activityTemplateDetailData.goods.slice(start, end);
        },
        templateDetailGoodsTotalPages() {
            return Math.ceil(this.activityTemplateDetailData.goods.length / this.pageSize);
        },
        // 活动模板商品分页（新增活动抽屉）
        paginatedActivityTemplateGoods() {
            const start = (this.activityTemplateGoodsCurrentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.activityTemplateGoods.slice(start, end);
        },
        activityTemplateGoodsTotalPages() {
            return Math.ceil(this.activityTemplateGoods.length / this.pageSize);
        },
        // 活动详情商品分页
        paginatedActivityDetailGoods() {
            const start = (this.activityDetailGoodsCurrentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.activityDetailData.goods.slice(start, end);
        },
        activityDetailGoodsTotalPages() {
            return Math.ceil(this.activityDetailData.goods.length / this.pageSize);
        }
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
            } else if (menu === 'childorders') {
                this.fetchChildOrders();
            } else if (menu === 'accounts') {
                this.fetchAccounts();
            } else if (menu === 'attributes') {
                this.fetchAttributes();
            } else if (menu === 'classifies') {
                this.fetchClassifies();
            } else if (menu === 'brands') {
                this.fetchBrands();
            } else if (menu === 'goods') {
                this.fetchGoods();
            } else if (menu === 'activity_template') {
                this.fetchActivityTemplates();
                this.fetchClassifies();
            } else if (menu === 'activity_management') {
                this.fetchActivities();
                this.fetchActivityTemplates();
            } else if (menu === 'contract_management') {
                this.fetchContracts();
            } else if (menu === 'payment_collection') {
                this.fetchPaymentCollections();
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
                } else if (this.deleteType === 'activityTemplate') {
                    await this.deleteActivityTemplate(this.deleteId);
                } else if (this.deleteType === 'activity') {
                    await this.deleteActivity(this.deleteId);
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

        // 打开新增订单抽屉
        async openAddOrderDrawer() {
            // 获取启用的学生列表
            try {
                const response = await axios.get('/api/students/active', { withCredentials: true });
                this.activeStudentsForOrder = response.data.students;
            } catch (err) {
                console.error('获取启用学生列表失败:', err);
                this.error = '获取启用学生列表失败';
            }
            // 获取启用的商品列表
            try {
                const response = await axios.get('/api/goods/active-for-order', { withCredentials: true });
                this.availableGoodsForOrder = response.data.goods;
            } catch (err) {
                console.error('获取启用商品列表失败:', err);
                this.error = '获取启用商品列表失败';
            }
            this.showAddOrderDrawer = true;
        },

        // 关闭新增订单抽屉
        closeAddOrderDrawer() {
            this.showAddOrderDrawer = false;
            this.addOrderData = {
                student_id: '',
                student_name: '',
                expected_payment_time: '',
                participating_activities: '',
                activity_ids: [],
                discount_amount: 0
            };
            this.selectedOrderGoods = [];
            this.orderActivityTemplateGoods = [];
            this.childDiscounts = {};
        },

        // 预计付款时间变更处理（新增订单）
        async onExpectedPaymentTimeChange() {
            const paymentTime = this.addOrderData.expected_payment_time;

            if (!paymentTime) {
                // 清空活动和优惠
                this.addOrderData.participating_activities = '';
                this.addOrderData.activity_ids = [];
                this.addOrderData.discount_amount = 0;
                this.orderActivities = [];
                this.orderActivityTemplateGoods = [];
                this.childDiscounts = {};
                return;
            }

            try {
                // 查询该时间范围内的启用活动
                const response = await axios.get('/api/activities/by-date-range', {
                    params: { payment_time: paymentTime },
                    withCredentials: true
                });

                const { has_duplicate, duplicate_type, type_name, activities } = response.data;

                // 检测活动重复
                if (has_duplicate) {
                    alert(`活动信息重复，请联系运营修改！（重复类型：${type_name}）`);
                    this.addOrderData.expected_payment_time = '';
                    this.addOrderData.participating_activities = '';
                    this.addOrderData.activity_ids = [];
                    this.orderActivities = [];
                    this.orderActivityTemplateGoods = [];
                    return;
                }

                // 设置活动信息
                this.orderActivities = activities;
                this.addOrderData.activity_ids = activities.map(a => a.id);
                this.addOrderData.participating_activities = activities.map(a => a.name).join('，');

                // 加载活动模板包含的商品
                await this.loadOrderActivityTemplateGoods(activities);

                // 如果已经选择了商品，自动计算优惠
                if (this.selectedOrderGoods.length > 0) {
                    await this.calculateOrderDiscount();
                }

            } catch (err) {
                console.error('获取活动失败:', err);
                alert(err.response?.data?.error || '获取活动失败');
            }
        },

        // 计算订单优惠金额
        async calculateOrderDiscount() {
            if (!this.addOrderData.activity_ids || this.addOrderData.activity_ids.length === 0) {
                this.addOrderData.discount_amount = 0;
                this.childDiscounts = {};
                return;
            }

            if (this.selectedOrderGoods.length === 0) {
                this.addOrderData.discount_amount = 0;
                this.childDiscounts = {};
                return;
            }

            try {
                const goods_list = this.selectedOrderGoods.map(g => ({
                    goods_id: g.goods_id,
                    price: g.price,
                    total_price: g.total_price
                }));

                const response = await axios.post('/api/orders/calculate-discount', {
                    goods_list: goods_list,
                    activity_ids: this.addOrderData.activity_ids
                }, { withCredentials: true });

                this.addOrderData.discount_amount = response.data.total_discount;
                this.childDiscounts = response.data.child_discounts;

            } catch (err) {
                console.error('计算优惠失败:', err);
                this.addOrderData.discount_amount = 0;
                this.childDiscounts = {};
            }
        },

        // 编辑订单预计付款时间变化处理
        async onEditExpectedPaymentTimeChange() {
            const paymentTime = this.editOrderData.expected_payment_time;

            // 清空商品列表和活动信息
            this.editSelectedOrderGoods = [];
            this.editOrderData.participating_activities = '';
            this.editOrderData.activity_ids = [];
            this.editOrderData.discount_amount = 0;
            this.editChildDiscounts = {};

            if (!paymentTime) {
                return;
            }

            try {
                // 查询该时间范围内的启用活动
                const response = await axios.get('/api/activities/by-date-range', {
                    params: { payment_time: paymentTime },
                    withCredentials: true
                });

                const { has_duplicate, type_name, activities } = response.data;

                // 检测活动重复
                if (has_duplicate) {
                    alert(`活动信息重复，请联系运营修改！（重复类型：${type_name}）`);
                    this.editOrderData.expected_payment_time = '';
                    return;
                }

                // 设置活动信息
                this.editOrderData.activity_ids = activities.map(a => a.id);
                this.editOrderData.participating_activities = activities.map(a => a.name).join('，');

            } catch (err) {
                console.error('获取活动失败:', err);
                alert(err.response?.data?.error || '获取活动失败');
            }
        },

        // 计算编辑订单优惠金额
        async calculateEditOrderDiscount() {
            if (!this.editOrderData.activity_ids || this.editOrderData.activity_ids.length === 0) {
                this.editOrderData.discount_amount = 0;
                this.editChildDiscounts = {};
                return;
            }

            if (this.editSelectedOrderGoods.length === 0) {
                this.editOrderData.discount_amount = 0;
                this.editChildDiscounts = {};
                return;
            }

            try {
                const goods_list = this.editSelectedOrderGoods.map(g => ({
                    goods_id: g.goods_id,
                    price: g.price,
                    total_price: g.total_price
                }));

                const response = await axios.post('/api/orders/calculate-discount', {
                    goods_list: goods_list,
                    activity_ids: this.editOrderData.activity_ids
                }, { withCredentials: true });

                this.editOrderData.discount_amount = response.data.total_discount;
                this.editChildDiscounts = response.data.child_discounts;

            } catch (err) {
                console.error('计算优惠失败:', err);
                this.editOrderData.discount_amount = 0;
                this.editChildDiscounts = {};
            }
        },

        // 学生选择变化时（用于新增订单）
        onOrderStudentChange() {
            const student = this.activeStudentsForOrder.find(s => s.id === parseInt(this.addOrderData.student_id));
            if (student) {
                this.addOrderData.student_name = student.student_name;
            } else {
                this.addOrderData.student_name = '';
            }
        },

        // 打开新增订单商品子弹窗
        openAddOrderGoodsModal() {
            this.addOrderGoodsData = {
                goods_id: '',
                name: '',
                brand_name: '',
                classify_name: '',
                attributes: '',
                price: 0,
                total_price: 0,
                isgroup: 1
            };
            this.showAddOrderGoodsModal = true;
        },

        // 关闭新增订单商品子弹窗
        closeAddOrderGoodsModal() {
            this.showAddOrderGoodsModal = false;
            this.addOrderGoodsData = {
                goods_id: '',
                name: '',
                brand_name: '',
                classify_name: '',
                attributes: '',
                price: 0,
                total_price: 0,
                isgroup: 1
            };
        },

        // 订单商品选择变化时联动其他字段
        onOrderGoodsChange() {
            const goods = this.availableGoodsForOrder.find(g => g.id === parseInt(this.addOrderGoodsData.goods_id));
            if (goods) {
                this.addOrderGoodsData.name = goods.name;
                this.addOrderGoodsData.brand_name = goods.brand_name || '';
                this.addOrderGoodsData.classify_name = goods.classify_name || '';
                this.addOrderGoodsData.attributes = goods.attributes || '';
                this.addOrderGoodsData.price = goods.price;
                this.addOrderGoodsData.total_price = goods.total_price;
                this.addOrderGoodsData.isgroup = goods.isgroup;
            } else {
                this.addOrderGoodsData.name = '';
                this.addOrderGoodsData.brand_name = '';
                this.addOrderGoodsData.classify_name = '';
                this.addOrderGoodsData.attributes = '';
                this.addOrderGoodsData.price = 0;
                this.addOrderGoodsData.total_price = 0;
                this.addOrderGoodsData.isgroup = 1;
            }
        },

        // 保存选择的商品到订单列表
        async saveOrderGoods() {
            if (!this.addOrderGoodsData.goods_id) {
                alert('请选择商品');
                return;
            }
            // 添加到已选商品列表
            this.selectedOrderGoods.push({
                goods_id: parseInt(this.addOrderGoodsData.goods_id),
                name: this.addOrderGoodsData.name,
                brand_name: this.addOrderGoodsData.brand_name,
                classify_name: this.addOrderGoodsData.classify_name,
                attributes: this.addOrderGoodsData.attributes,
                price: parseFloat(this.addOrderGoodsData.price),
                total_price: parseFloat(this.addOrderGoodsData.total_price),
                isgroup: this.addOrderGoodsData.isgroup
            });
            this.closeAddOrderGoodsModal();
            // 自动重新计算优惠
            await this.calculateOrderDiscount();
        },

        // 从订单列表中删除商品
        async removeOrderGoods(index) {
            this.selectedOrderGoods.splice(index, 1);
            // 自动重新计算优惠
            await this.calculateOrderDiscount();
        },

        // 保存新增订单
        async saveAddOrder() {
            if (!this.addOrderData.student_id) {
                alert('请选择学生');
                return;
            }

            if (this.selectedOrderGoods.length === 0) {
                alert('必须至少选择一个商品');
                return;
            }

            try {
                const goods_list = this.selectedOrderGoods.map(g => ({
                    goods_id: g.goods_id,
                    price: g.price,
                    total_price: g.total_price
                }));

                const response = await axios.post('/api/orders', {
                    student_id: this.addOrderData.student_id,
                    expected_payment_time: this.addOrderData.expected_payment_time,   // 新增
                    activity_ids: this.addOrderData.activity_ids,                     // 新增
                    discount_amount: this.addOrderData.discount_amount,               // 新增
                    child_discounts: this.childDiscounts,                             // 新增
                    goods_list: goods_list
                }, { withCredentials: true });

                if (response.data.message === '订单创建成功') {
                    await this.fetchOrders();
                    this.closeAddOrderDrawer();
                    alert('保存成功！');
                }
            } catch (err) {
                console.error('创建订单失败:', err);
                alert(err.response?.data?.error || '创建订单失败');
            }
        },

        // 打开编辑订单抽屉
        async openEditOrderDrawer(order) {
            // 获取启用的商品列表
            try {
                const response = await axios.get('/api/goods/active-for-order', { withCredentials: true });
                this.availableGoodsForOrder = response.data.goods;
            } catch (err) {
                console.error('获取启用商品列表失败:', err);
                this.error = '获取启用商品列表失败';
            }

            // 获取订单的商品列表
            try {
                const response = await axios.get(`/api/orders/${order.id}/goods`, { withCredentials: true });
                this.editSelectedOrderGoods = response.data.goods.map(g => ({
                    goods_id: g.goodsid,
                    name: g.goods_name,
                    brand_name: g.brand_name || '',
                    classify_name: g.classify_name || '',
                    attributes: g.attributes || '',
                    price: parseFloat(g.amount_received),
                    total_price: parseFloat(g.amount_receivable),
                    isgroup: g.isgroup
                }));
            } catch (err) {
                console.error('获取订单商品列表失败:', err);
                this.editSelectedOrderGoods = [];
            }

            // 格式化预计付款时间为datetime-local格式
            const formatDateForInput = (dateStr) => {
                if (!dateStr) return '';
                const date = new Date(dateStr);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                return `${year}-${month}-${day}T${hours}:${minutes}`;
            };

            this.editOrderData = {
                id: order.id,
                student_id: order.uid,
                student_name: order.student_name,
                expected_payment_time: formatDateForInput(order.expected_payment_time),
                participating_activities: '',
                activity_ids: [],
                discount_amount: parseFloat(order.discount_amount) || 0
            };

            // 如果有预计付款时间，加载活动信息（仅显示，不重新计算优惠）
            if (this.editOrderData.expected_payment_time) {
                try {
                    const response = await axios.get('/api/activities/by-date-range', {
                        params: { payment_time: this.editOrderData.expected_payment_time },
                        withCredentials: true
                    });
                    const { activities } = response.data;
                    this.editOrderData.activity_ids = activities.map(a => a.id);
                    this.editOrderData.participating_activities = activities.map(a => a.name).join('，');
                } catch (err) {
                    console.error('获取活动失败:', err);
                }
            }

            // 注意：打开编辑时不重新计算优惠，保持存储的值
            // 优惠只在用户修改预计付款时间或添加/删除商品时才重新计算

            this.showEditOrderDrawer = true;
        },

        // 关闭编辑订单抽屉
        closeEditOrderDrawer() {
            this.showEditOrderDrawer = false;
            this.editOrderData = {
                id: '',
                student_id: '',
                student_name: '',
                expected_payment_time: '',
                participating_activities: '',
                activity_ids: [],
                discount_amount: 0
            };
            this.editSelectedOrderGoods = [];
            this.editChildDiscounts = {};
        },

        // 打开编辑订单商品子弹窗
        openEditOrderGoodsModal() {
            this.editOrderGoodsData = {
                goods_id: '',
                name: '',
                brand_name: '',
                classify_name: '',
                attributes: '',
                price: 0,
                total_price: 0,
                isgroup: 1
            };
            this.showEditOrderGoodsModal = true;
        },

        // 关闭编辑订单商品子弹窗
        closeEditOrderGoodsModal() {
            this.showEditOrderGoodsModal = false;
            this.editOrderGoodsData = {
                goods_id: '',
                name: '',
                brand_name: '',
                classify_name: '',
                attributes: '',
                price: 0,
                total_price: 0,
                isgroup: 1
            };
        },

        // 编辑订单商品选择变化时联动其他字段
        onEditOrderGoodsChange() {
            const goods = this.availableGoodsForOrder.find(g => g.id === parseInt(this.editOrderGoodsData.goods_id));
            if (goods) {
                this.editOrderGoodsData.name = goods.name;
                this.editOrderGoodsData.brand_name = goods.brand_name || '';
                this.editOrderGoodsData.classify_name = goods.classify_name || '';
                this.editOrderGoodsData.attributes = goods.attributes || '';
                this.editOrderGoodsData.price = goods.price;
                this.editOrderGoodsData.total_price = goods.total_price;
                this.editOrderGoodsData.isgroup = goods.isgroup;
            } else {
                this.editOrderGoodsData.name = '';
                this.editOrderGoodsData.brand_name = '';
                this.editOrderGoodsData.classify_name = '';
                this.editOrderGoodsData.attributes = '';
                this.editOrderGoodsData.price = 0;
                this.editOrderGoodsData.total_price = 0;
                this.editOrderGoodsData.isgroup = 1;
            }
        },

        // 保存选择的商品到编辑订单列表
        async saveEditOrderGoods() {
            if (!this.editOrderGoodsData.goods_id) {
                alert('请选择商品');
                return;
            }
            this.editSelectedOrderGoods.push({
                goods_id: parseInt(this.editOrderGoodsData.goods_id),
                name: this.editOrderGoodsData.name,
                brand_name: this.editOrderGoodsData.brand_name,
                classify_name: this.editOrderGoodsData.classify_name,
                attributes: this.editOrderGoodsData.attributes,
                price: parseFloat(this.editOrderGoodsData.price),
                total_price: parseFloat(this.editOrderGoodsData.total_price),
                isgroup: this.editOrderGoodsData.isgroup
            });
            this.closeEditOrderGoodsModal();
            await this.calculateEditOrderDiscount();
        },

        // 从编辑订单列表中删除商品
        async removeEditOrderGoods(index) {
            this.editSelectedOrderGoods.splice(index, 1);
            await this.calculateEditOrderDiscount();
        },

        // 保存编辑订单
        async saveEditOrder() {
            if (this.editSelectedOrderGoods.length === 0) {
                alert('必须至少选择一个商品');
                return;
            }

            try {
                const goods_list = this.editSelectedOrderGoods.map(g => ({
                    goods_id: g.goods_id,
                    price: g.price,
                    total_price: g.total_price
                }));

                const response = await axios.put(`/api/orders/${this.editOrderData.id}`, {
                    goods_list: goods_list,
                    expected_payment_time: this.editOrderData.expected_payment_time,
                    activity_ids: this.editOrderData.activity_ids,
                    discount_amount: this.editOrderData.discount_amount,
                    child_discounts: this.editChildDiscounts
                }, { withCredentials: true });

                if (response.data.message === '订单更新成功') {
                    await this.fetchOrders();
                    this.closeEditOrderDrawer();
                    alert('保存成功！');
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
        addAttributeValueInput() {
            this.attributeValues.push('');
        },

        // 删除属性值输入框
        removeAttributeValueInput(index) {
            if (this.attributeValues.length > 1) {
                this.attributeValues.splice(index, 1);
            }
        },

        // 清除属性值输入框内容（当仅剩一个时）
        clearAttributeValueInput(index) {
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
        },

        // ==================== 分页功能 ====================

        // 学生分页
        changeStudentPage(page) {
            if (page >= 1 && page <= this.studentTotalPages) {
                this.studentCurrentPage = page;
            }
        },
        // 教练分页
        changeCoachPage(page) {
            if (page >= 1 && page <= this.coachTotalPages) {
                this.coachCurrentPage = page;
            }
        },
        // 订单分页
        changeOrderPage(page) {
            if (page >= 1 && page <= this.orderTotalPages) {
                this.orderCurrentPage = page;
            }
        },

        // ==================== 子产品订单管理方法 ====================

        // 获取子产品订单数据
        async fetchChildOrders() {
            try {
                const response = await axios.get('/api/childorders', { withCredentials: true });
                this.childOrders = response.data.childorders;
                this.filteredChildOrders = this.childOrders;
            } catch (err) {
                console.error('获取子产品订单数据失败:', err);
                this.error = '获取子产品订单数据失败';
            }
        },

        // 搜索子产品订单
        searchChildOrders() {
            this.filteredChildOrders = this.childOrders.filter(order => {
                let match = true;
                if (this.childOrderFilters.id && order.id !== parseInt(this.childOrderFilters.id)) {
                    match = false;
                }
                if (this.childOrderFilters.parentsid && order.parentsid !== parseInt(this.childOrderFilters.parentsid)) {
                    match = false;
                }
                if (this.childOrderFilters.goodsid && order.goodsid !== parseInt(this.childOrderFilters.goodsid)) {
                    match = false;
                }
                if (this.childOrderFilters.status && order.status !== parseInt(this.childOrderFilters.status)) {
                    match = false;
                }
                return match;
            });
            this.childOrderCurrentPage = 1;
        },

        // 重置子产品订单筛选
        resetChildOrderFilters() {
            this.childOrderFilters = {
                id: '',
                parentsid: '',
                goodsid: '',
                status: ''
            };
            this.filteredChildOrders = this.childOrders;
            this.childOrderCurrentPage = 1;
        },

        // 获取子产品订单状态文本
        getChildOrderStatusText(status) {
            const statusMap = {
                10: '草稿',
                20: '审核中',
                30: '已通过',
                40: '已驳回',
                99: '已作废'
            };
            return statusMap[status] || '未知';
        },

        // 子产品订单分页
        changeChildOrderPage(page) {
            if (page >= 1 && page <= this.childOrderTotalPages) {
                this.childOrderCurrentPage = page;
            }
        },

        // 账号分页
        changeAccountPage(page) {
            if (page >= 1 && page <= this.accountTotalPages) {
                this.accountCurrentPage = page;
            }
        },
        // 属性分页
        changeAttributePage(page) {
            if (page >= 1 && page <= this.attributeTotalPages) {
                this.attributeCurrentPage = page;
            }
        },
        // 类型分页
        changeClassifyPage(page) {
            if (page >= 1 && page <= this.classifyTotalPages) {
                this.classifyCurrentPage = page;
            }
        },

        // ==================== 品牌管理功能 ====================

        // 获取品牌数据
        async fetchBrands() {
            try {
                const response = await axios.get('/api/brands', { withCredentials: true });
                this.brands = response.data.brands;
                this.filteredBrands = this.brands;
            } catch (err) {
                console.error('获取品牌失败:', err);
                this.error = '获取品牌失败';
            }
        },

        // 品牌筛选功能
        searchBrands() {
            this.filteredBrands = this.brands.filter(brand => {
                const idMatch = !this.brandFilters.id || brand.id === parseInt(this.brandFilters.id);
                const nameMatch = !this.brandFilters.name || brand.name === this.brandFilters.name;
                const statusMatch = this.brandFilters.status === '' || brand.status === parseInt(this.brandFilters.status);
                return idMatch && nameMatch && statusMatch;
            });
            // 筛选后重置到第一页
            this.brandCurrentPage = 1;
        },

        // 重置品牌筛选
        resetBrandFilters() {
            this.brandFilters = {
                id: '',
                name: '',
                status: ''
            };
            this.filteredBrands = this.brands;
            this.brandCurrentPage = 1;
        },

        // 获取品牌状态文本
        getBrandStatusText(status) {
            return status === 0 ? '启用' : '禁用';
        },

        // 打开新增品牌弹窗
        openAddBrandModal() {
            this.showAddBrandModal = true;
        },

        // 关闭新增品牌弹窗
        closeAddBrandModal() {
            this.showAddBrandModal = false;
            this.addBrandData = {
                name: ''
            };
        },

        // 保存新增品牌
        async saveAddBrand() {
            if (!this.addBrandData.name) {
                alert('请填写品牌名称');
                return;
            }

            try {
                const response = await axios.post('/api/brands', {
                    name: this.addBrandData.name
                }, { withCredentials: true });

                if (response.data.message === '品牌添加成功') {
                    await this.fetchBrands();
                    this.closeAddBrandModal();
                    alert('品牌添加成功');
                }
            } catch (err) {
                console.error('新增品牌失败:', err);
                alert(err.response?.data?.error || '新增品牌失败');
            }
        },

        // 打开编辑品牌弹窗
        openEditBrandModal(brand) {
            this.editBrandData = {
                id: brand.id,
                name: brand.name
            };
            this.showEditBrandModal = true;
        },

        // 关闭编辑品牌弹窗
        closeEditBrandModal() {
            this.showEditBrandModal = false;
            this.editBrandData = {
                id: '',
                name: ''
            };
        },

        // 保存编辑品牌
        async saveEditBrand() {
            if (!this.editBrandData.name) {
                alert('请填写品牌名称');
                return;
            }

            try {
                const response = await axios.put(`/api/brands/${this.editBrandData.id}`, {
                    name: this.editBrandData.name
                }, { withCredentials: true });

                if (response.data.message === '品牌信息更新成功') {
                    await this.fetchBrands();
                    this.closeEditBrandModal();
                    alert('品牌信息更新成功');
                }
            } catch (err) {
                console.error('更新品牌失败:', err);
                alert(err.response?.data?.error || '更新品牌失败');
            }
        },

        // 打开启用品牌确认弹窗
        openEnableBrandConfirm(brandId) {
            this.brandId = brandId;
            this.showEnableBrandConfirm = true;
        },

        // 关闭启用品牌确认弹窗
        closeEnableBrandConfirm() {
            this.showEnableBrandConfirm = false;
            this.brandId = null;
        },

        // 确认启用品牌
        async confirmEnableBrand() {
            try {
                const response = await axios.put(`/api/brands/${this.brandId}/status`, {
                    status: 0
                }, { withCredentials: true });

                if (response.data.message === '品牌状态更新成功') {
                    await this.fetchBrands();
                    this.closeEnableBrandConfirm();
                    alert('品牌已启用');
                }
            } catch (err) {
                console.error('启用品牌失败:', err);
                alert(err.response?.data?.error || '启用品牌失败');
            }
        },

        // 打开禁用品牌确认弹窗
        openDisableBrandConfirm(brandId) {
            this.brandId = brandId;
            this.showDisableBrandConfirm = true;
        },

        // 关闭禁用品牌确认弹窗
        closeDisableBrandConfirm() {
            this.showDisableBrandConfirm = false;
            this.brandId = null;
        },

        // 确认禁用品牌
        async confirmDisableBrand() {
            try {
                const response = await axios.put(`/api/brands/${this.brandId}/status`, {
                    status: 1
                }, { withCredentials: true });

                if (response.data.message === '品牌状态更新成功') {
                    await this.fetchBrands();
                    this.closeDisableBrandConfirm();
                    alert('品牌已禁用');
                }
            } catch (err) {
                console.error('禁用品牌失败:', err);
                alert(err.response?.data?.error || '禁用品牌失败');
            }
        },

        // 品牌分页
        changeBrandPage(page) {
            if (page >= 1 && page <= this.brandTotalPages) {
                this.brandCurrentPage = page;
            }
        },

        // ==================== 商品管理功能 ====================

        // 格式化商品属性显示（只显示第一个属性和第一个规格）
        formatGoodsAttributes(goods) {
            if (!goods.attributes_full || goods.attributes_full.length === 0) {
                return '';
            }

            // 如果只有1-2个，直接显示
            if (goods.attributes_full.length <= 2) {
                return goods.attributes_full.join(',');
            }

            // 否则只显示前2个
            return goods.attributes_full.slice(0, 2).join(',') + '...';
        },

        // 获取完整属性列表用于悬浮显示
        getFullAttributes(goods) {
            if (!goods.attributes_full || goods.attributes_full.length === 0) {
                return '';
            }
            return goods.attributes_full.join(',');
        },

        // 获取商品数据
        async fetchGoods() {
            try {
                const response = await axios.get('/api/goods', { withCredentials: true });
                this.goods = response.data.goods;
                this.filteredGoods = this.goods;
            } catch (err) {
                console.error('获取商品失败:', err);
                this.error = '获取商品失败';
            }
        },

        // 商品筛选功能
        searchGoods() {
            this.filteredGoods = this.goods.filter(goods => {
                const idMatch = !this.goodsFilters.id || goods.id === parseInt(this.goodsFilters.id);
                const nameMatch = !this.goodsFilters.name || goods.name.toLowerCase().includes(this.goodsFilters.name.toLowerCase());
                const brandMatch = this.goodsFilters.brandid === '' || goods.brandid === parseInt(this.goodsFilters.brandid);
                const classifyMatch = this.goodsFilters.classifyid === '' || goods.classifyid === parseInt(this.goodsFilters.classifyid);
                const statusMatch = this.goodsFilters.status === '' || goods.status === parseInt(this.goodsFilters.status);
                return idMatch && nameMatch && brandMatch && classifyMatch && statusMatch;
            });
            this.goodsCurrentPage = 1;
        },

        // 重置商品筛选
        resetGoodsFilters() {
            this.goodsFilters = {
                id: '',
                name: '',
                brandid: '',
                classifyid: '',
                status: ''
            };
            this.filteredGoods = this.goods;
            this.goodsCurrentPage = 1;
        },

        // 打开新增商品抽屉
        async openAddGoodsDrawer() {
            // 获取启用的品牌列表
            try {
                const response = await axios.get('/api/brands/active', { withCredentials: true });
                this.activeBrands = response.data.brands;
            } catch (err) {
                console.error('获取启用品牌列表失败:', err);
                this.error = '获取启用品牌列表失败';
            }

            // 获取启用的类型列表
            try {
                const response = await axios.get('/api/classifies/active', { withCredentials: true });
                this.activeClassifies = response.data.classifies;
            } catch (err) {
                console.error('获取启用类型列表失败:', err);
                this.error = '获取启用类型列表失败';
            }

            // 获取启用的属性列表（包含属性值）
            try {
                const response = await axios.get('/api/attributes/active', { withCredentials: true });
                this.activeAttributes = response.data.attributes;
            } catch (err) {
                console.error('获取启用属性列表失败:', err);
                this.error = '获取启用属性列表失败';
            }

            this.showAddGoodsDrawer = true;
        },

        // 关闭新增商品抽屉
        closeAddGoodsDrawer() {
            this.showAddGoodsDrawer = false;
            this.addGoodsData = {
                name: '',
                brandid: '',
                classifyid: '',
                isgroup: 1,
                price: '',
                attributevalue_ids: []
            };
            this.selectedIncludedGoods = [];
            this.goodsAttributeRows = [{ attributeId: '', valueId: '' }];
            this.goodsSpecRows = [{ attributeId: '', valueId: '' }];
        },

        // 获取某行可用的属性列表（排除已选择的属性，只返回classify=0的）
        getAvailableAttributes(currentIndex) {
            const selectedAttrIds = this.goodsAttributeRows
                .map((row, index) => index !== currentIndex ? String(row.attributeId) : null)
                .filter(id => id && id !== '');
            return this.attributesList.filter(attr => !selectedAttrIds.includes(String(attr.id)));
        },

        // 获取某行可用的规格列表（排除已选择的规格，只返回classify=1的）
        getAvailableSpecs(currentIndex) {
            const selectedSpecIds = this.goodsSpecRows
                .map((row, index) => index !== currentIndex ? String(row.attributeId) : null)
                .filter(id => id && id !== '');
            return this.specsList.filter(spec => !selectedSpecIds.includes(String(spec.id)));
        },

        // 获取某个属性的属性值列表
        getAttributeValues(attributeId) {
            if (!attributeId) return [];
            const attribute = this.activeAttributes.find(attr => attr.id === parseInt(attributeId));
            return attribute && attribute.values ? attribute.values : [];
        },

        // 当某行的属性选择变化时，清空该行的属性值
        onRowAttributeChange(index) {
            this.goodsAttributeRows[index].valueId = '';
        },

        // 添加新的属性行
        addAttributeRow() {
            this.goodsAttributeRows.push({ attributeId: '', valueId: '' });
        },

        // 删除属性行
        removeAttributeRow(index) {
            if (this.goodsAttributeRows.length > 1) {
                this.goodsAttributeRows.splice(index, 1);
            }
        },

        // 当某行的规格选择变化时，清空该行的规格值
        onRowSpecChange(index) {
            this.goodsSpecRows[index].valueId = '';
        },

        // 添加新的规格行
        addSpecRow() {
            this.goodsSpecRows.push({ attributeId: '', valueId: '' });
        },

        // 删除规格行
        removeSpecRow(index) {
            if (this.goodsSpecRows.length > 1) {
                this.goodsSpecRows.splice(index, 1);
            }
        },

        // 组合售卖变化处理
        async onIsGroupChange() {
            // 如果切换为组合售卖，加载可用商品列表
            if (this.addGoodsData.isgroup == 0 || this.editGoodsData.isgroup == 0) {
                try {
                    const excludeId = this.editGoodsData.id || null;
                    const response = await axios.get('/api/goods/available-for-combo', {
                        params: excludeId ? { exclude_id: excludeId } : {},
                        withCredentials: true
                    });
                    this.availableGoodsForCombo = response.data.goods;
                } catch (err) {
                    console.error('获取可用商品列表失败:', err);
                    alert('获取可用商品列表失败');
                }
            } else {
                // 切换为非组合时，清空包含商品列表
                this.selectedIncludedGoods = [];
            }
        },

        // 打开新增包含商品子弹窗
        openAddIncludedGoodsModal() {
            this.addIncludedGoodsData = {
                goods_id: '',
                goods_name: '',
                brand_name: '',
                classify_name: '',
                attributes: '',
                price: ''
            };
            this.showAddIncludedGoodsModal = true;
        },

        // 包含商品选择变化
        onIncludedGoodsChange() {
            const selectedGoods = this.availableGoodsForCombo.find(
                g => g.id === parseInt(this.addIncludedGoodsData.goods_id)
            );

            if (selectedGoods) {
                this.addIncludedGoodsData.goods_name = selectedGoods.name;
                this.addIncludedGoodsData.brand_name = selectedGoods.brand_name;
                this.addIncludedGoodsData.classify_name = selectedGoods.classify_name;
                this.addIncludedGoodsData.attributes = selectedGoods.attributes;
                this.addIncludedGoodsData.price = selectedGoods.price;
            }
        },

        // 保存包含商品
        saveIncludedGoods() {
            if (!this.addIncludedGoodsData.goods_id) {
                alert('请选择商品');
                return;
            }

            // 检查是否已添加
            const exists = this.selectedIncludedGoods.find(
                g => g.id === parseInt(this.addIncludedGoodsData.goods_id)
            );
            if (exists) {
                alert('该商品已添加，请勿重复添加');
                return;
            }

            // 添加到列表
            const selectedGoods = this.availableGoodsForCombo.find(
                g => g.id === parseInt(this.addIncludedGoodsData.goods_id)
            );
            if (selectedGoods) {
                this.selectedIncludedGoods.push({
                    id: selectedGoods.id,
                    name: selectedGoods.name,
                    brand_name: selectedGoods.brand_name,
                    classify_name: selectedGoods.classify_name,
                    attributes: selectedGoods.attributes,
                    price: selectedGoods.price
                });
            }

            this.closeAddIncludedGoodsModal();
        },

        // 关闭包含商品子弹窗
        closeAddIncludedGoodsModal() {
            this.showAddIncludedGoodsModal = false;
            this.addIncludedGoodsData = {
                goods_id: '',
                goods_name: '',
                brand_name: '',
                classify_name: '',
                attributes: '',
                price: ''
            };
        },

        // 删除包含商品
        removeIncludedGoods(index) {
            this.selectedIncludedGoods.splice(index, 1);
        },

        // 保存新增商品
        async saveAddGoods() {
            if (!this.addGoodsData.name || !this.addGoodsData.brandid ||
                !this.addGoodsData.classifyid || !this.addGoodsData.price) {
                alert('请填写所有必填字段');
                return;
            }

            // 组合商品验证
            if (this.addGoodsData.isgroup == 0 && this.selectedIncludedGoods.length === 0) {
                alert('组合商品必须至少包含一个子商品');
                return;
            }

            // 从goodsAttributeRows和goodsSpecRows中提取属性值ID（过滤掉空值）
            const attributeValueIds = this.goodsAttributeRows
                .filter(row => row.attributeId && row.valueId)
                .map(row => parseInt(row.valueId));

            const specValueIds = this.goodsSpecRows
                .filter(row => row.attributeId && row.valueId)
                .map(row => parseInt(row.valueId));

            // 合并属性值和规格值
            const attributevalue_ids = [...attributeValueIds, ...specValueIds];

            // 提取包含商品ID
            const included_goods_ids = this.selectedIncludedGoods.map(g => g.id);

            console.log('goodsAttributeRows:', this.goodsAttributeRows);
            console.log('goodsSpecRows:', this.goodsSpecRows);
            console.log('提取的属性值IDs:', attributevalue_ids);
            console.log('包含商品IDs:', included_goods_ids);

            try {
                const response = await axios.post('/api/goods', {
                    name: this.addGoodsData.name,
                    brandid: parseInt(this.addGoodsData.brandid),
                    classifyid: parseInt(this.addGoodsData.classifyid),
                    isgroup: parseInt(this.addGoodsData.isgroup),
                    price: parseFloat(this.addGoodsData.price),
                    attributevalue_ids: attributevalue_ids,
                    included_goods_ids: included_goods_ids
                }, { withCredentials: true });

                if (response.data.message === '商品添加成功') {
                    await this.fetchGoods();
                    this.closeAddGoodsDrawer();
                    alert('商品添加成功');
                }
            } catch (err) {
                console.error('新增商品失败:', err);
                alert(err.response?.data?.error || '新增商品失败');
            }
        },

        // 打开编辑商品抽屉
        async openEditGoodsDrawer(goodsId) {
            // 获取启用的品牌列表
            try {
                const response = await axios.get('/api/brands/active', { withCredentials: true });
                this.activeBrands = response.data.brands;
            } catch (err) {
                console.error('获取启用品牌列表失败:', err);
                this.error = '获取启用品牌列表失败';
            }

            // 获取启用的类型列表
            try {
                const response = await axios.get('/api/classifies/active', { withCredentials: true });
                this.activeClassifies = response.data.classifies;
            } catch (err) {
                console.error('获取启用类型列表失败:', err);
                this.error = '获取启用类型列表失败';
            }

            // 获取启用的属性列表（包含属性值）
            try {
                const response = await axios.get('/api/attributes/active', { withCredentials: true });
                this.activeAttributes = response.data.attributes;
            } catch (err) {
                console.error('获取启用属性列表失败:', err);
                this.error = '获取启用属性列表失败';
            }

            // 获取商品详情
            try {
                const response = await axios.get(`/api/goods/${goodsId}`, { withCredentials: true });
                const goods = response.data.goods;
                this.editGoodsData = {
                    id: goods.id,
                    name: goods.name,
                    brandid: goods.brandid,
                    classifyid: goods.classifyid,
                    isgroup: goods.isgroup,
                    price: goods.price,
                    attributevalue_ids: goods.attributevalue_ids || []
                };

                // 根据商品的属性值ID重建goodsAttributeRows和goodsSpecRows数组
                this.goodsAttributeRows = [];
                this.goodsSpecRows = [];
                if (goods.attributevalue_ids && goods.attributevalue_ids.length > 0) {
                    for (const valueId of goods.attributevalue_ids) {
                        // 找到该属性值所属的属性
                        for (const attribute of this.activeAttributes) {
                            const value = attribute.values.find(v => v.id === valueId);
                            if (value) {
                                const row = {
                                    attributeId: attribute.id.toString(),
                                    valueId: value.id.toString()
                                };
                                // 根据classify区分是属性还是规格
                                if (attribute.classify === 0) {
                                    this.goodsAttributeRows.push(row);
                                } else if (attribute.classify === 1) {
                                    this.goodsSpecRows.push(row);
                                }
                                break;
                            }
                        }
                    }
                }
                // 如果没有属性值，至少保留一个空行
                if (this.goodsAttributeRows.length === 0) {
                    this.goodsAttributeRows = [{ attributeId: '', valueId: '' }];
                }
                if (this.goodsSpecRows.length === 0) {
                    this.goodsSpecRows = [{ attributeId: '', valueId: '' }];
                }

                // 如果是组合商品，加载包含商品数据
                if (goods.isgroup == 0) {
                    // 加载可用商品列表（用于子弹窗）
                    try {
                        const availableResponse = await axios.get('/api/goods/available-for-combo', {
                            params: { exclude_id: goodsId },
                            withCredentials: true
                        });
                        this.availableGoodsForCombo = availableResponse.data.goods;
                    } catch (err) {
                        console.error('获取可用商品列表失败:', err);
                    }

                    // 加载已包含的商品列表
                    try {
                        const includedResponse = await axios.get(`/api/goods/${goodsId}/included-goods`, {
                            withCredentials: true
                        });
                        this.selectedIncludedGoods = includedResponse.data.included_goods;
                    } catch (err) {
                        console.error('获取包含商品列表失败:', err);
                    }
                } else {
                    this.selectedIncludedGoods = [];
                }
            } catch (err) {
                console.error('获取商品详情失败:', err);
                alert('获取商品详情失败');
                return;
            }

            this.showEditGoodsDrawer = true;
        },

        // 关闭编辑商品抽屉
        closeEditGoodsDrawer() {
            this.showEditGoodsDrawer = false;
            this.editGoodsData = {
                id: '',
                name: '',
                brandid: '',
                classifyid: '',
                isgroup: 1,
                price: '',
                attributevalue_ids: []
            };
            this.selectedIncludedGoods = [];
            this.goodsAttributeRows = [{ attributeId: '', valueId: '' }];
            this.goodsSpecRows = [{ attributeId: '', valueId: '' }];
        },

        // 保存编辑商品
        async saveEditGoods() {
            if (!this.editGoodsData.name || !this.editGoodsData.brandid ||
                !this.editGoodsData.classifyid || !this.editGoodsData.price) {
                alert('请填写所有必填字段');
                return;
            }

            // 组合商品验证
            if (this.editGoodsData.isgroup == 0 && this.selectedIncludedGoods.length === 0) {
                alert('组合商品必须至少包含一个子商品');
                return;
            }

            // 从goodsAttributeRows和goodsSpecRows中提取属性值ID（过滤掉空值）
            const attributeValueIds = this.goodsAttributeRows
                .filter(row => row.attributeId && row.valueId)
                .map(row => parseInt(row.valueId));

            const specValueIds = this.goodsSpecRows
                .filter(row => row.attributeId && row.valueId)
                .map(row => parseInt(row.valueId));

            // 合并属性值和规格值
            const attributevalue_ids = [...attributeValueIds, ...specValueIds];

            // 提取包含商品ID
            const included_goods_ids = this.selectedIncludedGoods.map(g => g.id);

            try {
                const response = await axios.put(`/api/goods/${this.editGoodsData.id}`, {
                    name: this.editGoodsData.name,
                    brandid: parseInt(this.editGoodsData.brandid),
                    classifyid: parseInt(this.editGoodsData.classifyid),
                    price: parseFloat(this.editGoodsData.price),
                    attributevalue_ids: attributevalue_ids,
                    included_goods_ids: included_goods_ids
                }, { withCredentials: true });

                if (response.data.message === '商品信息更新成功') {
                    await this.fetchGoods();
                    this.closeEditGoodsDrawer();
                    alert('商品信息更新成功');
                }
            } catch (err) {
                console.error('更新商品失败:', err);
                alert(err.response?.data?.error || '更新商品失败');
            }
        },

        // 打开启用商品确认弹窗
        openEnableGoodsConfirm(goodsId) {
            this.goodsId = goodsId;
            this.showEnableGoodsConfirm = true;
        },

        // 关闭启用商品确认弹窗
        closeEnableGoodsConfirm() {
            this.showEnableGoodsConfirm = false;
            this.goodsId = null;
        },

        // 确认启用商品
        async confirmEnableGoods() {
            try {
                const response = await axios.put(`/api/goods/${this.goodsId}/status`, {
                    status: 0
                }, { withCredentials: true });

                if (response.data.message === '商品状态更新成功') {
                    await this.fetchGoods();
                    this.closeEnableGoodsConfirm();
                    alert('商品已启用');
                }
            } catch (err) {
                console.error('启用商品失败:', err);
                alert(err.response?.data?.error || '启用商品失败');
            }
        },

        // 打开禁用商品确认弹窗
        openDisableGoodsConfirm(goodsId) {
            this.goodsId = goodsId;
            this.showDisableGoodsConfirm = true;
        },

        // 关闭禁用商品确认弹窗
        closeDisableGoodsConfirm() {
            this.showDisableGoodsConfirm = false;
            this.goodsId = null;
        },

        // 确认禁用商品
        async confirmDisableGoods() {
            try {
                const response = await axios.put(`/api/goods/${this.goodsId}/status`, {
                    status: 1
                }, { withCredentials: true });

                if (response.data.message === '商品状态更新成功') {
                    await this.fetchGoods();
                    this.closeDisableGoodsConfirm();
                    alert('商品已禁用');
                }
            } catch (err) {
                console.error('禁用商品失败:', err);
                alert(err.response?.data?.error || '禁用商品失败');
            }
        },

        // 商品分页
        changeGoodsPage(page) {
            if (page >= 1 && page <= this.goodsTotalPages) {
                this.goodsCurrentPage = page;
            }
        },

        // ==================== 活动模板方法 ====================

        // 获取启用的商品列表（用于活动模板）
        async fetchGoodsForOrder() {
            try {
                const response = await axios.get('/api/goods/active-for-order', { withCredentials: true });
                this.availableGoodsForOrder = response.data.goods || [];
            } catch (err) {
                console.error('获取启用商品列表失败:', err);
            }
        },

        // 获取活动模板列表
        async fetchActivityTemplates() {
            try {
                const response = await axios.get('/api/activity-templates', { withCredentials: true });
                this.activityTemplates = response.data.templates || [];
                this.filteredActivityTemplates = [...this.activityTemplates];
            } catch (err) {
                console.error('获取活动模板失败:', err);
            }
        },

        // 获取启用状态的活动模板
        async fetchActiveActivityTemplates() {
            try {
                const response = await axios.get('/api/activity-templates/active', { withCredentials: true });
                this.activeActivityTemplates = response.data.templates || [];
            } catch (err) {
                console.error('获取启用活动模板失败:', err);
            }
        },

        // 搜索活动模板
        searchActivityTemplates() {
            this.filteredActivityTemplates = this.activityTemplates.filter(template => {
                const matchId = !this.activityTemplateFilters.id || template.id == this.activityTemplateFilters.id;
                const matchName = !this.activityTemplateFilters.name || template.name.includes(this.activityTemplateFilters.name);
                const matchType = !this.activityTemplateFilters.type || template.type == this.activityTemplateFilters.type;
                const matchStatus = this.activityTemplateFilters.status === '' || template.status == this.activityTemplateFilters.status;
                return matchId && matchName && matchType && matchStatus;
            });
            this.activityTemplateCurrentPage = 1;
        },

        // 重置活动模板筛选
        resetActivityTemplateFilters() {
            this.activityTemplateFilters = { id: '', name: '', type: '', status: '' };
            this.filteredActivityTemplates = [...this.activityTemplates];
            this.activityTemplateCurrentPage = 1;
        },

        // 活动模板分页
        changeActivityTemplatePage(page) {
            if (page >= 1 && page <= this.activityTemplateTotalPages) {
                this.activityTemplateCurrentPage = page;
            }
        },

        // 模板类型商品分页
        changeTemplateClassifyGoodsPage(page) {
            if (page >= 1 && page <= this.templateClassifyGoodsTotalPages) {
                this.templateClassifyGoodsCurrentPage = page;
            }
        },

        // 模板详情商品分页
        changeTemplateDetailGoodsPage(page) {
            if (page >= 1 && page <= this.templateDetailGoodsTotalPages) {
                this.templateDetailGoodsCurrentPage = page;
            }
        },

        // 打开活动模板详情抽屉
        async openActivityTemplateDetailDrawer(template) {
            try {
                const response = await axios.get(`/api/activity-templates/${template.id}`, { withCredentials: true });
                const data = response.data.template;

                let goods = [];
                if (data.select_type == 1) {
                    // 按类型选择，加载所有关联类型下的商品
                    const classifyList = data.classify_list || [];
                    for (const classify of classifyList) {
                        const goodsResponse = await axios.get(`/api/goods?classifyid=${classify.classify_id}&status=0`, { withCredentials: true });
                        goods = goods.concat(goodsResponse.data.goods || []);
                    }
                } else {
                    // 按商品选择
                    const goodsList = data.goods_list || [];
                    goods = goodsList.map(g => ({
                        id: g.goods_id,
                        name: g.goods_name,
                        price: g.price
                    }));
                }

                this.activityTemplateDetailData = {
                    id: data.id,
                    name: data.name,
                    type: data.type,
                    select_type: data.select_type,
                    status: data.status,
                    classifies: data.classify_list || [],
                    goods: goods
                };
                this.templateDetailGoodsCurrentPage = 1;
                this.showActivityTemplateDetailDrawer = true;
            } catch (err) {
                console.error('获取模板详情失败:', err);
                alert('获取模板详情失败');
            }
        },

        // 关闭活动模板详情抽屉
        closeActivityTemplateDetailDrawer() {
            this.showActivityTemplateDetailDrawer = false;
        },

        // 获取活动类型文本
        getActivityTypeText(type) {
            const types = { 1: '满减', 2: '满折', 3: '满赠', 4: '换购' };
            return types[type] || '';
        },

        // 打开新增活动模板抽屉
        async openAddActivityTemplateDrawer() {
            this.addActivityTemplateData = {
                name: '',
                type: '',
                select_type: '',
                status: 0,
                classify_ids: [],
                selected_classify_id: ''
            };
            this.selectedTemplateGoods = [];
            this.templateClassifyGoods = [];
            // 获取启用的类型列表
            try {
                const response = await axios.get('/api/classifies/active', { withCredentials: true });
                this.activeClassifies = response.data.classifies || [];
            } catch (err) {
                console.error('获取启用类型列表失败:', err);
            }
            this.fetchGoodsForOrder();
            this.showAddActivityTemplateDrawer = true;
        },

        // 关闭新增活动模板抽屉
        closeAddActivityTemplateDrawer() {
            this.showAddActivityTemplateDrawer = false;
        },

        // 选择方式变化
        onTemplateSelectTypeChange() {
            this.addActivityTemplateData.classify_ids = [];
            this.addActivityTemplateData.selected_classify_id = '';
            this.selectedTemplateGoods = [];
            this.templateClassifyGoods = [];
        },

        // 类型选择变化，加载类型下的商品
        async onTemplateClassifyChange() {
            const classifyId = this.addActivityTemplateData.selected_classify_id;
            if (!classifyId) {
                this.templateClassifyGoods = [];
                this.addActivityTemplateData.classify_ids = [];
                return;
            }
            // 设置classify_ids为选中的类型
            this.addActivityTemplateData.classify_ids = [classifyId];
            // 重置分页
            this.templateClassifyGoodsCurrentPage = 1;
            // 加载该类型下的商品
            try {
                const response = await axios.get(`/api/goods?classifyid=${classifyId}&status=0`, { withCredentials: true });
                this.templateClassifyGoods = response.data.goods || [];
            } catch (err) {
                console.error('获取类型商品失败:', err);
                this.templateClassifyGoods = [];
            }
        },

        // 编辑模板选择方式变化
        onEditTemplateSelectTypeChange() {
            this.editActivityTemplateData.classify_ids = [];
            this.editSelectedTemplateGoods = [];
        },

        // 打开添加模板商品弹窗
        openAddTemplateGoodsModal() {
            this.addTemplateGoodsData = {
                goods_id: '',
                name: '',
                brand_name: '',
                classify_name: '',
                price: 0
            };
            this.showAddTemplateGoodsModal = true;
        },

        // 关闭添加模板商品弹窗
        closeAddTemplateGoodsModal() {
            this.showAddTemplateGoodsModal = false;
        },

        // 模板商品选择变化
        onTemplateGoodsChange() {
            const selectedGoods = this.availableGoodsForOrder.find(g => g.id == this.addTemplateGoodsData.goods_id);
            if (selectedGoods) {
                this.addTemplateGoodsData.name = selectedGoods.name;
                this.addTemplateGoodsData.brand_name = selectedGoods.brand_name || '';
                this.addTemplateGoodsData.classify_name = selectedGoods.classify_name || '';
                this.addTemplateGoodsData.price = selectedGoods.price;
            }
        },

        // 保存模板商品
        saveTemplateGoods() {
            if (!this.addTemplateGoodsData.goods_id) {
                alert('请选择商品');
                return;
            }
            this.selectedTemplateGoods.push({
                goods_id: this.addTemplateGoodsData.goods_id,
                name: this.addTemplateGoodsData.name,
                brand_name: this.addTemplateGoodsData.brand_name,
                classify_name: this.addTemplateGoodsData.classify_name,
                price: this.addTemplateGoodsData.price
            });
            this.closeAddTemplateGoodsModal();
        },

        // 删除模板商品
        removeTemplateGoods(index) {
            this.selectedTemplateGoods.splice(index, 1);
        },

        // 保存新增活动模板
        async saveAddActivityTemplate() {
            if (!this.addActivityTemplateData.name || !this.addActivityTemplateData.type || !this.addActivityTemplateData.select_type) {
                alert('请填写必填项');
                return;
            }
            if (this.addActivityTemplateData.select_type == 1 && this.addActivityTemplateData.classify_ids.length === 0) {
                alert('请至少选择一个类型');
                return;
            }
            if (this.addActivityTemplateData.select_type == 2 && this.selectedTemplateGoods.length === 0) {
                alert('请至少选择一个商品');
                return;
            }
            try {
                const postData = {
                    name: this.addActivityTemplateData.name,
                    type: parseInt(this.addActivityTemplateData.type),
                    select_type: parseInt(this.addActivityTemplateData.select_type),
                    status: parseInt(this.addActivityTemplateData.status),
                    classify_ids: this.addActivityTemplateData.classify_ids,
                    goods_ids: this.selectedTemplateGoods.map(g => g.goods_id)
                };
                await axios.post('/api/activity-templates', postData, { withCredentials: true });
                await this.fetchActivityTemplates();
                this.closeAddActivityTemplateDrawer();
                alert('活动模板创建成功');
            } catch (err) {
                console.error('创建活动模板失败:', err);
                alert(err.response?.data?.error || '创建活动模板失败');
            }
        },

        // 打开编辑活动模板抽屉
        async openEditActivityTemplateDrawer(template) {
            try {
                const response = await axios.get(`/api/activity-templates/${template.id}`, { withCredentials: true });
                const data = response.data.template;
                this.editActivityTemplateData = {
                    id: data.id,
                    name: data.name,
                    type: data.type,
                    select_type: data.select_type,
                    status: data.status,
                    classify_ids: data.classify_list ? data.classify_list.map(c => c.classify_id) : []
                };
                if (data.goods_list) {
                    this.editSelectedTemplateGoods = data.goods_list.map(g => ({
                        goods_id: g.goods_id,
                        name: g.goods_name,
                        brand_name: g.brand_name || '',
                        classify_name: g.classify_name || '',
                        price: g.price
                    }));
                } else {
                    this.editSelectedTemplateGoods = [];
                }
                await this.fetchGoodsForOrder();
                this.showEditActivityTemplateDrawer = true;
            } catch (err) {
                console.error('获取活动模板详情失败:', err);
                alert('获取活动模板详情失败');
            }
        },

        // 关闭编辑活动模板抽屉
        closeEditActivityTemplateDrawer() {
            this.showEditActivityTemplateDrawer = false;
        },

        // 打开编辑模板商品弹窗
        openEditTemplateGoodsModal() {
            this.editTemplateGoodsData = {
                goods_id: '',
                name: '',
                brand_name: '',
                classify_name: '',
                price: 0
            };
            this.showEditTemplateGoodsModal = true;
        },

        // 关闭编辑模板商品弹窗
        closeEditTemplateGoodsModal() {
            this.showEditTemplateGoodsModal = false;
        },

        // 编辑模板商品选择变化
        onEditTemplateGoodsChange() {
            const selectedGoods = this.availableGoodsForOrder.find(g => g.id == this.editTemplateGoodsData.goods_id);
            if (selectedGoods) {
                this.editTemplateGoodsData.name = selectedGoods.name;
                this.editTemplateGoodsData.brand_name = selectedGoods.brand_name || '';
                this.editTemplateGoodsData.classify_name = selectedGoods.classify_name || '';
                this.editTemplateGoodsData.price = selectedGoods.price;
            }
        },

        // 保存编辑模板商品
        saveEditTemplateGoods() {
            if (!this.editTemplateGoodsData.goods_id) {
                alert('请选择商品');
                return;
            }
            this.editSelectedTemplateGoods.push({
                goods_id: this.editTemplateGoodsData.goods_id,
                name: this.editTemplateGoodsData.name,
                brand_name: this.editTemplateGoodsData.brand_name,
                classify_name: this.editTemplateGoodsData.classify_name,
                price: this.editTemplateGoodsData.price
            });
            this.closeEditTemplateGoodsModal();
        },

        // 删除编辑模板商品
        removeEditTemplateGoods(index) {
            this.editSelectedTemplateGoods.splice(index, 1);
        },

        // 保存编辑活动模板
        async saveEditActivityTemplate() {
            if (!this.editActivityTemplateData.name || !this.editActivityTemplateData.type || !this.editActivityTemplateData.select_type) {
                alert('请填写必填项');
                return;
            }
            if (this.editActivityTemplateData.select_type == 1 && this.editActivityTemplateData.classify_ids.length === 0) {
                alert('请至少选择一个类型');
                return;
            }
            if (this.editActivityTemplateData.select_type == 2 && this.editSelectedTemplateGoods.length === 0) {
                alert('请至少选择一个商品');
                return;
            }
            try {
                const putData = {
                    name: this.editActivityTemplateData.name,
                    type: parseInt(this.editActivityTemplateData.type),
                    select_type: parseInt(this.editActivityTemplateData.select_type),
                    status: parseInt(this.editActivityTemplateData.status),
                    classify_ids: this.editActivityTemplateData.classify_ids,
                    goods_ids: this.editSelectedTemplateGoods.map(g => g.goods_id)
                };
                await axios.put(`/api/activity-templates/${this.editActivityTemplateData.id}`, putData, { withCredentials: true });
                await this.fetchActivityTemplates();
                this.closeEditActivityTemplateDrawer();
                alert('活动模板更新成功');
            } catch (err) {
                console.error('更新活动模板失败:', err);
                alert(err.response?.data?.error || '更新活动模板失败');
            }
        },

        // 更新活动模板状态
        async updateActivityTemplateStatus(id, status) {
            try {
                await axios.put(`/api/activity-templates/${id}/status`, { status }, { withCredentials: true });
                await this.fetchActivityTemplates();
                alert(status === 0 ? '已启用' : '已禁用');
            } catch (err) {
                console.error('更新状态失败:', err);
                alert(err.response?.data?.error || '更新状态失败');
            }
        },

        // 删除活动模板
        async deleteActivityTemplate(id) {
            try {
                await axios.delete(`/api/activity-templates/${id}`, { withCredentials: true });
                await this.fetchActivityTemplates();
                alert('活动模板删除成功');
            } catch (err) {
                console.error('删除活动模板失败:', err);
                alert(err.response?.data?.error || '删除活动模板失败');
            }
        },

        // ==================== 活动管理方法 ====================

        // 获取活动列表
        async fetchActivities() {
            try {
                const response = await axios.get('/api/activities', { withCredentials: true });
                this.activities = response.data.activities || [];
                this.filteredActivities = [...this.activities];
            } catch (err) {
                console.error('获取活动列表失败:', err);
            }
        },

        // 搜索活动
        searchActivities() {
            this.filteredActivities = this.activities.filter(activity => {
                const matchId = !this.activityFilters.id || activity.id == this.activityFilters.id;
                const matchName = !this.activityFilters.name || activity.name.includes(this.activityFilters.name);
                const matchTemplate = !this.activityFilters.template_id || activity.template_id == this.activityFilters.template_id;
                const matchStatus = this.activityFilters.status === '' || activity.status == this.activityFilters.status;
                return matchId && matchName && matchTemplate && matchStatus;
            });
            this.activityCurrentPage = 1;
        },

        // 重置活动筛选
        resetActivityFilters() {
            this.activityFilters = { id: '', name: '', template_id: '', status: '' };
            this.filteredActivities = [...this.activities];
            this.activityCurrentPage = 1;
        },

        // 活动分页
        changeActivityPage(page) {
            if (page >= 1 && page <= this.activityTotalPages) {
                this.activityCurrentPage = page;
            }
        },

        // 格式化日期时间
        formatDateTime(dateStr) {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        },

        // 打开新增活动抽屉
        async openAddActivityDrawer() {
            this.addActivityData = {
                name: '',
                template_id: '',
                template_type: '',
                template_select_type: '',
                start_time: '',
                end_time: '',
                status: 1,  // 默认禁用
                details: []
            };
            this.activityTemplateGoods = [];
            await this.fetchActiveActivityTemplates();
            this.showAddActivityDrawer = true;
        },

        // 关闭新增活动抽屉
        closeAddActivityDrawer() {
            this.showAddActivityDrawer = false;
        },

        // 活动模板选择变化
        async onActivityTemplateChange() {
            const template = this.activeActivityTemplates.find(t => t.id == this.addActivityData.template_id);
            if (template) {
                this.addActivityData.template_type = template.type;
                this.addActivityData.template_select_type = template.select_type;
                // 加载模板包含的商品
                await this.loadTemplateGoods(template.id, 'add');
            } else {
                this.addActivityData.template_type = '';
                this.addActivityData.template_select_type = '';
                this.activityTemplateGoods = [];
            }
        },

        // 加载模板包含的商品
        async loadTemplateGoods(templateId, mode) {
            try {
                const response = await axios.get(`/api/activity-templates/${templateId}`, { withCredentials: true });
                const template = response.data.template;
                let goods = [];

                if (template.select_type == 1) {
                    // 按类型选择，加载所有关联类型下的商品
                    const classifyList = template.classify_list || [];
                    for (const classify of classifyList) {
                        const goodsResponse = await axios.get(`/api/goods?classifyid=${classify.classify_id}&status=0`, { withCredentials: true });
                        goods = goods.concat(goodsResponse.data.goods || []);
                    }
                } else {
                    // 按商品选择，使用模板关联的商品
                    const goodsList = template.goods_list || [];
                    goods = goodsList.map(g => ({
                        id: g.goods_id,
                        name: g.goods_name,
                        price: g.price,
                        brand_name: g.brand_name,
                        classify_name: g.classify_name
                    }));
                }

                if (mode === 'add') {
                    this.activityTemplateGoods = goods;
                } else {
                    this.editActivityTemplateGoods = goods;
                }
            } catch (err) {
                console.error('获取模板商品失败:', err);
                if (mode === 'add') {
                    this.activityTemplateGoods = [];
                } else {
                    this.editActivityTemplateGoods = [];
                }
            }
        },

        // 加载订单活动模板包含的商品
        async loadOrderActivityTemplateGoods(activities) {
            try {
                let allGoods = [];
                const goodsMap = new Map(); // 用于去重

                for (const activity of activities) {
                    const templateId = activity.template_id;
                    if (!templateId) continue;

                    const response = await axios.get(`/api/activity-templates/${templateId}`, { withCredentials: true });
                    const template = response.data.template;
                    let goods = [];

                    if (template.select_type == 1) {
                        // 按类型选择，加载所有关联类型下的商品
                        const classifyList = template.classify_list || [];
                        for (const classify of classifyList) {
                            const goodsResponse = await axios.get(`/api/goods?classifyid=${classify.classify_id}&status=0`, { withCredentials: true });
                            goods = goods.concat(goodsResponse.data.goods || []);
                        }
                    } else {
                        // 按商品选择，使用模板关联的商品
                        const goodsList = template.goods_list || [];
                        goods = goodsList.map(g => ({
                            id: g.goods_id,
                            name: g.goods_name,
                            price: g.price,
                            brand_name: g.brand_name,
                            classify_name: g.classify_name
                        }));
                    }

                    // 添加活动名称到商品信息中，并去重
                    goods.forEach(g => {
                        if (!goodsMap.has(g.id)) {
                            goodsMap.set(g.id, {
                                ...g,
                                activities: [activity.name]
                            });
                        } else {
                            const existing = goodsMap.get(g.id);
                            if (!existing.activities.includes(activity.name)) {
                                existing.activities.push(activity.name);
                            }
                        }
                    });
                }

                // 转换Map为数组
                this.orderActivityTemplateGoods = Array.from(goodsMap.values());
            } catch (err) {
                console.error('获取订单活动模板商品失败:', err);
                this.orderActivityTemplateGoods = [];
            }
        },

        // 添加活动明细规则
        addActivityDetail() {
            this.addActivityData.details.push({ threshold_amount: 0, discount_value: 0 });
        },

        // 删除活动明细规则
        removeActivityDetail(index) {
            this.addActivityData.details.splice(index, 1);
        },

        // 保存新增活动
        async saveAddActivity() {
            if (!this.addActivityData.name || !this.addActivityData.template_id || !this.addActivityData.start_time || !this.addActivityData.end_time) {
                alert('请填写必填项');
                return;
            }
            if (this.addActivityData.template_type == 2 && this.addActivityData.details.length === 0) {
                alert('满折类型活动需要至少添加一条优惠规则');
                return;
            }
            try {
                const postData = {
                    name: this.addActivityData.name,
                    template_id: parseInt(this.addActivityData.template_id),
                    start_time: this.addActivityData.start_time,
                    end_time: this.addActivityData.end_time,
                    status: parseInt(this.addActivityData.status),
                    details: this.addActivityData.details
                };
                await axios.post('/api/activities', postData, { withCredentials: true });
                await this.fetchActivities();
                this.closeAddActivityDrawer();
                alert('活动创建成功');
            } catch (err) {
                console.error('创建活动失败:', err);
                alert(err.response?.data?.error || '创建活动失败');
            }
        },

        // 打开编辑活动抽屉
        async openEditActivityDrawer(activity) {
            try {
                await this.fetchActiveActivityTemplates();
                const response = await axios.get(`/api/activities/${activity.id}`, { withCredentials: true });
                const data = response.data.activity;

                // 格式化日期时间为input[type=datetime-local]格式（使用本地时间）
                const formatDateForInput = (dateStr) => {
                    if (!dateStr) return '';
                    const date = new Date(dateStr);
                    // 使用本地时间格式化，避免UTC时区转换问题
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    return `${year}-${month}-${day}T${hours}:${minutes}`;
                };

                this.editActivityData = {
                    id: data.id,
                    name: data.name,
                    template_id: data.template_id,
                    template_type: data.template_type,
                    template_select_type: data.select_type,
                    start_time: formatDateForInput(data.start_time),
                    end_time: formatDateForInput(data.end_time),
                    status: data.status,
                    details: data.details || []
                };
                // 加载模板包含的商品
                if (data.template_id) {
                    await this.loadTemplateGoods(data.template_id, 'edit');
                }
                this.showEditActivityDrawer = true;
            } catch (err) {
                console.error('获取活动详情失败:', err);
                alert('获取活动详情失败');
            }
        },

        // 关闭编辑活动抽屉
        closeEditActivityDrawer() {
            this.showEditActivityDrawer = false;
        },

        // 打开活动详情抽屉
        async openActivityDetailDrawer(activity) {
            try {
                await this.fetchActiveActivityTemplates();
                const response = await axios.get(`/api/activities/${activity.id}`, { withCredentials: true });
                const data = response.data.activity;

                // 加载模板包含的商品
                let goods = [];
                if (data.template_id) {
                    const templateResponse = await axios.get(`/api/activity-templates/${data.template_id}`, { withCredentials: true });
                    const template = templateResponse.data.template;

                    if (template.select_type == 1) {
                        const classifyList = template.classify_list || [];
                        for (const classify of classifyList) {
                            const goodsResponse = await axios.get(`/api/goods?classifyid=${classify.classify_id}&status=0`, { withCredentials: true });
                            goods = goods.concat(goodsResponse.data.goods || []);
                        }
                    } else {
                        const goodsList = template.goods_list || [];
                        goods = goodsList.map(g => ({
                            id: g.goods_id,
                            name: g.goods_name,
                            price: g.price
                        }));
                    }
                }

                // 格式化日期时间
                const formatDateForDisplay = (dateStr) => {
                    if (!dateStr) return '';
                    return new Date(dateStr).toLocaleString('zh-CN');
                };

                this.activityDetailData = {
                    id: data.id,
                    name: data.name,
                    template_id: data.template_id,
                    template_name: data.template_name,
                    template_type: data.template_type,
                    template_select_type: data.select_type,
                    start_time: formatDateForDisplay(data.start_time),
                    end_time: formatDateForDisplay(data.end_time),
                    status: data.status,
                    details: data.details || [],
                    goods: goods
                };
                this.activityDetailGoodsCurrentPage = 1;
                this.showActivityDetailDrawer = true;
            } catch (err) {
                console.error('获取活动详情失败:', err);
                alert('获取活动详情失败');
            }
        },

        // 关闭活动详情抽屉
        closeActivityDetailDrawer() {
            this.showActivityDetailDrawer = false;
        },

        // 活动详情商品分页
        changeActivityDetailGoodsPage(page) {
            if (page >= 1 && page <= this.activityDetailGoodsTotalPages) {
                this.activityDetailGoodsCurrentPage = page;
            }
        },

        // 活动模板商品分页（新增/编辑活动）
        changeActivityTemplateGoodsPage(page) {
            if (page >= 1 && page <= this.activityTemplateGoodsTotalPages) {
                this.activityTemplateGoodsCurrentPage = page;
            }
        },

        // 编辑活动模板选择变化
        async onEditActivityTemplateChange() {
            const template = this.activeActivityTemplates.find(t => t.id == this.editActivityData.template_id);
            if (template) {
                this.editActivityData.template_type = template.type;
                this.editActivityData.template_select_type = template.select_type;
                // 加载模板包含的商品
                await this.loadTemplateGoods(template.id, 'edit');
            } else {
                this.editActivityData.template_type = '';
                this.editActivityData.template_select_type = '';
                this.editActivityTemplateGoods = [];
            }
        },

        // 添加编辑活动明细规则
        addEditActivityDetail() {
            this.editActivityData.details.push({ threshold_amount: 0, discount_value: 0 });
        },

        // 删除编辑活动明细规则
        removeEditActivityDetail(index) {
            this.editActivityData.details.splice(index, 1);
        },

        // 保存编辑活动
        async saveEditActivity() {
            if (!this.editActivityData.name || !this.editActivityData.template_id || !this.editActivityData.start_time || !this.editActivityData.end_time) {
                alert('请填写必填项');
                return;
            }
            if (this.editActivityData.template_type == 2 && this.editActivityData.details.length === 0) {
                alert('满折类型活动需要至少添加一条优惠规则');
                return;
            }
            try {
                const putData = {
                    name: this.editActivityData.name,
                    template_id: parseInt(this.editActivityData.template_id),
                    start_time: this.editActivityData.start_time,
                    end_time: this.editActivityData.end_time,
                    status: parseInt(this.editActivityData.status),
                    details: this.editActivityData.details
                };
                await axios.put(`/api/activities/${this.editActivityData.id}`, putData, { withCredentials: true });
                await this.fetchActivities();
                this.closeEditActivityDrawer();
                alert('活动更新成功');
            } catch (err) {
                console.error('更新活动失败:', err);
                alert(err.response?.data?.error || '更新活动失败');
            }
        },

        // 更新活动状态
        async updateActivityStatus(id, status) {
            try {
                await axios.put(`/api/activities/${id}/status`, { status }, { withCredentials: true });
                await this.fetchActivities();
                alert(status === 0 ? '已启用' : '已禁用');
            } catch (err) {
                console.error('更新状态失败:', err);
                alert(err.response?.data?.error || '更新状态失败');
            }
        },

        // 删除活动
        async deleteActivity(id) {
            try {
                await axios.delete(`/api/activities/${id}`, { withCredentials: true });
                await this.fetchActivities();
                alert('活动删除成功');
            } catch (err) {
                console.error('删除活动失败:', err);
                alert(err.response?.data?.error || '删除活动失败');
            }
        },

        // ==================== 合同管理方法 ====================

        // 获取合同列表
        async fetchContracts() {
            try {
                const response = await axios.get('/api/contracts', { withCredentials: true });
                this.contracts = response.data.contracts || [];
                this.filteredContracts = [...this.contracts];
            } catch (err) {
                console.error('获取合同列表失败:', err);
            }
        },

        // 搜索合同
        searchContracts() {
            this.filteredContracts = this.contracts.filter(contract => {
                const matchId = !this.contractFilters.id || contract.id == this.contractFilters.id;
                const matchStudentId = !this.contractFilters.student_id || contract.student_id == this.contractFilters.student_id;
                const matchStudentName = !this.contractFilters.student_name || (contract.student_name && contract.student_name.includes(this.contractFilters.student_name));
                const matchType = this.contractFilters.type === '' || contract.type == this.contractFilters.type;
                const matchStatus = this.contractFilters.status === '' || contract.status == this.contractFilters.status;
                const matchPaymentStatus = this.contractFilters.payment_status === '' || contract.payment_status == this.contractFilters.payment_status;

                return matchId && matchStudentId && matchStudentName && matchType && matchStatus && matchPaymentStatus;
            });
            this.contractCurrentPage = 1;
        },

        // 重置合同筛选
        resetContractFilters() {
            this.contractFilters = {
                id: '',
                student_id: '',
                student_name: '',
                type: '',
                status: '',
                payment_status: ''
            };
            this.filteredContracts = [...this.contracts];
            this.contractCurrentPage = 1;
        },

        // 合同分页切换
        changeContractPage(page) {
            if (page >= 1 && page <= this.contractTotalPages) {
                this.contractCurrentPage = page;
            }
        },

        // 获取合同类型文本
        getContractTypeText(type) {
            const typeMap = {
                0: '首报',
                1: '续报'
            };
            return typeMap[type] || '';
        },

        // 获取签署形式文本
        getSignatureFormText(form) {
            const formMap = {
                0: '线上签署',
                1: '线下签署'
            };
            return formMap[form] || '';
        },

        // 获取合同状态文本
        getContractStatusText(status) {
            const statusMap = {
                0: '待审核',
                50: '已通过',
                98: '已作废',
                99: '协议中止'
            };
            return statusMap[status] || '';
        },

        // 获取付款状态文本
        getPaymentStatusText(status) {
            const statusMap = {
                0: '未付款',
                10: '部分付款',
                30: '已付款'
            };
            return statusMap[status] || '';
        },

        // 打开新增合同抽屉
        async openAddContractDrawer() {
            this.addContractData = {
                student_id: '',
                student_name: '',
                type: '',
                signature_form: '',
                name: '',
                contract_amount: '',
                signatory: ''
            };

            // 获取启用的学生列表
            try {
                const response = await axios.get('/api/students/active', { withCredentials: true });
                this.activeStudentsForOrder = response.data.students;
            } catch (err) {
                console.error('获取学生列表失败:', err);
            }

            this.showAddContractDrawer = true;
        },

        // 关闭新增合同抽屉
        closeAddContractDrawer() {
            this.showAddContractDrawer = false;
            this.addContractData = {
                student_id: '',
                student_name: '',
                type: '',
                signature_form: '',
                name: '',
                contract_amount: '',
                signatory: ''
            };
        },

        // 学生选择变化（合同）
        onContractStudentChange() {
            const student = this.activeStudentsForOrder.find(s => s.id === parseInt(this.addContractData.student_id));
            if (student) {
                this.addContractData.student_name = student.student_name;
                this.updateContractName();
            }
        },

        // 更新合同名称
        updateContractName() {
            // 只有线下签署时才自动生成合同名称
            if (this.addContractData.signature_form == 1 && this.addContractData.student_id && this.addContractData.type !== '') {
                const typeText = this.addContractData.type == 0 ? '首报' : '续报';
                this.addContractData.name = `${this.addContractData.student_id}${this.addContractData.student_name}${typeText}合同`;
            } else if (this.addContractData.signature_form == 0) {
                // 线上签署时清空合同名称
                this.addContractData.name = '';
            }
        },

        // 确认提交合同
        confirmSubmitContract() {
            if (!this.addContractData.student_id || this.addContractData.type === '' ||
                this.addContractData.signature_form === '' || !this.addContractData.name ||
                !this.addContractData.contract_amount) {
                alert('请填写所有必填项');
                return;
            }

            // 线下签署需要填写签署方
            if (this.addContractData.signature_form == 1 && !this.addContractData.signatory) {
                alert('请填写签署方');
                return;
            }

            this.showSubmitContractConfirm = true;
        },

        // 提交合同
        async submitContract() {
            try {
                await axios.post('/api/contracts', this.addContractData, { withCredentials: true });
                alert('合同提交成功');
                this.showSubmitContractConfirm = false;
                this.closeAddContractDrawer();
                await this.fetchContracts();
            } catch (err) {
                console.error('提交合同失败:', err);
                alert(err.response?.data?.error || '提交合同失败');
            }
        },

        // 打开合同详情抽屉
        async openContractDetailDrawer(contract) {
            try {
                const response = await axios.get(`/api/contracts/${contract.id}`, { withCredentials: true });
                this.contractDetailData = response.data.contract;
                this.showContractDetailDrawer = true;
            } catch (err) {
                console.error('获取合同详情失败:', err);
                alert('获取合同详情失败');
            }
        },

        // 关闭合同详情抽屉
        closeContractDetailDrawer() {
            this.showContractDetailDrawer = false;
            this.contractDetailData = {
                id: '',
                student_id: '',
                student_name: '',
                type: '',
                signature_form: '',
                name: '',
                contract_amount: '',
                signatory: '',
                initiating_party: '',
                initiator: '',
                status: '',
                payment_status: '',
                create_time: ''
            };
        },

        // 确认撤销合同
        confirmRevokeContract() {
            this.showRevokeContractConfirm = true;
        },

        // 撤销合同
        async revokeContract() {
            try {
                await axios.put(`/api/contracts/${this.contractDetailData.id}/revoke`, {}, { withCredentials: true });
                alert('合同已撤销');
                this.showRevokeContractConfirm = false;
                this.closeContractDetailDrawer();
                await this.fetchContracts();
            } catch (err) {
                console.error('撤销合同失败:', err);
                alert(err.response?.data?.error || '撤销合同失败');
            }
        },

        // 打开中止合作弹窗
        openTerminateContractModal() {
            this.terminationAgreementFile = null;
            this.showTerminateContractModal = true;
        },

        // 关闭中止合作弹窗
        closeTerminateContractModal() {
            this.showTerminateContractModal = false;
            this.terminationAgreementFile = null;
        },

        // 处理中止协议文件上传
        handleTerminationFileUpload(event) {
            const file = event.target.files[0];
            if (file && file.type === 'application/pdf') {
                this.terminationAgreementFile = file;
            } else {
                alert('请上传PDF文件');
                event.target.value = '';
            }
        },

        // 中止合作
        async terminateContract() {
            if (!this.terminationAgreementFile) {
                alert('请上传中止协议');
                return;
            }

            try {
                // 这里简化处理，实际应该上传文件到服务器并获取文件路径
                // 暂时使用文件名作为路径
                const terminationAgreement = this.terminationAgreementFile.name;

                await axios.put(`/api/contracts/${this.contractDetailData.id}/terminate`, {
                    termination_agreement: terminationAgreement
                }, { withCredentials: true });

                alert('合作已中止');
                this.closeTerminateContractModal();
                this.closeContractDetailDrawer();
                await this.fetchContracts();
            } catch (err) {
                console.error('中止合作失败:', err);
                alert(err.response?.data?.error || '中止合作失败');
            }
        },

        // ==================== 收款管理方法 ====================

        // 获取收款列表
        async fetchPaymentCollections() {
            try {
                const response = await axios.get('/api/payment-collections');
                this.paymentCollections = response.data.collections;
                this.filteredPaymentCollections = this.paymentCollections;
            } catch (err) {
                console.error('获取收款数据失败:', err);
            }
        },

        // 搜索收款
        searchPaymentCollections() {
            this.filteredPaymentCollections = this.paymentCollections.filter(pc => {
                if (this.paymentCollectionFilters.id && pc.id != this.paymentCollectionFilters.id) {
                    return false;
                }
                if (this.paymentCollectionFilters.student_id && pc.student_id != this.paymentCollectionFilters.student_id) {
                    return false;
                }
                if (this.paymentCollectionFilters.payer && pc.payer !== this.paymentCollectionFilters.payer) {
                    return false;
                }
                if (this.paymentCollectionFilters.payment_method !== '' && pc.payment_method != this.paymentCollectionFilters.payment_method) {
                    return false;
                }
                if (this.paymentCollectionFilters.trading_date) {
                    const tradingDate = pc.trading_hours ? pc.trading_hours.split('T')[0] : '';
                    if (tradingDate !== this.paymentCollectionFilters.trading_date) {
                        return false;
                    }
                }
                if (this.paymentCollectionFilters.status !== '' && pc.status != this.paymentCollectionFilters.status) {
                    return false;
                }
                return true;
            });
            this.paymentCollectionCurrentPage = 1;
        },

        // 重置收款筛选
        resetPaymentCollectionFilters() {
            this.paymentCollectionFilters = {
                id: '',
                student_id: '',
                payer: '',
                payment_method: '',
                trading_date: '',
                status: ''
            };
            this.filteredPaymentCollections = this.paymentCollections;
            this.paymentCollectionCurrentPage = 1;
        },

        // 分页切换
        changePaymentCollectionPage(page) {
            this.paymentCollectionCurrentPage = page;
        },

        // 获取付款场景文本
        getPaymentScenarioText(scenario) {
            const map = { 0: '线上', 1: '线下' };
            return map[scenario] || '-';
        },

        // 获取付款方式文本
        getPaymentMethodText(method) {
            const map = { 0: '微信', 1: '支付宝', 2: '优利支付', 3: '零零购支付', 9: '对公转账' };
            return map[method] || '-';
        },

        // 获取收款主体文本
        getPayeeEntityText(entity) {
            const map = { 0: '北京', 1: '西安' };
            return map[entity] || '-';
        },

        // 获取收款状态文本
        getCollectionStatusText(status) {
            const map = { 0: '待支付', 10: '未核验', 20: '已支付' };
            return map[status] || '-';
        },

        // 打开新增收款弹窗
        async openAddPaymentCollectionModal() {
            this.paymentCollectionForm = {
                student_id: '',
                order_id: '',
                pending_amount: '',
                payment_scenario: '',
                payment_method: '',
                payment_amount: '',
                payer: '',
                payee_entity: '',
                trading_hours: ''
            };
            this.studentUnpaidOrders = [];
            this.selectedOrderInfo = null;

            // 加载启用的学生列表
            try {
                const response = await axios.get('/api/students/active');
                this.activeStudents = response.data.students;
            } catch (err) {
                console.error('获取学生列表失败:', err);
                this.activeStudents = [];
            }

            this.showAddPaymentCollectionModal = true;
        },

        // 关闭新增收款弹窗
        closeAddPaymentCollectionModal() {
            this.showAddPaymentCollectionModal = false;
        },

        // 学生选择变化
        async onPaymentStudentChange() {
            this.paymentCollectionForm.order_id = '';
            this.paymentCollectionForm.pending_amount = '';
            this.selectedOrderInfo = null;

            if (!this.paymentCollectionForm.student_id) {
                this.studentUnpaidOrders = [];
                return;
            }

            try {
                const response = await axios.get(`/api/students/${this.paymentCollectionForm.student_id}/unpaid-orders`);
                this.studentUnpaidOrders = response.data.orders;
            } catch (err) {
                console.error('获取学生订单失败:', err);
                this.studentUnpaidOrders = [];
            }
        },

        // 订单选择变化
        async onPaymentOrderChange() {
            this.paymentCollectionForm.pending_amount = '';
            this.selectedOrderInfo = null;

            if (!this.paymentCollectionForm.order_id) {
                return;
            }

            try {
                const response = await axios.get(`/api/orders/${this.paymentCollectionForm.order_id}/pending-amount`);
                this.paymentCollectionForm.pending_amount = response.data.pending_amount;
                this.selectedOrderInfo = {
                    expected_payment_time: response.data.expected_payment_time
                };
            } catch (err) {
                console.error('获取待支付金额失败:', err);
            }
        },

        // 付款场景变化
        onPaymentScenarioChange() {
            this.paymentCollectionForm.payment_method = '';
        },

        // 提交新增收款
        async submitPaymentCollection() {
            // 校验必填项
            if (!this.paymentCollectionForm.student_id ||
                !this.paymentCollectionForm.order_id ||
                this.paymentCollectionForm.payment_scenario === '' ||
                this.paymentCollectionForm.payment_method === '' ||
                !this.paymentCollectionForm.payment_amount ||
                this.paymentCollectionForm.payee_entity === '') {
                alert('请填写所有必填项');
                return;
            }

            // 校验付款金额
            const paymentAmount = parseFloat(this.paymentCollectionForm.payment_amount);
            const pendingAmount = parseFloat(this.paymentCollectionForm.pending_amount);
            if (paymentAmount > pendingAmount) {
                alert(`付款金额不能超过待支付金额(${pendingAmount})`);
                return;
            }

            try {
                const payload = {
                    student_id: parseInt(this.paymentCollectionForm.student_id),
                    order_id: parseInt(this.paymentCollectionForm.order_id),
                    payment_scenario: parseInt(this.paymentCollectionForm.payment_scenario),
                    payment_method: parseInt(this.paymentCollectionForm.payment_method),
                    payment_amount: paymentAmount,
                    payer: this.paymentCollectionForm.payer,
                    payee_entity: parseInt(this.paymentCollectionForm.payee_entity),
                    trading_hours: this.paymentCollectionForm.trading_hours || null
                };

                await axios.post('/api/payment-collections', payload);
                alert('收款新增成功');
                this.closeAddPaymentCollectionModal();
                await this.fetchPaymentCollections();
            } catch (err) {
                console.error('新增收款失败:', err);
                alert(err.response?.data?.error || '新增收款失败');
            }
        },

        // 确认到账
        confirmPaymentCollection(pc) {
            this.currentPaymentCollection = pc;
            this.showConfirmPaymentModal = true;
        },

        // 执行确认到账
        async doConfirmPayment() {
            try {
                await axios.put(`/api/payment-collections/${this.currentPaymentCollection.id}/confirm`);
                alert('已确认到账');
                this.showConfirmPaymentModal = false;
                this.currentPaymentCollection = null;
                await this.fetchPaymentCollections();
            } catch (err) {
                console.error('确认到账失败:', err);
                alert(err.response?.data?.error || '确认到账失败');
            }
        },

        // 确认删除收款
        confirmDeletePaymentCollection(pc) {
            this.currentPaymentCollection = pc;
            this.showDeletePaymentModal = true;
        },

        // 执行删除收款
        async doDeletePayment() {
            try {
                await axios.delete(`/api/payment-collections/${this.currentPaymentCollection.id}`);
                alert('收款已删除');
                this.showDeletePaymentModal = false;
                this.currentPaymentCollection = null;
                await this.fetchPaymentCollections();
            } catch (err) {
                console.error('删除收款失败:', err);
                alert(err.response?.data?.error || '删除收款失败');
            }
        }
    }
}).mount('#app');
