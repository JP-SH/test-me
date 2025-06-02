const assert = require('assert');
const { forEach } = require('../index');

it('should sum an array', () => {
  const numbers = [1,2,3,4,5];

  let total = 0;
  forEach(numbers, (value) => {
    total += value;
  });

  assert.strictEqual(total, 15);
});
