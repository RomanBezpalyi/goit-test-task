export default class Model {
  constructor(images = [], category = '') {
    this.imageList = images;
    this.category = category;
  }

  addNewItems(items) {
    this.imageList = [...items];
    return items;
  }

  addAdditionalItems(items) {
    this.imageList = [...this.imageList, ...items];
    return items;
  }

  setCategory(category) {
    this.category = category;
    return category;
  }
}
