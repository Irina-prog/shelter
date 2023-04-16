const maxPageCount = 16;
export class Paginator {
    #currentPage = 1;
    #dataProvider = null;
    constructor(dataProvider) {
        this.#dataProvider = dataProvider;
        dataProvider.generateDataForPagination(maxPageCount);
    }
    // return number of pages depends on screen size 1280px - 6, при 768px - 8, при 320px - 16
    get pageCount() { //свойство(умное поле) при чтении этого поля у экземпляра класса  будет вызываться эта функция
        if (window.innerWidth >= 1280) {
            return 6;
        }
        if (window.innerWidth >= 640) {
            return 8;
        }
        return 16;
    }
    //number of cards per page depends on screen size
    get pageSize() {
        if (window.innerWidth >= 1280) {
            return 8;
        }
        if (window.innerWidth >= 640) {
            return 6;
        }
        return 3;
    }
    get currentPage() { // get - когда обращаемся к свойству
        return this.#currentPage;
    }

    set currentPage(page) { // paginator.currentPage = 1  передаст 1 как параметр page у этой функции
        if (page < 1) {     // set - когда устанавливаем значение свойства
            page = 1;          
        } 
        const lastPage = this.pageCount; // не нужны скобки потому что это свойство get. для функции нужны скобки при вызове
        if (page > lastPage) {
            page = lastPage;
        }
        this.#currentPage = page;
    }

    get canGoToFirstPage() { // свойство логическое булевого типа
        return this.#currentPage > 1; // если текущая страница больше единицы тогда можно возвращаться на первую страницу
    }

    get canGoToLastPage() {  //свойство тоже логическое
        return this.#currentPage < this.pageCount; // если текущая страница не равна последней а по факту меньше то на нее можно перейти
    }
    
    getCurrentPageData(){ //более сложное уже не поле а функция
        return this.#dataProvider.getPetsPageData(this.#currentPage).slice(0, this.pageSize);
    } //получили набор карточек для текущей страницы и обрезаем со слайс под размер текущего экрана
}

