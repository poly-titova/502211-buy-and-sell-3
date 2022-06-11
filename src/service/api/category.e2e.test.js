'use strict';

const express = require(`express`);
const request = require(`supertest`);

const category = require(`./category`);
const DataService = require(`../data-service/category`);

const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `OK1nlU`,
    "category": [
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
        "id": `fokpWk`,
        "text": `А где блок питания?`
      },
      {
        "id": `1taug0`,
        "text": `Совсем немного... С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии?`
      }
    ]
  },
  {
    "id": `5nnopP`,
    "category": [
      `Разное`
    ],
    "description": `При покупке с меня бесплатная доставка в черте города. Это настоящая находка для коллекционера! Пользовались бережно и только по большим праздникам. Если найдёте дешевле — сброшу цену.`,
    "picture": `item09.jpg`,
    "title": `Продам новую приставку Sony Playstation 5.`,
    "type": `offer`,
    "sum": 54771,
    "comments": [
      {
        "id": `L82MZM`,
        "text": `А где блок питания?`
      },
      {
        "id": `SWwx8a`,
        "text": `Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "id": `lGOtBF`,
        "text": `Совсем немного...`
      }
    ]
  },
  {
    "id": `6rR9az`,
    "category": [
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
        "id": `UM-GTK`,
        "text": `С чем связана продажа? Почему так дешёво?`
      },
      {
        "id": `Ljr3er`,
        "text": `Продаю в связи с переездом. Отрываю от сердца. С чем связана продажа? Почему так дешёво?`
      },
      {
        "id": `IniHWg`,
        "text": `Оплата наличными или перевод на карту? А где блок питания? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "id": `b-LNf6`,
        "text": `А сколько игр в комплекте?`
      }
    ]
  },
  {
    "id": `eHJ61z`,
    "category": [
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
        "id": `mRs3Iy`,
        "text": `А где блок питания? Вы что?! В магазине дешевле. А сколько игр в комплекте?`
      },
      {
        "id": `HuqZrg`,
        "text": `Вы что?! В магазине дешевле.`
      },
      {
        "id": `c01Bmp`,
        "text": `С чем связана продажа? Почему так дешёво?`
      },
      {
        "id": `NuxXbV`,
        "text": `Вы что?! В магазине дешевле. Оплата наличными или перевод на карту?`
      }
    ]
  },
  {
    "id": `MD60Og`,
    "category": [
      `Разное`
    ],
    "description": `Товар в отличном состоянии. Если найдёте дешевле — сброшу цену. Это настоящая находка для коллекционера! Продаю с болью в сердце...`,
    "picture": `item14.jpg`,
    "title": `Куплю антиквариат.`,
    "type": `offer`,
    "sum": 32862,
    "comments": [
      {
        "id": `XDrBEE`,
        "text": `С чем связана продажа? Почему так дешёво? Вы что?! В магазине дешевле.`
      }
    ]
  }
];

const app = express();
app.use(express.json());
category(app, new DataService(mockData));

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 5 categories`, () => expect(response.body.length).toBe(5));

  test(`Category names are "Журналы", "Игры", "Книги", "Разное", "Животные"`,
      () => expect(response.body).toEqual(
          expect.arrayContaining([`Журналы`, `Игры`, `Книги`, `Разное`, `Животные`])
      )
  );
});
