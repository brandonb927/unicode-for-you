// Promise-ified setTimeout
const promiseTimeout = (func, ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(func());
    }, ms);
  });
};

export default promiseTimeout;
