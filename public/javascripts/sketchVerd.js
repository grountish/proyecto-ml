let filter;
let mic, recorder, soundFile; // mic recorder
let state = 0;
let video;
let poseNet;
let poses = [];
let skeletons = [];

let keypoints = [];
let prevkeypoints = [];
let osc, reverb;

let notes = [60, 63, 67, 70, 55, 53, 46, 77];
let playing = [false, false, false, false, false, false, false]



function touchStarted() {
    if (getAudioContext().state !== 'running') {
      getAudioContext().resume();
    }
}

function setup() {
     
    let cnv = createCanvas(600, 600);
    cnv.mousePressed(canvasPressed);


    video = createCapture(VIDEO);
    video.size(width, height);
    poseNet = ml5.poseNet(video, modelReady);
    poseNet.on('pose', gotPoses);
    video.hide();

    // audio 
    filter = new p5.LowPass();
    osc = new p5.SqrOsc();
    osc.start();
    osc.amp(0);
    reverb = new p5.Reverb();
    delay = new p5.Delay();
    osc.disconnect()
    osc.connect(filter);
    filter.freq(2);
    filter.res(20);
    delay.process(osc, 0.5, .7, 1300);
    reverb.process(osc, 9, 5.2);
    reverb.amp(4);
    // MIC SET UP 
    mic = new p5.AudioIn();
    console.log(mic);
    mic.setSource()
    // prompts user to enable their browser mic
    mic.start();
  
    // create a sound recorder
    recorder = new p5.SoundRecorder();
  
    // connect the mic to the recorder
    recorder.setInput(mic);
  
    // this sound file will be used to
    // playback & save the recording
    soundFile = new p5.SoundFile();

}

function modelReady() {
    console.log("model ready");
}

function draw() {
    drawKeypoints();
}

function drawKeypoints() {
    let ran = random(200)
    if (poses.length == 0) {
        return;
    }

    prevkeypoints = keypoints;
    keypoints = poses[0].pose.keypoints;

    if (prevkeypoints.length == 0) {
        return;
    }

    for (let k = 0; k < keypoints.length; k++) {
        let k1 = prevkeypoints[k];
        let k2 = keypoints[k];
        
        fill(ran, ran, ran);
        noStroke()
        ellipse(k2.position.x, k2.position.y, ran,ran);

        let d = dist(k1.position.x, k1.position.y, k2.position.x, k2.position.y);
        if (d < 2) {
            continue;
        }

        let n = floor(map(k2.position.x, 0, width, 0, notes.length));

        if (!playing[n]) {
            playNote(n, 2000);
        }


    }
}


function playNote(n, duration) {
    var note = notes[n];
    var r = random();
    if (r < 0.25) {
        note += 7;
    } else if (r < 0.4) {
        note -= 7;
    }
    osc.freq(midiToFreq(note));
    playing[n] = true;
    osc.fade(.2, 1.2);
    if (duration) {
        setTimeout(function () {
                osc.fade(0, 1.2);
                playing[n] = false;
            },
            duration - 3);
    }
}

function gotPoses(results) {
    poses = results;
}

function canvasPressed() {
    // ensure audio is enabled
  
    // make sure user enabled the mic
    if (state === 0 && mic.enabled) {
  
      // record to our p5.SoundFile
      recorder.record(soundFile);
  
      background(255,0,0);
      text('Recording!', width/2, height/2);
      state++;
    }
    else if (state === 1) {
      background(0,255,0);
  
      // stop recorder and
      // send result to soundFile
      recorder.stop();
  
      text('Done! Tap to play and download', width/2, height/2, width - 20);
      state++;
    }
  
    else if (state === 2) {
      save(soundFile, 'mySound.wav');
      state++;
    }
  }