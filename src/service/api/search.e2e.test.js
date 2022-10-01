'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const search = require(`./search`);
const DataService = require(`../data-service/search`);

const {HttpCode} = require(`../../constants`);

const mockCategories = [
  `Журналы`,
  `Игры`,
  `Книги`,
  `Разное`,
  `Животные`
];

const mockData = [
  {
    "categories": [
      `Журналы`,
      `Игры`,
      `Книги`
    ],
    "description": `Если товар не понравится — верну всё до последней копейки. Таких предложений больше нет! Кажется, что это хрупкая вещь. Не пытайтесь торговаться. Цену вещам я знаю.`,
    "picture": `item04.jpg`,
    "title": `Куплю породистого кота.`,
    "type": `sale`,
    "sum": 28764,
    "comments": [
      {
        "text": `А где блок питания?`
      },
      {
        "text": `Совсем немного... С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии?`
      }
    ]
  },
  {
    "id": `5nnopP`,
    "categories": [
      `Разное`
    ],
    "description": `При покупке с меня бесплатная доставка в черте города. Это настоящая находка для коллекционера! Пользовались бережно и только по большим праздникам. Если найдёте дешевле — сброшу цену.`,
    "picture": `item09.jpg`,
    "title": `Продам новую приставку Sony Playstation 5.`,
    "type": `offer`,
    "sum": 54771,
    "comments": [
      {
        "text": `А где блок питания?`
      },
      {
        "text": `Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "text": `Совсем немного...`
      }
    ]
  },
  {
    "categories": [
      `Книги`,
      `Животные`,
      `Разное`
    ],
    "description": `Не пытайтесь торговаться. Цену вещам я знаю. Две страницы заляпаны свежим кофе. Это настоящая находка для коллекционера! Бонусом отдам все аксессуары.`,
    "picture": `item15.jpg`,
    "title": `Продам отличную подборку фильмов на VHS.`,
    "type": `offer`,
    "sum": 33475,
    "comments": [
      {
        "text": `С чем связана продажа? Почему так дешёво?`
      },
      {
        "text": `Продаю в связи с переездом. Отрываю от сердца. С чем связана продажа? Почему так дешёво?`
      },
      {
        "text": `Оплата наличными или перевод на карту? А где блок питания? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "text": `А сколько игр в комплекте?`
      }
    ]
  },
  {
    "categories": [
      `Журналы`,
      `Книги`,
      `Животные`,
      `Разное`
    ],
    "description": `Даю недельную гарантию. Не пытайтесь торговаться. Цену вещам я знаю. Если найдёте дешевле — сброшу цену. При покупке с меня бесплатная доставка в черте города.`,
    "picture": `item02.jpg`,
    "title": `Куплю породистого кота.`,
    "type": `sale`,
    "sum": 59400,
    "comments": [
      {
        "text": `А где блок питания? Вы что?! В магазине дешевле. А сколько игр в комплекте?`
      },
      {
        "text": `Вы что?! В магазине дешевле.`
      },
      {
        "text": `С чем связана продажа? Почему так дешёво?`
      },
      {
        "text": `Вы что?! В магазине дешевле. Оплата наличными или перевод на карту?`
      }
    ]
  },
  {
    "categories": [
      `Разное`
    ],
    "description": `Товар в отличном состоянии. Если найдёте дешевле — сброшу цену. Это настоящая находка для коллекционера! Продаю с болью в сердце...`,
    "picture": `item14.jpg`,
    "title": `Куплю антиквариат.`,
    "type": `offer`,
    "sum": 32862,
    "comments": [
      {
        "text": `С чем связана продажа? Почему так дешёво? Вы что?! В магазине дешевле.`
      }
    ]
  }
];

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, offers: mockOffers});
  search(app, new DataService(mockDB));
});

describe(`API returns offer based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Куплю антиквариат.`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`1 offer found`, () => expect(response.body.length).toBe(1));
  test(`Offer has correct title`, () => expect(response.body[0].title).toBe(`Куплю антиквариат`));
});

test(`API returns code 404 if nothing is found`,
    () => request(app)
      .get(`/search`)
      .query({
        query: `Продам свою душу`
      })
      .expect(HttpCode.NOT_FOUND)
);

test(`API returns 400 when query string is absent`,
    () => request(app)
      .get(`/search`)
      .expect(HttpCode.BAD_REQUEST)
);
