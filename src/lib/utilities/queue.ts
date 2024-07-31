// TODO: Do we need this?
export class Queue<T> {
  private head: _Item<T> | undefined;
  private tail: _Item<T> | undefined;

  offer(value: T) {
    const item = new _Item(value);
    if (this.tail === undefined) {
      this.head = item;
      this.tail = item;
    } else {
      this.tail.next = item;
      this.tail = item;
    }
  }

  poll(): T | undefined {
    if (this.head === undefined) {
      return undefined;
    }
    const item = this.head;
    this.head = item.next;
    if (this.head === undefined) {
      this.tail = undefined;
    }
    return item.value;
  }
}

class _Item<T> {
  constructor(
    public value: T,
    public next?: _Item<T> | undefined,
  ) {}
}
