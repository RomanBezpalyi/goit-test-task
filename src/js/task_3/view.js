import * as basicLightbox from 'basiclightbox';

import EVENT_EMITTER from './services/EventEmitter';
import { getImages } from './services/api';

export default class View {
  constructor() {
    // QUERY SELECTORS

    this.form = document.querySelector('#search-form');
    this.list = document.querySelector('#images');

    // EVENT LISTENERS

    EVENT_EMITTER.on('add-to-model', this.render.bind(this));
    EVENT_EMITTER.on(
      'set-offset',
      this.handleGetImages.bind(this)
    );
    EVENT_EMITTER.on('show-modal', this.onShowModal.bind(this))
    this.form.addEventListener('submit', this.onFormSubmit.bind(this));
  }
  instance;

  onFormSubmit(e) {
    e.preventDefault();
    const {
      target: {
        firstElementChild: { value },
      },
    } = e;
    EVENT_EMITTER.emit('set-category', value);

    this.handleGetImages(value);
  }

  handleGetImages(value) {
    const query = value ? value : this.form.firstElementChild.value;
    const images = [];
    getImages(query, (this.list.childElementCount / 20) + 1)
      .then(({ data: { hits: imageArr } }) => {
        imageArr.forEach(({ tags, webformatURL, largeImageURL }) => {
          const image = { tags, webformatURL, largeImageURL };
          images.push(image);
        });
      })
      .then(() => EVENT_EMITTER.emit('get-images', images, value))
      .catch((e) => console.error(e));
  }

  createDOMElement(tag, className, attributes) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    if (attributes) {
      const attributeArr = Object.entries(attributes);
      attributeArr.forEach(([attribute, value]) =>
        element.setAttribute(attribute, value)
      );
    }
    return element;
  }

  createListItem(item) {
    const { webformatURL, largeImageURL, tags } = item;
    const li = this.createDOMElement('li', 'img-list__item');
    const a = this.createDOMElement('a', null, { href: largeImageURL });
    const img = this.createDOMElement('img', 'img-list__image', {
      src: webformatURL,
      'data-source': largeImageURL,
      alt: tags,
    });

    a.appendChild(img);
    li.appendChild(img);

    li.addEventListener('click', this.onItemClick.bind(this))

    return li;
  }

  onItemClick({ currentTarget: { firstElementChild } }) {
    const path = firstElementChild.getAttribute('data-source');
    this.instance = basicLightbox.create(`<div class='modal'>
    <img src=${path} width="800" height="600" ></div>
`)

    this.instance.show()
    EVENT_EMITTER.emit('show-modal');
  }

  closeModal() {
    this.instance.close();
  }

  onShowModal() {
    const modal = document.querySelector('.modal');
    modal.addEventListener('click', this.closeModal.bind(this));
  }

  render(images) {
    this.list.innerHTML = '';

    const itemsToAdd = images.map((image) => this.createListItem(image));

    this.list.append(...itemsToAdd);
  }
}
