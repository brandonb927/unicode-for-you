// Detect if an element is in the viewport
// https://gist.github.com/jjmu15/8646226
const isElementInViewport = element => {
  let rect = element.getBoundingClientRect();
  let html = document.documentElement;
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || html.clientHeight) &&
    rect.right <= (window.innerWidth || html.clientWidth)
  );
};

export default isElementInViewport;
