
let port;
let writer;
let slider;
let brightness;
let sensorValue;
let encoder = new TextEncoder();
let reader, colorValue;

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
    readLoop();

    background(colorValue, colorValue, colorValue);
    if(writer) {
        brightness = slider.value();
        let writeString = brightness + "\n";
        writer.write(encoder.encode(writeString));  
    }
}

async function readLoop() { 
    // Listen to data coming from the serial device.
    if (!reader) {
        return;
    }
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            reader.releaseLock();
            break;
        }
    // value is a string.
    colorValue = round(map(value, 0, 1023, 0, 255));
    console.log(colorValue);
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
        writer = port.writable.getWriter();
        let textDecoder = new TextDecoderStream();
        let readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        reader = textDecoder.readable
  .pipeThrough(new TransformStream(new LineBreakTransformer()))
  .getReader();


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

class LineBreakTransformer {
    constructor() {
      // A container for holding stream data until a new line.
      this.chunks = "";
    }
  
    transform(chunk, controller) {
      // Append new chunks to existing chunks.
      this.chunks += chunk;
      // For each line breaks in chunks, send the parsed lines out.
      const lines = this.chunks.split("\n");
      this.chunks = lines.pop();
      lines.forEach((line) => controller.enqueue(line));
    }
  
    flush(controller) {
      // When the stream is closed, flush any remaining chunks out.
      controller.enqueue(this.chunks);
    }
  }