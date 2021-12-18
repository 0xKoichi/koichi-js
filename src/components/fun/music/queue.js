module.exports = class Queue {
  constructor(voice) {
    this.voice = voice;
    this.elements = [];
  }

  get isEmpty() {
    return this.elements.length === 0;
  }

  get size() {
    return this.elements.length;
  }

  enqueue(e) {
    this.elements.push(e);
  }

  dequeue(e) {
    this.elements.shift();
  }

  peek() {
    return !this.isEmpty ? this.elements[0] : undefined;
  }

  has(e) {
    for (const i of this.elements) {
      if (i === e) return true;
    }
    return false;
  }
};
