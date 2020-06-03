import { debounce } from 'lodash';
import EVENT_EMITTER from './services/EventEmitter';

export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    EVENT_EMITTER.on('get-images', this.addItems.bind(this));
    EVENT_EMITTER.on('set-category', this.setCategory.bind(this.model));
    window.addEventListener('scroll', this.handleGetImagesByScroll.bind(this));
  }

  addItems(items, category) {
    this.model.category !== category
      ? this.model.addAdditionalItems(items)
      : this.model.addNewItems(items);
    EVENT_EMITTER.emit('add-to-model', this.model.imageList);
  }

  setCategory(category) {
    if (this.category !== category) this.setCategory(category);
  }

  handleGetImagesByScroll() {
    window.onscroll = debounce(() => {
      const { imageList } = this.model;
      if (
        window.innerHeight + Math.ceil(document.documentElement.scrollTop) === document.documentElement.offsetHeight &&
        imageList.length >= 20
      ) {
        EVENT_EMITTER.emit('set-offset');
      }
    }, 12);
  }
}
