class Barrier {
  constructor(x, y, img0, img1, img2, img3) {
    this.x = x;
    this.y = y;
    this.w = 90;
    this.radius = 45;
    this.h = 35;
    this.radius = 35;
    this.img0 = img0;
    this.img1 = img1;
    this.img2 = img2;
    this.img3 = img3;
    this.currentImg = "0";
    this.hitCount = 0;
  }

  show() {
    if (this.currentImg === "0") {
      image(this.img0, this.x, this.y, this.w, this.h);
    } else if (this.currentImg === "1") {
      image(this.img1, this.x, this.y, this.w, this.h);
    } else if (this.currentImg === "2") {
      image(this.img2, this.x, this.y, this.w, this.h);
    } else if (this.currentImg === "3") {
      image(this.img3, this.x, this.y, this.w, this.h);
    }
  }

  update(hitCount) {
    if (hitCount == 0) {
      this.currentImg = "0";
    } else if (hitCount == 1) {
      this.currentImg = "1";
    } else if (hitCount == 2) {
      this.currentImg = "2";
    } else if (hitCount === 3) {
      this.currentImg = "3";
    }
  }
  remove(hitCount) {
    if(hitCount = 3) {
      return true;
    }
    return false;
  }
}
