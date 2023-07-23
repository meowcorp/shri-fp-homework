/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {  gte, where, compose, equals, allPass, prop, not, juxt, partialRight, count, all, both,  partial  } from "ramda";

const isGreen = equals('green')
const isRed = equals('red')
const isWhite = equals('white') 
const isBlue = equals('blue')
const isOrange = equals('orange')

const notRed = compose(not, isRed)
const notWhite = compose(not, isWhite)

const countGreen = count(isGreen)
const countRed = count(isRed)
const countBlue = count(isBlue)
const countNonWhite = count(notWhite)

const getSquare = prop('square');
const getCircle = prop('circle');
const getTriangle = prop('triangle');
const getStar = prop('star');

const eq1 = equals(1)
const eq2 = equals(2)
const gte2 = partialRight(gte, [2])
const gte3 = partialRight(gte, [3])

const getAllFigures = juxt([
    getSquare,
    getCircle,
    getTriangle,
    getStar
])

const allGreen = partial(all, [isGreen])
const allOrange = partial(all, [isOrange])

const isEqual = (pred1, pred2) => (val) => equals(pred1(val), pred2(val))

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
    compose(isRed, getStar),
    compose(isGreen, getSquare),
    compose(isWhite, getCircle),
    compose(isWhite, getTriangle),
])

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(gte2, countGreen, getAllFigures);

// 3. Количество красных фигур равно кол-ву синих.
const isBlueEqualRed = isEqual(countRed, countBlue)
export const validateFieldN3 = compose(isBlueEqualRed, getAllFigures);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
    compose(isBlue, getCircle),
    compose(isRed, getStar),
    compose(isOrange, getSquare),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(gte3, countNonWhite, getAllFigures);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
    compose(isGreen, getTriangle),
    compose(eq2, countGreen, getAllFigures),
    compose(eq1, countRed, getAllFigures)
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(allOrange, getAllFigures);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = both(
    compose(notRed, getStar),
    compose(notWhite, getStar)
);

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(allGreen, getAllFigures)

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
    isEqual(getTriangle, getSquare),
    compose(notWhite, getSquare)
])
