export class DataProvider {
    // нужны для слайдера для реализации истории переходов и ее сохранения
    #currentData = null; //то, что сейчас отображается
    #previousData = null; //то, что будет отображено при нажатии назад
    #nextData = null; // то, что будет отображено при нажатии впреред
    //нужны для слайдера и паджинатора
    #originalData = []; //данные, загруженные из json
    //нужны для паджинатора
    #pageData = []; //данные для всех страниц
    async loadData() {
        const response = await fetch('../../js/pets.json');
        const jsonData = await response.json();
        this.#originalData = jsonData;
    }
    #generateRandomId() {
        return Math.round(Math.random() * (this.#originalData.length - 1)) + 1;
    }
    // для слайдера набор карточек при нажатии далее
    generateNextData() {
        if (!this.#nextData) { // # - cпособ объявления внутри класса приватных членов, снаружи к ним не обратиться
            this.#nextData = [];
            this.#previousData = null;
            while (true) {
                const id = this.#generateRandomId();
                if (this.#currentData?.some(card => card.id === id) || this.#nextData.some(card => card.id === id)) {
                    continue; //some возвращает true если хоть одна карточка совпала, так же проверяем нет ли этого номера карточки в следующем наборе
                }
                this.#nextData.push(this.#originalData.find(card => card.id === id)); //find находит по номеру id карточку в оригинальных данных
                if (this.#nextData.length === 3) {
                    break;
                }
            }
        }
        this.#previousData = this.#currentData;
        this.#currentData = this.#nextData;
        this.#nextData = null;
        return this.#currentData;
    }
    //для слайдера генерирует набор карточек при нажатии назад
    generatePreviousData() {
        if (!this.#previousData) {
            this.#previousData = [];
            this.#nextData = null;
            while (true) {
                const id = this.#generateRandomId();
                if (this.#currentData?.some(card => card.id === id) || this.#previousData.some(card => card.id === id)) {
                    continue; // аналогично как при нажатии вперед - только добавляется в previous
                }
                this.#previousData.push(this.#originalData.find(card => card.id === id));
                if (this.#previousData.length === 3) {
                    break;
                }
            }
        }
        this.#nextData = this.#currentData;
        this.#currentData = this.#previousData;
        this.#previousData = null;
        return this.#currentData;
    }
    // get data for pagination for pets page
    getPetsPageData(page) {
        return this.#pageData[page - 1]; //возварщает массив с данными карточек которые нужно отобразить на данной странице
    }       // первая страница это 1 а у индексов индексация с нуля поэтому отнимаем 1
    //генерируем в рандомном порядке целую страницу карточек без повторов для одной страницы
    #getRandomDataForPage() {  
        const list = [];
        while (true) {
            const id = this.#generateRandomId();
            if (list.some(card => card.id === id)) {
                continue;
            }
            list.push(this.#originalData.find(card => card.id === id));
            if (list.length === this.#originalData.length) {
                break;
            }
        }
        return list;
    }
    // генерирует данные для всех страниц
    generateDataForPagination(maxPageCount) {
        this.#pageData = [];
        for (let i = 0; i < maxPageCount; i++) {
            this.#pageData.push(this.#getRandomDataForPage());
        }
    }
}


