function Drop(x, y) {
    this.x = x;
    this.y = y;

    this.show = function () {
        noStroke();
        fill(50, 0, 200);
        ellipse(this.x, this.y, 9, 9);
    }

    this.move = function (dir) {
        this.y = this.y -1;
    }
}