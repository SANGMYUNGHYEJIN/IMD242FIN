// 종횡비를 고정하고 싶을 경우: 아래 두 변수를 0이 아닌 원하는 종, 횡 비율값으로 설정.
// 종횡비를 고정하고 싶지 않을 경우: 아래 두 변수 중 어느 하나라도 0으로 설정.
const aspectW = 4;
const aspectH = 3;

const container = document.body.querySelector('.container-canvas');
// 필요에 따라 이하에 변수 생성.

const {
  Body,
  Bodies,
  Engine,
  Composite,
  Mouse,
  MouseConstraint,
  Vector,
  Events,
} = Matter;
let engine, world;
let boxes = [];
let walls = [];
let canvas;
let mouse, mouseConstraint;

function setup() {
  // 컨테이너의 현재 위치, 크기 등의 정보 가져와서 객체구조분해할당을 통해 너비, 높이 정보를 변수로 추출.
  const { width: containerW, height: containerH } =
    container.getBoundingClientRect();
  // 종횡비가 설정되지 않은 경우:
  // 컨테이너의 크기와 일치하도록 캔버스를 생성하고, 컨테이너의 자녀로 설정.
  if (aspectW === 0 || aspectH === 0) {
    canvas = createCanvas(containerW, containerH);
    canvas.parent(container);
  }
  // 컨테이너의 가로 비율이 설정한 종횡비의 가로 비율보다 클 경우:
  // 컨테이너의 세로길이에 맞춰 종횡비대로 캔버스를 생성하고, 컨테이너의 자녀로 설정.
  else if (containerW / containerH > aspectW / aspectH) {
    canvas = createCanvas((containerH * aspectW) / aspectH, containerH);
    canvas.parent(container);
  }
  // 컨테이너의 가로 비율이 설정한 종횡비의 가로 비율보다 작거나 같을 경우:
  // 컨테이너의 가로길이에 맞춰 종횡비대로 캔버스를 생성하고, 컨테이너의 자녀로 설정.
  else {
    canvas = createCanvas(containerW, (containerW * aspectH) / aspectW);
    canvas.parent(container);
  }

  init();
  // createCanvas를 제외한 나머지 구문을 여기 혹은 init()에 작성.
  engine = Engine.create();
  world = engine.world;

  walls.push(Bodies.rectangle(width * 0.5, 0, 10000, 100, { isStatic: true }));
  walls.push(
    Bodies.rectangle(width, height * 0.5, 100, 10000, { isStatic: true })
  );
  walls.push(
    Bodies.rectangle(width * 0.5, height, 10000, 100, { isStatic: true })
  );
  walls.push(Bodies.rectangle(0, height * 0.5, 100, 10000, { isStatic: true }));
  Composite.add(world, walls);

  mouse = Mouse.create(canvas.elt);
  mouse.pixelRatio = pixelDensity();
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });
  Composite.add(world, mouseConstraint);

  //matter.js event 함수 참고
  // perplexity 참고
  Events.on(engine, 'collisionStart', (event) => {
    const pairs = event.pairs;
    pairs.forEach((pair) => {
      const { bodyA, bodyB } = pair;

      if (boxes.includes(bodyA)) {
        bodyA.color = rpc();
      } //aksdlfbodyAdprp cndehfgoTekaus?
      if (boxes.includes(bodyB)) {
        bodyB.color = rpc();
      }
    });
  });
}

function rpc() {
  const r = Math.round(random(127, 255)); //반올림
  const g = Math.round(random(127, 255));
  const b = Math.round(random(127, 255));
  return `rgb(${r}, ${g}, ${b})`; //xpavmffltflxjfjf
}

function mousePressed() {
  const color = {
    r: Math.round(random(127, 255)),
    g: Math.round(random(127, 255)),
    b: Math.round(random(127, 255)),
  };

  const sw = random(20, 100);
  const sh = random(20, 100);

  const box = Bodies.rectangle(mouseX, mouseY, sw, sh, {
    restitution: 0.6, //통통튀어오르는정도. 이정도 상태가 가장 적당한듯
    friction: 0.1,
  });

  box.color = `rgb(${color.r}, ${color.g}, ${color.b})`;

  console.log('Created box with color:', box.color);

  Composite.add(world, box); //혜진아부탁이다뭘만들얶으면세계에추가를해
  boxes.push(box);
}

function init() {}

function draw() {
  background(255);
  Engine.update(engine);

  boxes.forEach((aBox) => {
    console.log('아니대체뭐가문제임:', aBox.color); //자꾸 색깔이 안 되어서 콘솔 넣어봤는데 rgb값이 소수점자리까지 내려갔던게 문제였던 거 같긴함.
    if (aBox.color) {
      const [r, g, b] = aBox.color.match(/\d+/g).map(Number);
      // perplexity 참고. aBox color가 가진 rgb값을 컴퓨터가 계산할 수 있는 실제 값으로 변경. 그 후 r,g,b에 각각 넣어서 색상을 바꿈.
      fill(r, g, b);
    } else {
      fill('white');
    }

    beginShape();
    aBox.vertices.forEach((aVertex) => {
      vertex(aVertex.x, aVertex.y);
    });
    endShape(CLOSE);
  });

  walls.forEach((aBody) => {
    fill(40);
    noStroke();
    beginShape();
    aBody.vertices.forEach((aVertex) => {
      vertex(aVertex.x, aVertex.y);
    });
    endShape(CLOSE);
  });
}

function windowResized() {
  // 컨테이너의 현재 위치, 크기 등의 정보 가져와서 객체구조분해할당을 통해 너비, 높이 정보를 변수로 추출.
  const { width: containerW, height: containerH } =
    container.getBoundingClientRect();
  // 종횡비가 설정되지 않은 경우:
  // 컨테이너의 크기와 일치하도록 캔버스 크기를 조정.
  if (aspectW === 0 || aspectH === 0) {
    resizeCanvas(containerW, containerH);
  }
  // 컨테이너의 가로 비율이 설정한 종횡비의 가로 비율보다 클 경우:
  // 컨테이너의 세로길이에 맞춰 종횡비대로 캔버스 크기를 조정.
  else if (containerW / containerH > aspectW / aspectH) {
    resizeCanvas((containerH * aspectW) / aspectH, containerH);
  }
  // 컨테이너의 가로 비율이 설정한 종횡비의 가로 비율보다 작거나 같을 경우:
  // 컨테이너의 가로길이에 맞춰 종횡비대로 캔버스 크기를 조정.
  else {
    resizeCanvas(containerW, (containerW * aspectH) / aspectW);
  }
  // 위 과정을 통해 캔버스 크기가 조정된 경우, 다시 처음부터 그려야할 수도 있다.
  // 이런 경우 setup()의 일부 구문을 init()에 작성해서 여기서 실행하는게 편리하다.
  // init();
  Body.setPosition(walls[1], Vector.create(width, height * 0.5));
  Body.setPosition(walls[2], Vector.create(width * 0.5, height));
}
