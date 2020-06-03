const root = document.querySelector('#boxes');
const input = document.querySelector('.js-input');
const createBtn = document.querySelector('button[data-action="create"]');
const deleteBtn = document.querySelector('button[data-action="destroy"]');

const generateRGBNumber = () => Math.floor(Math.random() * 256);

const getColor = () => {
  const red = generateRGBNumber();
  const green = generateRGBNumber();
  const blue = generateRGBNumber();
  return `rgb(${red}, ${green}, ${blue})`;
};

const createBoxes = (num) => {
  const boxes = [];
  for (
    let i = num, width = 30, height = 30;
    i > 0;
    i -= 1, width += 10, height += 10
  ) {
    const divToCreate = document.createElement('div');
    divToCreate.style.width = `${width}px`;
    divToCreate.style.height = `${height}px`;
    divToCreate.style.backgroundColor = getColor();
    divToCreate.style.margin = '4px 0';
    boxes.push(divToCreate);
  }
  root.append(...boxes);
};

const onCreateBoxes = () => {
  const { value: boxAmount } = input;
  createBoxes(boxAmount);
  input.value = '';
};

const onDestroyBoxes = () => {
  root.innerHTML = '';
};

createBtn.addEventListener('click', onCreateBoxes);
deleteBtn.addEventListener('click', onDestroyBoxes);
