// turns `first second "third fourth fifth"` into ["first", "second", "third fourth fifth"].length === 3
export const getParameters: (message: string) => string[] = (message: string) =>
  Array.from(
    (function*(string) {
      const encapsulator = ['"', "'", "`"];
      const escape = "\\";

      for (let index = 0; index < string.length; index++) {
        const start = index;
        const part = string[index];
        if (encapsulator.includes(part)) {
          while (index < string.length && string[++index] !== part) {
            if (string[index] === escape) {
              index += 1;
            }
          }
          yield string.slice(start + 1, index++);
        } else {
          while (index < string.length && string[++index] !== " ") {}
          yield string.slice(start, index);
        }
      }
    })(message)
  );

export default getParameters;
