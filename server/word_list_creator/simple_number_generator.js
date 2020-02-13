class SimpleRandomNumberGenerator {
  constructor(maxNum) {
    this.nums = Array.from(Array(maxNum).keys());
    this.currentNum = 0;

    // shuffle the array
    let currentLength = this.nums.length;
    while (currentLength > 0) {
      let chosen = Math.floor(Math.random() * currentLength);
      let temp = this.nums[currentLength - 1]; // save the item in last position
      this.nums[currentLength - 1] = this.nums[chosen]; // move chosen to the last item
      this.nums[chosen] = temp; // move item that was in last position to chosen position
      currentLength--;
    }
  }

  nextInt() {
    if (this.currentNum === this.nums.length) {
      this.currentNum = 0; // just loop back around
    }

    return this.nums[this.currentNum++];
  }
}

module.exports = SimpleRandomNumberGenerator;
