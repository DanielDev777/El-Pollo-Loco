const level1 = new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Endboss()
    ],
    [
        new Cloud(0),
        new Cloud(1),
        new Cloud(0),
        new Cloud(1),
        new Cloud(0),
        new Cloud(1),
        new Cloud(0),
        new Cloud(1),
    ],
    (() => {
        const arr = [];
        arr.push(new BackgroundObject('img/5_background/layers/air.png', -719));
        arr.push(new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719));
        arr.push(new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719));
        arr.push(new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719));

        for (let i = 0; i < 4; i++) {
            const x = i * 719;
            arr.push(new BackgroundObject('img/5_background/layers/air.png', x));
            const suffix = (i % 2 === 1) ? '2.png' : '1.png';
            arr.push(new BackgroundObject(`img/5_background/layers/3_third_layer/${suffix}`, x));
            arr.push(new BackgroundObject(`img/5_background/layers/2_second_layer/${suffix}`, x));
            arr.push(new BackgroundObject(`img/5_background/layers/1_first_layer/${suffix}`, x));
        }
        return arr;
    })(),
    [
        new Bottle(500),
        new Bottle(1000),
        new Bottle(1500),
        new Bottle(2000)
    ],
    [
        new Coin(300),
        new Coin(800),
        new Coin(1400),
        new Coin(2100)
    ],
);