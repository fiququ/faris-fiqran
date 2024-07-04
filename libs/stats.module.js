var Stats = function () {

    var mode = 0;

    var container = document.createElement('div');
    container.style.cssText = 'position:fixed;bottom:20px;right:20px;cursor:pointer;opacity:0.9;z-index:10000;transform: scale(1.2);text-align:center'; // Adjusted position and scale for larger UI

    // Adding the "CLICK TO SWAP MODE" text with background rectangle
    var infoText = document.createElement('div');
    infoText.style.cssText = 'position:relative;color:#fff;font-family:Arial, sans-serif;font-size:10px;padding:3px;margin:0 auto; background-color: rgba(139, 69, 19, 0.7);'; // Brown color
    infoText.textContent = 'CLICK TO SWAP METRIC PANELS';

    // Add event listeners for hover effect
    infoText.addEventListener('mouseover', function () {
        infoText.style.backgroundColor = 'rgba(101, 53, 15, 0.7)'; // Dark brown color on hover
    });

    infoText.addEventListener('mouseout', function () {
        infoText.style.backgroundColor = 'rgba(139, 69, 19, 0.7)'; // Reset to brown when not hovering
    });

    container.appendChild(infoText);

    container.addEventListener('click', function (event) {

        event.preventDefault();
        showPanel(++mode % container.children.length);

    }, false);

    //

    function addPanel(panel) {

        container.appendChild(panel.dom);
        return panel;

    }

    function showPanel(id) {

        for (var i = 0; i < container.children.length; i++) {

            container.children[i].style.display = i === id ? 'block' : 'none';

        }

        mode = id;

    }

    //

    var beginTime = (performance || Date).now(), prevTime = beginTime, frames = 0;

    var fpsPanel = addPanel(new Stats.Panel('FPS', '#0ff', '#002'));
    var msPanel = addPanel(new Stats.Panel('MS', '#0f0', '#020'));

    if (self.performance && self.performance.memory) {

        var memPanel = addPanel(new Stats.Panel('MB', '#f08', '#201'));

    }

    showPanel(0);

    return {

        REVISION: 16,

        dom: container,

        addPanel: addPanel,
        showPanel: showPanel,

        begin: function () {

            beginTime = (performance || Date).now();

        },

        end: function () {

            frames++;

            var time = (performance || Date).now();

            msPanel.update(time - beginTime, 200);

            if (time >= prevTime + 1000) {

                fpsPanel.update((frames * 1000) / (time - prevTime), 100);

                prevTime = time;
                frames = 0;

                if (memPanel) {

                    var memory = performance.memory;
                    memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);

                }

            }

            return time;

        },

        update: function () {

            beginTime = this.end();

        },

        // Backwards Compatibility

        domElement: container,
        setMode: showPanel

    };

};

Stats.Panel = function (name, fg, bg) {

    var min = Infinity, max = 0, round = Math.round;
    var PR = round(window.devicePixelRatio || 1);

    var WIDTH = 96 * PR, HEIGHT = 58 * PR, // Adjusted dimensions for larger UI
        TEXT_X = 4 * PR, TEXT_Y = 3 * PR,
        GRAPH_X = 4 * PR, GRAPH_Y = 18 * PR,
        GRAPH_WIDTH = 88 * PR, GRAPH_HEIGHT = 34 * PR;

    var canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvas.style.cssText = 'width:96px;height:58px;position:relative;'; // Adjusted dimensions for larger UI

    var context = canvas.getContext('2d');
    context.font = 'bold ' + (11 * PR) + 'px Helvetica,Arial,sans-serif'; // Adjusted font size for larger UI
    context.textBaseline = 'top';

    context.fillStyle = bg;
    context.fillRect(0, 0, WIDTH, HEIGHT);

    context.fillStyle = fg;
    context.fillText(name, TEXT_X, TEXT_Y);
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

    context.fillStyle = bg;
    context.globalAlpha = 0.9;
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

    return {

        dom: canvas,

        update: function (value, maxValue) {

            min = Math.min(min, value);
            max = Math.max(max, value);

            context.fillStyle = bg;
            context.globalAlpha = 1;
            context.fillRect(0, 0, WIDTH, GRAPH_Y);
            context.fillStyle = fg;
            context.fillText(round(value) + ' ' + name + ' (' + round(min) + '-' + round(max) + ')', TEXT_X, TEXT_Y);

            context.drawImage(canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT);

            context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);

            context.fillStyle = bg;
            context.globalAlpha = 0.9;
            context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round((1 - (value / maxValue)) * GRAPH_HEIGHT));

        }

    };

};

export { Stats };
