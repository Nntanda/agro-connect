import fetch from 'node-fetch';

function translateText(prompt) {
  const url = 'https://sunbird-ai-api-5bq6okiwgq-ew.a.run.app/';

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJLaW1LYXNvemkxIiwiZXhwIjo0ODQxMzAwNzMzfQ.oZnRumUwDVi6kYvokKWqDgMGe6tq3Pfz58w3sykmo2E';

  const headers = {
    'Authorization': `Bearer ${token}`,
    'content-type': 'application/json'
  };

  const payload = {
    'source_language': 'Luganda',
    'target_language': 'English',
    'text': prompt
  };

  fetch(`${url}/tasks/translate`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (response.status === 200) {
        response.json()
          .then(data => {
            const translated_text = data.text;
            console.log('Translated text: ', translated_text);
          });
      } else {
        console.log('Error: ', response.status, response.statusText);
      }
    })
    .catch(error => {
      console.error('Error: ', error);
    });
}

export default translateText;

// translateText('Let us go back home.');