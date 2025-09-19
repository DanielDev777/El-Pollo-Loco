const level1 = new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Endboss()
    ],
    [
        new Cloud()
    ],
    (() => {
        const arr = [];
        // Add initial set at -720
        arr.push(new BackgroundObject('img/5_background/layers/air.png', -720));
        arr.push(new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -720));
        arr.push(new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -720));
        arr.push(new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -720));

        for (let i = 0; i < 4; i++) {
            const x = i * 720;
            arr.push(new BackgroundObject('img/5_background/layers/air.png', x));
            const suffix = (i % 2 === 1) ? '2.png' : '1.png';
            arr.push(new BackgroundObject(`img/5_background/layers/3_third_layer/${suffix}`, x));
            arr.push(new BackgroundObject(`img/5_background/layers/2_second_layer/${suffix}`, x));
            arr.push(new BackgroundObject(`img/5_background/layers/1_first_layer/${suffix}`, x));
        }
        return arr;
    })(),
);