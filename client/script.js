import bot from './assets/bot.svg'
import user from './assets/user.svg'
import axios from 'axios';

let mess="";
let mess2="";
let SL="Luganda";
const audioChunks = [];

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');
// Get the dropdown element
const dropdown = document.getElementById('dropdown-content');
// const dropdownContent = document.querySelector('#dropdown-content'); //You may need to delete this.

let loadInterval;

function loader(element){
    element.textContent = '';
    loadInterval = setInterval(() => {
        element.textContent += '.';

        if (element.textContent === '.....'){
            element.textContent = '';
        }
    }, 300)
}

// The effect of the AI to behave as though it were thinking and typing whatever it gets as the result
function typeText(element, text){
    let index = 0;
    let interval = setInterval(() =>{
        if(index < text.length){
            element.innerHTML += text.charAt(index);
            index++;
        }else{
            clearInterval(interval);
        }
    }, 20)
}

function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString =  randomNumber.toString(16);
    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId){
    return(
        `
            <div class="wrapper ${isAi && 'ai'}">
                <div class="chat">
                    <div class="profile">
                        <img 
                            src="${isAi ? bot: user}"
                            alt="${isAi ? 'bot' : 'user'}"
                        />
                    </div>
                    <div class="message" id="${uniqueId}">${value}</div>
                </div>
            </div>
        `
    )
}

// const handleLanguageSelection = (e) => {
//   if (e.target.tagName === 'A') {
//     const selectedLanguageId = e.target.id;
//     const selectedLanguage = selectedLanguageId.split('-')[1];
//     SL = selectedLanguage;
//     console.log('Selected Language:', SL);
//   }
// };

// Add a click event listener to the dropdown
dropdown.addEventListener('click', function(event) {
  // Prevent the default link behavior
  event.preventDefault();
  const selectedLanguageId = event.target.id;
  const selectedLanguage = selectedLanguageId.split('-')[1];
  SL = selectedLanguage;
  console.log('Selected Language:', SL);

  // Get the clicked element's ID
  // const selectedItemId = event.target.id;

  // Display the selected item's ID in the console
  // console.log(selectedItemId);
});

const handleSubmit = async(e) => {
    e.preventDefault()
    const data = new FormData(form);
    const userPrompt = data.get('prompt');
    // user's chat Stripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
    form.reset();
    // const data2 = new FormData(form);
    // const languageObtained = data2.get('lang');
    // console.log(languageObtained);
    // Display user's prompt in the console
    console.log("User input: ", userPrompt);
    //sending users text to sunbird for translation 
const translation = await axios.post('http://localhost:8080', {
  text: userPrompt,
  src_lang: SL,
  tgt_lang: 'English'
})
  .then(response => {
    if (response.status === 200) {
      const translatedText = response.data.translatedText;
      console.log('Translated text:', translatedText);
      // Use the translated text as needed in your script
      return translatedText;
      
    } else {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
//end of the sending
    
    // bot's chat Stripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
    // the ability for the page to auto scroll as the message is being displayed
    chatContainer.scrollTop = chatContainer.scrollHeight;
    const messageDiv = document.getElementById(uniqueId);
    loader(messageDiv);
    // Obtaining a response from the bot ---> fetching data from the server
    const response = await fetch("http://localhost:5000", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            //send to bot our translated text from the user
            prompt: translation 
            //data.get('prompt')
        })
    })
    clearInterval(loadInterval);
    messageDiv.innerHTML = '';
    if (response.ok){
        const data = await response.json();
        const parseData = data.bot.trim();
        //sending bots reply to text summarizer 
         const summarized = await axios.post('http://localhost:8060', {
           text: parseData
         })  
   .then(response => {
     if (response.status === 200) {
       const data = response.data;
       const message = data.summary;
       const summarizedText =JSON.stringify(message)
       //mess2 = summarizedText;
       // Use the translated text as needed in your script
       console.log(message)
       return message;
      
     } else {
       throw new Error(`Error: ${response.status} ${response.statusText}`);
     }
   })
   .catch(error => {
     console.error('Error:', error);
   });
//end of the sending to summarizer
        //sending bots reply from sunbird for interpretation
        const botsReply = await axios.post('http://localhost:8080', {
  text: summarized,
  src_lang:'English',
  tgt_lang: SL
})
  .then(response => {
    if (response.status === 200) {
      const translatedText = response.data.translatedText;
      mess = translatedText;
      // Use the translated text as needed in your script
      return translatedText;
      
    } else {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
//end of the sending
        typeText(messageDiv, botsReply);
        console.log("Bot's English Reply: ", parseData);
        console.log("Bot's Summarized English Reply: ", summarized);         
        console.log("SunBd's Local version: ", mess);
    }else{
        const err = await response.text();
        messageDiv.innerHTML = "Something went wrong!!";
        alert(err);
    }
}

// dropdownContent.addEventListener('click', handleLanguageSelection);
form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e);
    }
});

function refreshInterface() {
  // Clear the chat container
  chatContainer.innerHTML = '';
  // Reset any necessary variables or state
  mess = "";
  SL = "Luganda";
  // Perform any other actions required to refresh the interface
}

function handleScroll() {
  // Check if the scroll position is at the top
  if (window.pageYOffset <= 8) {
    // Refresh the interface
    refreshInterface();
  }
} 


window.addEventListener('scroll', handleScroll);

/*const recordButton = document.getElementById('record-button');
let mediaStream;
let mediaRecorder;
recordButton.addEventListener('click', () => {
  
  if (!mediaRecorder) {
    console.log("recording started");
    // Start recording
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        mediaStream = stream;
        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.start();
        recordButton.classList.add('recording-button');
      })
      .catch((error) => {
        console.error('Error accessing microphone:', error);
      });
  } else {
    // Stop recording
    mediaRecorder.stop();
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaRecorder = null;
    console.log("stopped recording")
    recordButton.classList.remove('recording-button');
  }
});

if (typeof MediaRecorder === 'undefined') {
  console.error('MediaRecorder API is not supported by this browser.');
} else {
  mediaRecorder.addEventListener('dataavailable', (event) => {
    if (event.data instanceof Blob && event.data.size > 0) {
      audioChunks.push(event.data);
    }
  });
console.log("processing");
mediaRecorder.addEventListener('stop', () => {
  const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
  audioChunks.length = 0; // Clear the recorded chunks
  const audioUrl = URL.createObjectURL(audioBlob);
  
  // You can now use the audioUrl as needed, for example:
  // - Sending it to the server
  // - Playing it back on the page
  // - Saving it to local storage
  
  // Example: Saving the audio file to a folder on the device's root storage
  const downloadLink = document.createElement('a');
  downloadLink.href = audioUrl;
  downloadLink.download = 'recorded.wav';
  downloadLink.click();
  
  // Note: Saving files directly to the device's root storage is not possible
  //       due to browser security restrictions. The file will be downloaded
  //       to the user's default download folder.
});
}*/