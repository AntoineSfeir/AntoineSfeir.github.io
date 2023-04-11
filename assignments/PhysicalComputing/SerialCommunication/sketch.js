
let port;
let writer;
let slider;
let brightness;
let sensorValue;

function setup() {
    createCanvas(400, 400);
    if("serial" in navigator) {
        let button = createButton("Connect");
        button.position(10,0);
        button.mousePressed(connect);

        let button1 = createButton("Disconnect");
        button1.position(10,25);
        button1.mousePressed(disconnect);

        slider = createSlider(0, 255, 127);
        slider.position(10, 50);
        slider.style('width', '100px');
    }
}

function draw() {
    background(220);
    if(writer) {
        writer.write(new Uint8Array(slider.value()));
        brightness = slider.value();
        analogWrite(11, brightness)

        // Read the sensor value
        sensorValue = analogRead(A0);
  
        // Map the sensor value to a color value
        let colorValue = map(sensorValue, 0, 1023, 0, 255);
        background(colorValue, colorValue, colorValue);
    }
}


async function connect() {
    if (port) {
        console.log("Port already open");
        return;
    }
    try {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });
        console.log("Serial port opened successfully");
    } catch (err) {
        console.error(err);
    }
}

async function disconnect() {
    if (port) {
        await port.close();
        port = null;
        console.log("Serial port closed successfully");
    } else {
        console.log("Port is not open");
    }
}