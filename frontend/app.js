const { createApp } = Vue;

createApp({
    data() {
        return {
            data: {},
            loading: true,
            error: null
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            try {
                this.loading = true;
                const response = await axios.get('http://charonspace.asia/api/data');
                this.data = response.data;
                this.error = null;
            } catch (err) {
                this.error = err.message;
                console.error('Error fetching data:', err);
            } finally {
                this.loading = false;
            }
        }
    }
}).mount('#app');
