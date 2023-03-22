type Subscriber<T> = (map: T[]) => void;
type Unsubscribe = () => void;

export class EventBus<T extends { id: string | number | symbol }> {
  private map: Map<string | number | symbol, T>;
  private mapChangeSubs = new Map<Subscriber<T>, Subscriber<T>>();

  constructor(initialValues?: T[]) {
    this.map = new Map();
    initialValues?.forEach((value) => {
      this.map.set(value.id, value);
    });
  }

  private onChange = () => {
    const values = [...this.map.values()];
    this.mapChangeSubs.forEach((callback) => {
      callback(values);
    });
  };

  subscribe = (callback: Subscriber<T>): Unsubscribe => {
    this.mapChangeSubs.set(callback, callback);
    return () => {
      this.mapChangeSubs.delete(callback);
    };
  };

  push = (value: T) => {
    if (!this.map.has(value.id)) {
      this.map.set(value.id, value);
      this.onChange();
    } else {
      throw new Error("This values already exist");
    }
  };

  reset = () => {
    this.map.clear();
    this.onChange();
  };

  setNewValues = (values: T[]) => {
    this.map.clear();
    values.forEach((value) => {
      this.map.set(value.id, value);
    });
    this.onChange();
  };

  deleteById = (value: T) => {
    if (this.map.has(value.id)) {
      this.map.delete(value.id);
      this.onChange();
    } else {
      throw new Error("Item with such id doesn't exist");
    }
  };
}
