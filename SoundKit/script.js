document.addEventListener('DOMContentLoaded', appStart)

const channel1=[]
const channel2=[]
const channel3=[]
const channel4=[]

const sounds = {
    97:"boom",
    115:"clap",
    100:"hihat",
    102:"kick",
    103:"openhat",
    104:"ride",
    106:"snare",
    107:"tink",
    108:"tom"
}

let isRecordingChannel1 = false
let isRecordingChannel2 = false
let isRecordingChannel3 = false
let isRecordingChannel4 = false
let channel1RecStart=0
let channel2RecStart=0
let channel3RecStart=0
let channel4RecStart=0
function appStart(){
    window.addEventListener('keypress', playSound)
    document.querySelector('#rec1').addEventListener('click', recAudioChannel1)
    document.querySelector('#rec2').addEventListener('click', recAudioChannel2)
    document.querySelector('#rec3').addEventListener('click', recAudioChannel3)
    document.querySelector('#rec4').addEventListener('click', recAudioChannel4)
    //document.querySelector('#play').addEventListener('click', playAudio(channel1))
}

function playAudio(channel){
    channel.forEach(sound =>{
        setTimeout(()=>{
            const audioDOM = document.querySelector(`#${sound.name}`)
            audioDOM.currentTime=0;
            audioDOM.play()
        }, sound.time)
    })
}

function recAudioChannel1(e){
    channel1RecStart=Date.now()
    isRecordingChannel1=!isRecordingChannel1
    e.target.innerHTML=isRecordingChannel1? "Stop" : "Record"
}

function recAudioChannel2(e){
    channel2RecStart=Date.now()
    isRecordingChannel2=!isRecordingChannel2
    e.target.innerHTML=isRecordingChannel2? "Stop" : "Record"
}

function recAudioChannel3(e){
    channel3RecStart=Date.now()
    isRecordingChannel3=!isRecordingChannel3
    e.target.innerHTML=isRecordingChannel3? "Stop" : "Record"
}

function recAudioChannel4(e){
    channel4RecStart=Date.now()
    isRecordingChannel4=!isRecordingChannel4
    e.target.innerHTML=isRecordingChannel4? "Stop" : "Record"
}

function playSound(e){
   if(!sounds[e.charCode]) return
    const soundName = sounds[e.charCode]
    const audioDOM = document.querySelector(`#${soundName}`)
    audioDOM.currentTime=0;
    audioDOM.play()
    if(isRecordingChannel1){
        channel1.push({
            name: soundName,
            time: Date.now()-channel1RecStart
        })
    }

    if(isRecordingChannel2){
        channel2.push({
            name: soundName,
            time: Date.now()-channel2RecStart
        })
    }

    if(isRecordingChannel3){
        channel3.push({
            name: soundName,
            time: Date.now()-channel3RecStart
        })
    }

    if(isRecordingChannel4){
        channel4.push({
            name: soundName,
            time: Date.now()-channel4RecStart
        })
    }
    
}