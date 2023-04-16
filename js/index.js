import { DataProvider } from './data-provider.js';
import { Paginator } from './paginator.js';


function addBurgerClickHandler() {
  document.querySelector('.hamburger-button').addEventListener('click', toggleHamburgerButton);
  document.querySelector('.hamburger__menu').addEventListener('click', (e) => {
     
      hideHamburgerMenu();
    
  })
}

function toggleHamburgerButton() {

  const hamburgerRotated = document.querySelector('.hamburger-button');
  const body = document.querySelector('body');

  if (body.classList.contains('hamburger_open')) {
    hideHamburgerMenu();
  } else {
    hamburgerRotated.classList.add('hamburger-button_rotated');
    body.classList.add('hamburger_open');
  }
}
function hideHamburgerMenu() {
  const hamburgerRotated = document.querySelector('.hamburger-button');
  const body = document.querySelector('body');
  hamburgerRotated.classList.remove('hamburger-button_rotated');
  body.classList.remove('hamburger_open');
}

function showCardDetails(cardData) { //попап реализация
  const body = document.querySelector('body');
  const popup = document.querySelector('.popup');

  const image = popup.querySelector('.popup__pet-picture');
  image.setAttribute('src', cardData.img);
  image.setAttribute('alt', cardData.name);
  popup.querySelector('.pet-description__name').textContent = cardData.name;
  popup.querySelector('.pet-description__breed').textContent = cardData.breed;
  popup.querySelector('.pet-description__story').textContent = cardData.description;
  
  body.classList.add('popup_open'); //через body задается стиль чтобы блокировать прокрутку при видимом попапе
}

//create html for one card element в памяти
function createCardElement(cardData) {
  const element = document.querySelector('#card').content.firstElementChild.cloneNode(true); //firstElementChild-берем первого ребенка из темплейта и клонируем его
  const image = element.querySelector('.card__image');
  image.setAttribute('src', cardData.img);
  image.setAttribute('alt', cardData.name);
  element.querySelector('.card__pet-name').textContent = cardData.name;
  element.addEventListener('click', () => showCardDetails(cardData));
  return element;
}

// create html for group of cards 2s,3s,1s в памяти
function createCardsElement(cardList) {
  const element = document.querySelector('#cards').content.firstElementChild.cloneNode(true); //клонируем содержимое шаблона из template id=cards
  element.append(createCardElement(cardList[0]), createCardElement(cardList[1]), createCardElement(cardList[2])); //сгенерировано но в памяти 
  return element;
}

function startCarusel(dataProvider) {
  const cardsContainer = document.querySelector('.pets__cards-wrapper');
  if (!cardsContainer) { //если карусели нет - ничего не делать  - для 2 страницы
    return;
  }
  cardsContainer.append(createCardsElement(dataProvider.generateNextData())); //добавляем в разметку сгенерированные карточки

  const buttonLeft = document.querySelector('.button_arrow-left'); 
  const buttonRight = document.querySelector('.button_arrow-right');
  buttonLeft.addEventListener('click', () => { // добавляет обработку левой кнопки
    cardsContainer.style.width = `${cardsContainer.clientWidth}px`; //на момент анимации фиксируем ширину контейнеру
    buttonLeft.disabled = true; // отключили кнопку пока не проигралась анимация
    const previousCards = createCardsElement(dataProvider.generatePreviousData()); //генерируем новый набор карточек
    const currentCards = cardsContainer.querySelector('.pets__cards');
    cardsContainer.prepend(previousCards); // вставляем карточки перед текущим набором
    cardsContainer.scrollTo({  // показываем те карточки которые были
      top: 0,
      left: cardsContainer.scrollWidth, // самое правое положение
      behavior: 'instant',
    });
    cardsContainer.scrollTo({  // и плавно прокручиваем на добавленные карточки
      top: 0,
      left: 0, // самое левое положение 
      behavior: 'smooth',
    });
    setTimeout(() => {
      currentCards.remove(); // удаляем текущие карточки потому что их уже не видно
      buttonLeft.disabled = false; // разблокируем кнопку чтобы повторно можно было нажать
      cardsContainer.style.width = 'auto'; // отменяем фиксацию ширины контейнера
    }, 700);
  });
  buttonRight.addEventListener('click', () => {
    cardsContainer.style.width = `${cardsContainer.clientWidth}px`;
    buttonRight.disabled = true;
    const nextCards = createCardsElement(dataProvider.generateNextData());
    const currentCards = cardsContainer.querySelector('.pets__cards');
    cardsContainer.append(nextCards);
    cardsContainer.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
    cardsContainer.scrollTo({
      top: 0,
      left: cardsContainer.scrollWidth,
      behavior: 'smooth',
    });
    setTimeout(() => {
      currentCards.remove();
      buttonRight.disabled = false;
      cardsContainer.style.width = 'auto';
    }, 700);
  });
}

function startPaginator(dataProvider) {
  const currentPageElement = document.querySelector('.button_pagination-current');
  if (!currentPageElement) {  // для первой страницы если паджинатора нет  - ничего не делать
    return;
  }
  const paginator = new Paginator(dataProvider);
  const paginationPreviousButton = document.querySelector('.button_pagination-previous');
  const paginationFirstButton = document.querySelector('.button_pagination-first');
  const paginationNextButton = document.querySelector('.button_pagination-next');
  const paginationLastButton = document.querySelector('.button_pagination-last');
  const cardsWrapper = document.querySelector('.pets__cards');
  const refreshPaginator = () => { // обновляет текущую страницу в паджинаторе и состояние всех кнопок в паджинаторе и сами карточки связанные с текущей страницей
    if (paginator.currentPage > paginator.pageCount) { // страховка если с маленького разрешения ушли на большое и количество страниц сократилось
      paginator.currentPage = paginator.pageCount; // устанавливаем текущей страницу - последнюю доступную  с учетом ширины экрана
    }
    currentPageElement.textContent = paginator.currentPage; //номер страницы показываем
    paginationPreviousButton.disabled = !paginator.canGoToFirstPage; //разрешает или запрещает кнопке паджинатора работать
    paginationFirstButton.disabled = !paginator.canGoToFirstPage;
    paginationNextButton.disabled = !paginator.canGoToLastPage;
    paginationLastButton.disabled = !paginator.canGoToLastPage;
    cardsWrapper.replaceChildren(...paginator.getCurrentPageData().map(createCardElement)); // обновляет карточки для текущей страницы
  }; //replace - все дочерние элементы убираются а что сгенерировалось встает на их место
  paginationPreviousButton.addEventListener('click', () => {
    paginator.currentPage--; //на предыдущую страницу перешли
    refreshPaginator(); // обновляется весь паджинатор и кнопки и карточки и текущей страницы номер
  });
  paginationLastButton.addEventListener('click', () => {
    paginator.currentPage = paginator.pageCount; //тоже самое на последнюю страницу
    refreshPaginator();
  });
  paginationFirstButton.addEventListener('click', () => {
    paginator.currentPage = 1; // на первую страницу
    refreshPaginator();
  });
  paginationNextButton.addEventListener('click', () => {
    paginator.currentPage++; // на следующую страницу
    refreshPaginator();
  });
  window.addEventListener('resize', () => {  // обновляем паджинатор на изменение окна браузера
    refreshPaginator();
  });
  refreshPaginator(); // начальная отрисовка паджинатора
}
async function main() {
  const dataProvider = new DataProvider();
  await dataProvider.loadData();
  startCarusel(dataProvider);
  startPaginator(dataProvider);
  addBurgerClickHandler();

  document.querySelector('.popup').addEventListener('click', ({target}) => {
    if (target.classList.contains('popup') || target.classList.contains('button_popup')) { // закрыть попап по клику на кнопку или клику вне окна
      document.querySelector('body').classList.remove('popup_open');
    }
  });
}
// точка входа, полностью загружена дом-модель
document.addEventListener('DOMContentLoaded', () => {
  main().catch(console.trace);
});

console.log('Самооценка за работу: 110 баллов 🚀');