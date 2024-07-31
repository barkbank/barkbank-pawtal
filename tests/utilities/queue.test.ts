import { Queue } from "@/lib/utilities/queue";

describe("Queue", () => {
  it("returns values in the order offered", () => {
    const q = new Queue<string>();
    q.offer("P");
    q.offer("X");
    q.offer("W");
    expect(q.poll()).toEqual("P");
    expect(q.poll()).toEqual("X");
    expect(q.poll()).toEqual("W");
    expect(q.poll()).toBeUndefined();
  });
});
