<template>
    <div class="page row gx-4 gy-3">
        <div class="col-md-10">
            <InputSearch v-model="searchText" />
        </div>

        <div class="col-md-6">
            <h4 class="mb-3">
                Danh bạ <i class="fas fa-address-book"></i>
            </h4>

            <ContactList v-if="filteredContactsCount > 0" :contacts="filteredContacts"
                v-model:activeIndex="activeIndex" />
            <p v-else class="text-muted fst-italic">Không có liên hệ nào.</p>

            <div class="mt-3 d-flex justify-content-around align-items-center flex-wrap gap-2">
                <button class="btn btn-primary btn-sm" @click="refreshList">
                    <i class="fas fa-redo"></i> Làm mới
                </button>
                <button class="btn btn-success btn-sm" @click="goToAddContact">
                    <!-- New changes -->
                    <router-link :to="{
                        name: 'contact.add',
                    }">
                        <i class="fas fa-plus text-white"></i>
                        <span class="text-white">Thêm mới</span>
                    </router-link>
                    <!--  -->
                </button>
                <button class="btn btn-danger btn-sm" @click="removeAllContacts">
                    <i class="fas fa-trash"></i> Xóa tất cả
                </button>
            </div>
        </div>

        <div class="col-md-6">
            <div v-if="activeContact">
                <h4 class="mb-3">
                    Chi tiết Liên hệ <i class="fas fa-address-card"></i>
                </h4>

                <ContactCard :contact="activeContact" />

                <!-- Liên kết đến trang hiệu chỉnh liên hệ -->
                <router-link :to="{ name: 'contact.edit', params: { id: activeContact._id } }"
                    class="btn btn-warning btn-sm mt-3 text-dark">
                    <i class="fas fa-edit"></i> Hiệu chỉnh
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import ContactCard from "@/components/ContactCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import ContactList from "@/components/ContactList.vue";
import ContactService from "@/services/contact.service";

export default {
    components: {
        ContactCard,
        InputSearch,
        ContactList,
    },
    data() {
        return {
            contacts: [],
            activeIndex: -1,
            searchText: "",
        };
    },
    watch: {
        searchText() {
            this.activeIndex = -1;
        },
    },
    computed: {
        contactStrings() {
            return this.contacts.map(({ name, email, address, phone }) =>
                [name, email, address, phone].join("")
            );
        },
        filteredContacts() {
            if (!this.searchText) return this.contacts;
            return this.contacts.filter((_contact, i) =>
                this.contactStrings[i].includes(this.searchText)
            );
        },
        activeContact() {
            if (this.activeIndex < 0) return null;
            return this.filteredContacts[this.activeIndex];
        },
        filteredContactsCount() {
            return this.filteredContacts.length;
        },
    },
    methods: {
        async retrieveContacts() {
            try {
                this.contacts = await ContactService.getAll();
                console.log("Contacts nhận được:", this.contacts);
            } catch (error) {
                console.error("Lỗi khi lấy contact:", error);
            }
        },
        refreshList() {
            this.retrieveContacts();
            this.activeIndex = -1;
        },
        async removeAllContacts() {
            if (confirm("Bạn muốn xóa tất cả Liên hệ?")) {
                try {
                    await ContactService.deleteAll();
                    this.refreshList();
                } catch (error) {
                    console.error(error);
                }
            }
        },
        goToAddContact() {
            this.$router.push({ name: "contact.add" });
        },
    },
    mounted() {
        this.refreshList();
    },
};
</script>

<style scoped>
.page {
    text-align: left;
    max-width: 800px;
    margin: auto;
}
</style>
