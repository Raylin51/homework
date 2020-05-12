/*
***************************
  题目：重新实现 Promise.race
***************************
*/
declare interface PromiseConstructor {
  newRace<T>(values: readonly T[]): Promise<T extends PromiseLike<infer U> ? U : T>;
  newRace<T>(values: Iterable<T>): Promise<T extends PromiseLike<infer U> ? U : T>;
}
Promise.newRace = <T>(iterable: readonly T[] | Iterable<T>) => {
  return new Promise((resolve, reject) => {
    for (let item of iterable) {
      Promise.resolve(item)
        .then(resolve, reject)
    }
  })
}

const promise1 = new Promise(resolve => {
  setTimeout(resolve, 5000, 'one')
})

const promise2 = new Promise(resolve => {
  setTimeout(resolve, 1000, 'two')
})

Promise.newRace([promise1, promise2])
  .then(console.log)
  .catch(console.log)