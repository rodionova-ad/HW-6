const cHeight = 700;
const cWidth = 1500;

const growthSpeed = 0.2;

const maxDiam = 120;
const maxD = 150;

let figures = [];
let direction;

function Figure(x, y, dir) {
	this.x = x;
	this.y = y;
	this.s = 1;
	this.v = random(0.02);
	this.c = {
		r: random(255),
		g: random(255),
		b: random(255),
	};
	this.dir = dir;
	this.chaos = false;
	this.isStay = true;

	this.moveLeft = () => {
		this.s = this.s + this.v;
		this.x = this.x - this.s;
	};

	this.moveRight = () => {
		this.s = this.s + this.v;
		this.x = this.x + this.s;
	};

	this.moveUp = () => {
		this.s = this.s + this.v;
		this.y = this.y - this.s;
	};

	this.moveDown = () => {
		this.s = this.s + this.v;
		this.y = this.y + this.s;
	};

	this.moveRandom = () => {
		this.dir = Math.round(random(1, 5));
	};

	this.moveChaos = () => {
		this.dir = Math.round(random(1, 5));
	};
}

function Rectangle(x, y, direction) {
	Figure.apply(this, [x, y, direction]);
	this.h = random(5, 70);
	this.w = random(5, 70);
	this.d;
	this.x = this.x - this.w / 2;
	this.y = this.y - this.h / 2;
	this.render = () => {
		this.w = this.w + growthSpeed;
		this.h = this.h + growthSpeed;
		this.d = Math.sqrt(this.w * this.w + this.h * this.h);
		fill(this.c.r, this.c.g, this.c.b);
		switch (this.dir) {
			case 1:
				this.moveUp();
				break;
			case 2:
				this.moveDown();
				break;
			case 3:
				this.moveLeft();
				break;
			case 4:
				this.moveRight();
				break;
			case 5:
				this.moveRandom();
				break;
		}
		rect(this.x, this.y, this.w, this.h);
	};
}

function Ball(x, y, direction) {
	Figure.apply(this, [x, y, direction]);
	this.diam = random(5, 70);
	this.render = () => {
		fill(this.c.r, this.c.g, this.c.b);
		this.diam = this.diam + growthSpeed;
		switch (this.dir) {
			case 1:
				this.moveUp();
				break;
			case 2:
				this.moveDown();
				break;
			case 3:
				this.moveLeft();
				break;
			case 4:
				this.moveRight();
				break;
			case 5:
				this.moveRandom();
				break;
		}
		circle(this.x, this.y, this.diam);
	};
}

function Pacman(x, y, direction) {
	Figure.apply(this, [x, y, direction]);
	this.diam = random(5, 70);
	this.render = () => {
		fill(this.c.r, this.c.g, this.c.b);
		this.diam = this.diam + growthSpeed;
		switch (this.dir) {
			case 1:
				this.moveUp();
				break;
			case 2:
				this.moveDown();
				break;
			case 3:
				this.moveLeft();
				break;
			case 4:
				this.moveRight();
				break;
			case 5:
				this.moveRandom();
				break;
		}
		arc(
			this.x,
			this.y,
			this.diam,
			this.diam,
			0.5,
			PI + HALF_PI + QUARTER_PI,
			PIE
		);
	};
}

function setup() {
	cnv = createCanvas(cWidth, cHeight);
	cnv.mousePressed(createFigure);
	cnv.position(45, windowHeight / 16 + 20);
	strokeWeight(0);
	frameRate(60);
}

function draw() {
	background("#FAEEDD");
	strokeWeight(1);
	figures.forEach(function (figure) {
		if (
			figure.x < 0 ||
			figure.x > cWidth ||
			figure.y < 0 ||
			figure.y > cHeight ||
			figure.diam > maxDiam ||
			figure.d > maxD
		) {
			figure.isStay = false;
		} else {
			for (let i = 0; i < figures.length; i++) {
				if (figures[i] == figure) {
					continue;
				} else {
					if (
						(figure instanceof Ball   && figures[i] instanceof Ball)   ||
						(figure instanceof Ball   && figures[i] instanceof Pacman) ||
						(figure instanceof Pacman && figures[i] instanceof Ball)   ||
						(figure instanceof Pacman && figures[i] instanceof Pacman)	
					) {
						if (dist(figure.x, figure.y, figures[i].x, figures[i].y) <= (figure.diam / 2 + figures[i].diam / 2)) {
							figure.isStay = false;
							figures[i].isStay = false;
						}
					}

					if (
						(figure instanceof Ball   && figures[i] instanceof Rectangle) ||
						(figure instanceof Pacman && figures[i] instanceof Rectangle)
					) {
						let testX = figure.x;
						let testY = figure.y;

						if (figure.x < figures[i].x) 
							testX = figures[i].x;
						else if (figure.x > figures[i].x + figures[i].w)
							testX = figures[i].x + figures[i].w;

						if (figure.y < figures[i].y) 
							testY = figures[i].y;
						else if (figure.y > figures[i].y + figures[i].h)
							testY = figures[i].y + figures[i].h;

						let distX = figure.x - testX;
						let distY = figure.y - testY;
						let distance = Math.sqrt(distX * distX + distY * distY);

						if (distance <= figure.diam / 2) {
							figure.isStay = false;
							figures[i].isStay = false;
						}
					}

					if (
						(figure instanceof Rectangle && figures[i] instanceof Ball  ) ||
						(figure instanceof Rectangle && figures[i] instanceof Pacman)
					) {
						let testX = figures[i].x;
						let testY = figures[i].y;

						if (figures[i].x < figure.x) 
							testX = figure.x;
						else if (figures[i].x > figure.x + figure.w)
							testX = figure.x + figure.w;

						if (figures[i].y < figure.y) 
							testY = figure.y;
						else if (figures[i].y > figure.y + figure.h)
							testY = figure.y + figure.h;

						let distX = figures[i].x - testX;
						let distY = figures[i].y - testY;
						let distance = Math.sqrt(distX * distX + distY * distY);

						if (distance <= figures[i].diam / 2) {
							figure.isStay = false;
							figures[i].isStay = false;
						}
					}

					if (figure instanceof Rectangle && figures[i] instanceof Rectangle) {
						if (figure.x + figure.w >= figures[i].x && figure.x <= figures[i].x + figures[i].w &&
							figure.y + figure.h >= figures[i].y && figure.y <= figures[i].y + figures[i].h) {
							figure.isStay = false;
							figures[i].isStay = false;
						}
					}
				}
			}
		}
		figures = figures.filter((figure) => figure.isStay);

		if (figure.chaos) {
			figure.moveChaos();
		}

		figure.render();
	});
}

function createFigure() {
	let figure;

	switch (Math.round(random(1, 3))) {
		case 1:
			figure = new Pacman(mouseX, mouseY, direction);
			break;
		case 2:
			figure = new Ball(mouseX, mouseY, direction);
			break;
		case 3:
			figure = new Rectangle(mouseX, mouseY, direction);
			break;
	}
	figures.push(figure);
	figures[figures.length - 1].chaos = direction == 6;
	figures[figures.length - 1].dir = direction;
}

function move(dir) {
	direction = dir;
	figures.forEach((figure) => {
		figure.chaos = direction == 6;
		figure.dir = dir;
	});
}

function clean() {
	figures = [];
	clear();
}
