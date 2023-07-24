/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import {tap, compose, allPass, gt, lt, partialRight, length, test, when, curry, ifElse, partial, assoc, __, andThen, prop, mathMod, join, otherwise} from 'ramda'

const API_CONVERT_BASE = "https://api.tech/numbers/base"
const API_ANIMAL_TECH = "https://animals.tech"

 const api = new Api();


 const processSequence = ({value, writeLog, handleSuccess, handleError}) => {

     const tapLog = tap(writeLog)
     const tapSuccess = tap(handleSuccess)
     const tapError = tap(handleError)

     const logValidationError = partial(tapError, ['ValidationError'])
     const lt10 = partialRight(lt, [10])
     const gt2 = partialRight(gt, [2])
     const gt0 = partialRight(gt, [0])

     const notation10 = test(/[0-9]+\.?[0-9]+/)

     const isValueValid = allPass([
        compose(lt10, length),
        compose(gt2, length),
        notation10,
        gt0
     ])

     const apiGetWithoutParams = api.get(__, {})

     const parseAndRound = compose(Math.round, parseInt)
     const convertToBase = api.get(API_CONVERT_BASE)
     const assocFromTenToTwo = assoc('number', __, {from: 10, to: 2})
     const convertValueToBase = compose(convertToBase, assocFromTenToTwo)
     const getAnimalTechEndpoint = curry(id => `${API_ANIMAL_TECH}/${id}`)
     const getAnimalById = compose(apiGetWithoutParams, getAnimalTechEndpoint)
     
     const mod3 = mathMod(__, 3)
     const pow2 = partial(Math.pow, [2])

     const resultProp = prop("result")

     const thenGetResultFromReq = andThen(resultProp)
     const thenLog = andThen(tapLog)
     const thenLength = andThen(length)
     const thenPow2 = andThen(pow2)
     const thenMod3 = andThen(mod3)
     const thenGetAnimal = andThen(getAnimalById)
     const thenHandleSuccess = andThen(tapSuccess)
     const otherwiseHandleError = otherwise(tapError)
     
     const sequence = compose(
      otherwiseHandleError,
      thenHandleSuccess,
      thenGetResultFromReq,
      thenGetAnimal,
      thenLog,
      thenMod3,
      thenLog,
      thenPow2,
      thenLog,
      thenLength,
      thenLog,
      thenGetResultFromReq,
      convertValueToBase,
      tapLog,
      parseAndRound,
      tapLog,
     )
     
     const validateValueAndRun = ifElse(isValueValid, sequence, logValidationError)

     compose(validateValueAndRun, tapLog)(value)
 }

export default processSequence;
