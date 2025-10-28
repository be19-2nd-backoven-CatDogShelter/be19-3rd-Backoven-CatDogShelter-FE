<template>
    <template v-if = "loading">
        <h2>준비중</h2>
    </template>
        <!-- 필터링 영역 -->
    <template v-else>
        <!-- 제목, 내용, 작성자 검색란 -->
        <div>
            <select v-model = "searchOption">
            <option v-for="item in items" :key="item" :value = "item">{{ item }}</option>
            </select>
            <input type = "text" v-model = "input">
            <button @click = "searchButton">검색</button>
        </div>

        <!-- 필터링 영역 -->
        <div>
            <p @click = "filter = !filter;">필터</p>
            <template v-if="filter">
                <hr>
                <div id = "animalCategoryFilter">
                    <label>동물 종류</label>
                    <select v-model="search.animalType">
                        <option v-for="animal in animalCategory" :key="animal" :value = "animal">{{ animal }}</option>
                    </select>
                </div>
                <br>
                <div id = "breedFilter">
                    <label>품종</label>
                    <input type = "text" v-model = "search.breed">
                </div>
                <br>
                <div id = "colorFilter">
                    <label>색상</label>
                    <input type = "text" v-model = "search.color">
                </div>
                <br>
                <div id = "sigunguFilter">
                    <label>발견 장소</label>
                    <select v-model = "search.sigunguCode">
                        <option v-for = "(name, index) in sigunguNames" :key = "name" :value = "index + 1">{{ name }}</option>
                    </select>
                </div>
                <br>
                <button @click = "searchButton">검색</button>
            </template>
            <label>총 {{ totalCount }}개의 게시글</label>
            <select v-model = "search.order">
                <option v-for= "(orderName, index) in orders" :key = "orderName" :value = "index">{{ orderName }}</option>
            </select>
        </div>
    </template>
</template>

<script setup>

</script>

<style scoped>

</style>